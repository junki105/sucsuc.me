import { APIGatewayEvent } from 'aws-lambda'
import { Context, ClientContext, User } from '../utils/types'
import { ChargeList, Charge } from '../../core/entities/Charge'
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

  let customer: string | undefined = undefined;
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
    customer = result.data.getUserByNetlifyID.stripeID
  }

  if (!customer) {
    return {
        statusCode: 404,
        body: 'Not Found'
    }
  }

  const req = JSON.parse(event.body || '')
  const starting_after = req.startingAfter
  const charges: Stripe.ApiList<Stripe.Charge> = await stripe.charges.list({ customer, starting_after })

  return {
    statusCode: 200,
    body: JSON.stringify({
      hasMore: charges.has_more,
      data: charges.data.map((charge) => {
        return {
          id: charge.id,
          amount: charge.amount,
          receiptUrl: charge.receipt_url,
          paid: charge.paid,
          created: charge.created,
        } as Charge
      } )
    })
  };
}
