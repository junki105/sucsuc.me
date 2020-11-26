import { APIGatewayEvent } from 'aws-lambda'
import { Context, ClientContext, User } from '../utils/types'
import { StripeConst } from '../../core/utils/stripe'
import faunaFetch, { Fauna } from '../../core/utils/fauna'
import { Product, convertProduct } from '../../core/entities/Product'
import { Profile, convertProfile } from '../../core/entities/Profile'

import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // https://github.com/stripe/stripe-node#configuration
  apiVersion: '2020-08-27',
})

export async function handler(event: APIGatewayEvent, context: Context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  let stripeID: string | undefined = undefined;
  const clientContext: ClientContext | undefined = context.clientContext;
  if (!clientContext || !clientContext.user) {
    return { statusCode: 401, body: 'Forbidden' }
  }
  const user: User = clientContext.user
  const customerData = await faunaFetch({
    query: Fauna.Query.getCustomerByNetlifyID,
    variables: { netlifyID: user.sub },
  })
  if (customerData.data) {
    stripeID = customerData.data.getCustomerByNetlifyID.stripeID
  } else {
    const customer = await stripe.customers.create({ email: user.email } as Stripe.CustomerCreateParams);
    await faunaFetch({
      query: Fauna.Mutation.createUser,
      variables: { netlifyID: user.sub, stripeID: customer.id }
    });
    stripeID = customer.id
  }
  
  const req = JSON.parse(event.body || '')
  const uuid: String = req.uuid

  const productResult = await faunaFetch({
    query: Fauna.Query.getProductByUuid,
    variables: { uuid: uuid },
  });
  if (!productResult.data) {
    return { statusCode: 404, body: 'Product Not Found' }
  }
  const product: Product = convertProduct(productResult.data.getProductByUuid)
  const author: Profile = convertProfile(product.author)
  const metadata = {
    product_uuid: (product.uuid as string),
    author_id: author._id ? author._id.toString() : ""
  }

  const productParams = product.stripeID
    ? { product: (product.stripeID as string) }
    : { product_data: { name: (product.title as string) } }

  const price = await stripe.prices.create({
    ...productParams,
    unit_amount: (product.price as number),
    currency: StripeConst.Currency.JPY,
    recurring: product.interval === StripeConst.Interval.MONTHLY ? { interval: 'month' } : undefined,
    metadata,
  });

  if (!product.stripeID && price.product) {
    product.stripeID = price.product as string
    await faunaFetch({
      query: Fauna.Mutation.updateProduct,
      variables: { id: product._id, netlifyID: user.sub, ...product, connect: [], disconnect: [], author: author._id }
    })
  }

  const checkoutSession: Stripe.Checkout.Session = await stripe.checkout.sessions.create({
    mode: product.interval === StripeConst.Interval.MONTHLY ? StripeConst.Session.Mode.SUBSCRIPTION : StripeConst.Session.Mode.PAYMENT,
    line_items: [
      { price: price.id, quantity: 1 },
    ],
    payment_method_types: ['card'],
    success_url: `${event.headers.referer}/thanks`,
    cancel_url: event.headers.referer,
    customer: stripeID,
    metadata,
  } as Stripe.Checkout.SessionCreateParams)
  return {
    statusCode: 200,
    body: JSON.stringify(checkoutSession)
  }
}
