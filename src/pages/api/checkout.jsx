import { loadStripe } from '@stripe/stripe-js';

export async function checkout(props) {
    const { lineItems, mode, email } = props

    let stripePromise = null

    function getStripe() {
        if (!stripePromise) {
            stripePromise = loadStripe(process.env.NEXT_PUBLIC_API_KEY)
        }
        return stripePromise
    }

    const stripe = await getStripe()

    await stripe.redirectToCheckout({
        mode: mode,
        lineItems,
        successUrl: `${window.location.origin}/lobby`,
        cancelUrl: window.location.origin,
        customerEmail: email
    })
}