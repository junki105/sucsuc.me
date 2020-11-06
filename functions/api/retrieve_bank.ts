import { APIGatewayEvent } from 'aws-lambda'
import { Context, ClientContext, User } from '../utils/types'
import faunaFetch from '../utils/fauna'
import { Bank } from '../../core/entities/Bank'

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

  const clientContext: ClientContext | undefined = context.clientContext;
  if (!clientContext || !clientContext.user) {
    return {
      statusCode: 401,
      body: 'Forbidden'
    }
  }

  const user: User = clientContext.user;
  const result = await faunaFetch({
    query: `
      query ($netlifyID: ID!) {
        getAccountByNetlifyID(netlifyID: $netlifyID) {
          stripeID
        }
      }
    `,
    variables: {
      netlifyID: user.sub,
    },
  });

  if (!result.data) {
    return { statusCode: 200 };
  }

  const account: Stripe.Response<Stripe.Account> = await stripe.accounts.retrieve(result.data.getAccountByNetlifyID.stripeID)
  if (!account) {
    return { statusCode: 200 };
  }

  const list = account.external_accounts as Stripe.ApiList<Stripe.BankAccount>
  if (!list || !list.data || !list.data[0]) {
    return { statusCode: 200 };
  }
  const { bank_name, country, last4 } = list.data[0] as Stripe.BankAccount
  return {
    statusCode: 200,
    body: JSON.stringify({ bankName: bank_name, country, last4 } as Bank)
  };
}
