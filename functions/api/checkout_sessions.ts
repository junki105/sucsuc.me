import { APIGatewayEvent } from 'aws-lambda'
import { Context, ClientContext, User } from '../utils/types'
import { StripeConst } from '../utils/stripe-helpers'
import faunaFetch from '../utils/fauna'
import { Author } from '../../core/entities/Author'
import { Plan } from '../../core/entities/Plan'

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
  const user: User = clientContext.user;
  const customerData = await faunaFetch({
    query: `
      query ($netlifyID: ID!) {
        getUserByNetlifyID(netlifyID: $netlifyID) {
          stripeID
        }
      }
    `,
    variables: {
      netlifyID: user.sub,
    },
  });
  if (customerData.data) {
    stripeID = customerData.data.getUserByNetlifyID.stripeID
  } else {
    const customer = await stripe.customers.create({ email: user.email } as Stripe.CustomerCreateParams);
    await faunaFetch({
      query: `
        mutation ($netlifyID: ID!, $stripeID: ID!) {
          createUser(data: { netlifyID: $netlifyID, stripeID: $stripeID }) {
            netlifyID
            stripeID
          }
        }
      `,
      variables: {
        netlifyID: user.sub,
        stripeID: customer.id,
      },
    });
    stripeID = customer.id
  }
  
  const req = JSON.parse(event.body || '')
  const uuid = req.uuid
  const plan = require(`../../client/content/plan/${uuid}.json`) as Plan;
  const author = require(`../../client/content/author/${plan.authorId}.json`) as Author;

  const productData = await faunaFetch({
    query: `
      query ($uuid: ID!) {
        getProductByUuid(uuid: $uuid) {
          stripeID
        }
      }
    `,
    variables: {
      uuid: uuid,
    },
  });


  const metadata = {
    plan_uuid: uuid,
    author_id: (plan.authorId as string)
  }

  const productParams = productData.data
    ? { product: productData.data.getProductByUuid.stripeID }
    : { product_data: { name: `${author.title} - ${plan.title}` } }

  const price = await stripe.prices.create({
    ...productParams,
    unit_amount: (plan.price as number),
    currency: StripeConst.Currency.JPY,
    recurring: plan.interval === StripeConst.Interval.MONTHLY ? { interval: 'month' } : undefined,
    metadata,
  });

  if (!productData.data && price.product) {
    await faunaFetch({
      query: `
        mutation ($uuid: ID!, $stripeID: ID!) {
          createProduct(data: { uuid: $uuid, stripeID: $stripeID }) {
            uuid
            stripeID
          }
        }
      `,
      variables: {
        uuid: uuid,
        stripeID: (price.product as string),
      },
    });
  }

  const checkoutSession: Stripe.Checkout.Session = await stripe.checkout.sessions.create({
    mode: plan.interval === StripeConst.Interval.MONTHLY ? "subscription" : "payment",
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
