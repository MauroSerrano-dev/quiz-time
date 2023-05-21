import { loadStripe } from '@stripe/stripe-js';

export async function checkout(props) {
    const { lineItems, mode, email, plan } = props;
    console.log(lineItems, mode, email, plan)
    const stripe = await loadStripe(process.env.NEXT_PUBLIC_API_KEY);

    const session = await fetch('/api/checkoutSession', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            lineItems,
            mode,
            customerEmail: email,
            metadata: { plan },
        }),
    }).then((response) => response.json());

    await stripe.redirectToCheckout({ sessionId: session.id });
}
