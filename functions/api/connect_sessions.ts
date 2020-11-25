import { APIGatewayEvent } from 'aws-lambda'
import { Context, ClientContext, User } from '../utils/types'
import { StripeConst } from '../utils/stripe-helpers'
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

  const user: User = clientContext.user;
  const result = await faunaFetch({
    query: Fauna.Query.getAccountByNetlifyID,
    variables: { netlifyID: user.sub },
  });

  let stripeID: string;
  if (result.data) {
    stripeID = result.data.getAccountByNetlifyID.stripeID
  } else {
    const account = await stripe.accounts.create({
      type: 'custom',
      country: StripeConst.Country.JP,
      email: user.email,
      requested_capabilities: [ 'card_payments', 'transfers' ]
    } as Stripe.AccountCreateParams);

    await faunaFetch({
      query: Fauna.Mutation.createAccount,
      variables: {
        netlifyID: user.sub,
        stripeID: account.id,
      },
    });
    stripeID = account.id
  }

  const accountLink = await stripe.accountLinks.create({
    account: stripeID,
    refresh_url: event.headers.referer,
    return_url: event.headers.referer,
    type: 'account_onboarding'
  });
  
  return {
    statusCode: 200,
    body: JSON.stringify(accountLink.url),
  };
}
