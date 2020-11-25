import { APIGatewayEvent } from 'aws-lambda'
import { Context, ClientContext, User } from '../utils/types'
import faunaFetch, { Fauna } from '../../core/utils/fauna'

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

  const req = JSON.parse(event.body || '')
  const { account_holder_name, account_number, routing_number } = req

  const token = await stripe.tokens.create({
    bank_account: {
      country: 'JP',
      currency: 'JPY',
      account_holder_name,
      account_number,
      routing_number,
    }
  } as Stripe.TokenCreateParams);

  const user: User = clientContext.user;
  const result = await faunaFetch({
    query: Fauna.Query.getAccountByNetlifyID,
    variables: { netlifyID: user.sub },
  });

  if (result.data) {
    await stripe.accounts.createExternalAccount(
      result.data.getAccountByNetlifyID.stripeID,
      {
        external_account: token.id,
      } as Stripe.ExternalAccountCreateParams
    )
  } else {
    const account = await stripe.accounts.create({
      type: 'custom',
      country: 'JP',
      email: user.email,
      requested_capabilities: [ 'card_payments', 'transfers' ],
      external_account: token.id
    } as Stripe.AccountCreateParams);

    await faunaFetch({
      query: Fauna.Mutation.createAccount,
      variables: {
        netlifyID: user.sub,
        stripeID: account.id,
      },
    });
  }

  return {
    statusCode: 200,
  };
}
