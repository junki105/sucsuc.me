import { APIGatewayEvent } from 'aws-lambda'
import { Context, ClientContext, User } from '../utils/types'
import faunaFetch, { Fauna } from '../utils/fauna'
import { Category } from 'core/entities/Category'
import { Profile } from 'core/entities/Profile'
import { convertProfile } from '../utils/converter'
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

  const categoryResult = await faunaFetch({
    query: Fauna.Query.allCategories,
    variables: {},
  });
  const categories: Category[] = categoryResult.data ? categoryResult.data.allCategories.data : []
  const user: User = clientContext.user;
  const userResult = await faunaFetch({
    query: Fauna.Query.getProfileByNetlifyID,
    variables: { netlifyID: user.sub },
  });
  const profile = userResult.data
    ? convertProfile(userResult.data.getProfileByNetlifyID)
    : {
        _id: null,
        username: '', 
        name: user.user_metadata.full_name || '',
        categories: [] as Category[],
        profileImage: null,
        body: '',
        website: '',
        twitter: '',
        facebook: '',
        github: '',
        instagram: '',
      }
  return {
    statusCode: 200,
    body: JSON.stringify({ profile, categories })
  };
}
