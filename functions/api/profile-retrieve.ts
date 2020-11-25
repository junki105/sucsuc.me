import { APIGatewayEvent } from 'aws-lambda'
import { Context, ClientContext, User } from '../utils/types'
import faunaFetch, { Fauna } from '../../core/utils/fauna'
import { Category } from '../../core/entities/Category'
import { Profile, convertProfile } from '../../core/entities/Profile'
import { Product } from '../../core/entities/Product'
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
  const userResult = await faunaFetch({
    query: Fauna.Query.getProfileByNetlifyID,
    variables: { netlifyID: user.sub },
  });
  const profile: Profile = userResult.data.getProfileByNetlifyID
    ? convertProfile(userResult.data.getProfileByNetlifyID)
    : {
        _id: undefined,
        username: '', 
        name: user.user_metadata.full_name || '',
        categories: [] as Category[],
        products: [] as Product[],
        profileImage: null,
        body: '',
        website: '',
        twitter: '',
        facebook: '',
        github: '',
        instagram: '',
      } as Profile
  return {
    statusCode: 200,
    body: JSON.stringify({ profile })
  };
}
