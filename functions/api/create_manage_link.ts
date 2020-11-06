import { APIGatewayEvent } from 'aws-lambda'
import { Context, ClientContext, User } from '../utils/types'
import faunaFetch from '../utils/fauna'

import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // https://github.com/stripe/stripe-node#configuration
  apiVersion: '2020-08-27',
})

export async function handler(event: APIGatewayEvent, context: Context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed'
    }
  }

  let stripeID: string | undefined = undefined;
  const clientContext: ClientContext | undefined = context.clientContext;
  if (clientContext && clientContext.user) {
    const user: User = clientContext.user;
    const result = await faunaFetch({
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
    })
    stripeID = result.data.getUserByNetlifyID.stripeID
  }

  if (!stripeID) {
    return {
        statusCode: 404,
        body: 'Not Found'
    }
  }

  const link = await stripe.billingPortal.sessions.create({
    customer: stripeID,
    return_url: event.headers.referer,
  });

  return {
    statusCode: 200,
    body: JSON.stringify(link.url),
  };
}
