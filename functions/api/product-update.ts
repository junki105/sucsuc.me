import { APIGatewayEvent } from 'aws-lambda'
import { v4 as uuidv4 } from 'uuid';
import { Context, ClientContext, User } from '../utils/types'
import faunaFetch, { Fauna } from '../../core/utils/fauna'
import { Hashtag } from '../../core/entities/Hashtag'
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

  const clientContext: ClientContext | undefined = context.clientContext;
  if (!clientContext || !clientContext.user) {
    return { statusCode: 401, body: 'Forbidden' }
  }

  const user: User = clientContext.user;

  const userResult = await faunaFetch({
    query: Fauna.Query.getProfileByNetlifyID,
    variables: { netlifyID: user.sub },
  });

  if (!userResult.data.getProfileByNetlifyID) {
    return { statusCode: 422, body: 'Need Profile Data' }
  }
  const profile: Profile = convertProfile(userResult.data.getProfileByNetlifyID)
  const req = JSON.parse(event.body || '')
  const product: Product = (req as Product)
  product.price = Number(product.price)
  let savedProduct
  let result
  if (!!product._id && !!product.uuid) {
    const productResult = await faunaFetch({
      query: Fauna.Query.getProductByUuid,
      variables: { uuid: product.uuid },
    });

    const before = productResult.data.getProductByUuid
      ? (productResult.data.getProductByUuid.hashtags.data as Hashtag[]).map((c: Hashtag) => c._id) as Number[]
      : []
    const after = (product.hashtags as Hashtag[]).map((h: Hashtag) => h._id) as Number[]
    
    const connect = after.filter(i => before.indexOf(i) == -1)
    const disconnect = before.filter(i => after.indexOf(i) == -1)
    result = await faunaFetch({
      query: Fauna.Mutation.updateProduct,
      variables: { id: product._id, netlifyID: user.sub, ...product, connect, disconnect, author: profile._id }
    })
    savedProduct = result.data ? convertProduct(result.data.updateProduct) : null
    
    const stripeID: string = productResult.data.getProductByUuid.stripeID
    if (savedProduct && stripeID) {
      await stripe.products.update(stripeID, { name: savedProduct.title as string })
    }
  } else {
    product.hashtags = (product.hashtags as Hashtag[]).map((h: Hashtag) => h._id) as Number[]
    result = await faunaFetch({
      query: Fauna.Mutation.createProduct,
      variables: { uuid: uuidv4(), netlifyID: user.sub, ...product, price: (product.price as number), author: profile._id }
    })
    savedProduct = result.data ? convertProduct(result.data.createProduct) : null
  }

  if (!savedProduct) {
    return { statusCode: 422, body: JSON.stringify(result) }
  }

  return { statusCode: 200, body: JSON.stringify(savedProduct) }
}
