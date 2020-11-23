import { APIGatewayEvent } from 'aws-lambda'
import { Context, ClientContext, User } from '../utils/types'
import faunaFetch, { Fauna } from '../utils/fauna'
import { Profile, convertProfile } from '../../core/entities/Profile'
import { Category } from '../../core/entities/Category'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // https://github.com/stripe/stripe-node#configuration
  apiVersion: '2020-08-27',
})

export async function handler(event: APIGatewayEvent, context: Context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  const clientContext: ClientContext | undefined = context.clientContext;
  if (!clientContext || !clientContext.user) {
    return { statusCode: 401, body: 'Forbidden' }
  }

  const user: User = clientContext.user;
  const req = JSON.parse(event.body || '')
  const profile: Profile = req
  let savedProfile: Profile | null
  if (!!profile._id) {
    const profileResult = await faunaFetch({
      query: Fauna.Query.getProfileByNetlifyID,
      variables: { netlifyID: user.sub },
    });

    const before = profileResult.data.getProfileByNetlifyID
      ? (profileResult.data.getProfileByNetlifyID.categories.data as Category[]).map((c: Category) => c._id) as Number[]
      : []
    const after = (profile.categories as Category[]).map((c: Category) => c._id) as Number[]
    
    const connect = after.filter(i => before.indexOf(i) == -1)
    const disconnect = before.filter(i => after.indexOf(i) == -1)
    const result = await faunaFetch({
      query: Fauna.Query.updateProfile,
      variables: { id: profile._id, netlifyID: user.sub, ...profile, connect, disconnect }
    })

    savedProfile = result.data ? convertProfile(result.data.updateProfile) : null
  } else {
    profile.categories = (profile.categories as Category[]).map((c: Category) => c._id) as Number[]
    const result = await faunaFetch({
      query: Fauna.Query.createProfile,
      variables: { netlifyID: user.sub, ...profile }
    })
    savedProfile = result.data ? convertProfile(result.data.createProfile) : null
  }

  if (!savedProfile) {
    return { statusCode: 422, body: '' }
  }
  
  return { statusCode: 200, body: JSON.stringify(savedProfile) }
}
