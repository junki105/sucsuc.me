import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // https://github.com/stripe/stripe-node#configuration
  apiVersion: '2020-08-27',
})

const main = async () => {
    const charges: Stripe.ApiList<Stripe.Charge> = await stripe.charges.list()
    const more = charges.has_more as boolean;

    charges.data.forEach(async (charge) => {
        // Subscriptionのみ
        if (charge.invoice) {
            const invoice = await stripe.invoices.retrieve(charge.invoice as string)
            const subscription: Stripe.Response<Stripe.Subscription> = await stripe.subscriptions.retrieve(invoice.subscription as string)
            if (subscription) {
                const subscriptionItem: Stripe.SubscriptionItem = (subscription.items as Stripe.ApiList<Stripe.SubscriptionItem>).data[0]
                const product: Stripe.Response<Stripe.Product> = await stripe.products.retrieve(subscriptionItem.price.product as string)
                console.log(charge.id, charge.amount, product.id, product.name)
                // TODO: Faunadbと紐付け
            }
        } else {
            // const paymentIntent = await stripe.paymentIntents.retrieve(charge.payment_intent as string)
            // console.log(charge)
        }
    })

    const sessions: Stripe.ApiList<Stripe.Checkout.Session> = await stripe.checkout.sessions.list()
    sessions.data.forEach(async (session) => {
      // paymentのみ
      if (session.mode === 'payment' && session.payment_status === 'paid' && session.payment_intent) {
        const paymentIntent: Stripe.PaymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent as string)
        const charge: Stripe.Charge = (paymentIntent.charges as Stripe.ApiList<Stripe.Charge>).data[0]
        console.log(charge.id, charge.amount, session.metadata)
      }
    })
};

main();