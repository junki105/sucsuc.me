import { APIGatewayEvent } from 'aws-lambda'
import { Context } from '../utils/types'
import faunaFetch, { Fauna } from '../../core/utils/fauna'
import { calculateSalesPrice, calculateFee, APP_FEE_PERCENTAGE } from '../../core/entities/Payment'

import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // https://github.com/stripe/stripe-node#configuration
  apiVersion: '2020-08-27',
})

export async function handler(event: APIGatewayEvent, context: Context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 200, body: '' }
  }

  try {
    const stripeEvent = stripe.webhooks.constructEvent(
      event.body as string,
      event.headers['stripe-signature'],
      process.env.STRIPE_WEBHOOK_SECRET as string
    );

    if (stripeEvent.type === 'checkout.session.completed') {
      const session = stripeEvent.data.object as Stripe.Checkout.Session
      if (session.mode === 'payment' && session.payment_status === 'paid' && session.payment_intent) {
        const paymentIntent: Stripe.PaymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent as string)
        const charge: Stripe.Charge = (paymentIntent.charges as Stripe.ApiList<Stripe.Charge>).data[0]

        const uuid = (session.metadata as Stripe.Metadata).product_uuid as string
        const productResult = await faunaFetch({
          query: Fauna.Query.getProductByUuid,
          variables: { uuid: uuid },
        });

        const paymentResult = await faunaFetch({
          query: Fauna.Query.getPaymentByChargeStripeID,
          variables: { chargeStripeID: charge.id },
        })
        if (!paymentResult.data || !paymentResult.data.getPaymentByChargeStripeID._id) {
          await faunaFetch({
            query: Fauna.Mutation.createPayment,
            variables: {
              accountNetlifyID: productResult.data.getProductByUuid.netlifyID,
              customerStripeID: charge.customer,
              product: productResult.data.getProductByUuid._id,
              chargeStripeID: charge.id,
              productName: productResult.data.getProductByUuid.title,
              chargePrice: charge.amount,
              salesPrice: calculateSalesPrice(charge.amount),
              fee: calculateFee(charge.amount),
              feePercentage: APP_FEE_PERCENTAGE,
            },
          })
        }
      }
    } else if (stripeEvent.type === 'charge.succeeded') {
      const charge = stripeEvent.data.object as Stripe.Charge
      if (charge.invoice) {
        const paymentResult = await faunaFetch({
          query: Fauna.Query.getPaymentByChargeStripeID,
          variables: { chargeStripeID: charge.id },
        })
        if (!paymentResult.data || !paymentResult.data.getPaymentByChargeStripeID._id) {
          const invoice = await stripe.invoices.retrieve(charge.invoice as string)
          const subscription: Stripe.Response<Stripe.Subscription> = await stripe.subscriptions.retrieve(invoice.subscription as string)
          const subscriptionItem: Stripe.SubscriptionItem = (subscription.items as Stripe.ApiList<Stripe.SubscriptionItem>).data[0]
          const stripeProduct: Stripe.Response<Stripe.Product> = await stripe.products.retrieve(subscriptionItem.price.product as string)

          const productResult = await faunaFetch({
            query: Fauna.Query.getProductByStripeID,
            variables: { stripeID: stripeProduct.id },
          })           

          await faunaFetch({
            query: Fauna.Mutation.createPayment,
            variables: {
              accountNetlifyID: productResult.data.getProductByStripeID.netlifyID,
              customerStripeID: charge.customer,
              product: productResult.data.getProductByStripeID._id,
              chargeStripeID: charge.id,
              productName: stripeProduct.name,
              chargePrice: charge.amount,
              salesPrice: calculateSalesPrice(charge.amount),
              fee: calculateFee(charge.amount),
              feePercentage: APP_FEE_PERCENTAGE,
            },
          })
        }
      }
    }
    return {
      statusCode: 200,
      body: JSON.stringify({})
    }
  } catch (err) {
    console.log(err)
    return {
      statusCode: 400,
      body: `Webhook Error: ${err.message}`,
    }
  }
}
