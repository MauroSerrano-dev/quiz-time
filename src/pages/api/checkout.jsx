import { loadStripe } from '@stripe/stripe-js';

export async function checkout(props) {
    const { lineItems, mode, email, planName } = props;
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
            metadata: { planName: planName },
        }),
    }).then((response) => response.json());

    await stripe.redirectToCheckout({ sessionId: session.id });
}
