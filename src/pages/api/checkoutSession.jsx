const stripe = require('stripe')(process.env.NEXT_PUBLIC_SECRET_KEY);

export default async function createCheckoutSession(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  const { lineItems, mode, customerEmail, metadata } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'paypal'],
      line_items: lineItems,
      mode: mode,
      customer_email: customerEmail,
      metadata: metadata,
      success_url: 'https://quiztime.pt',
      cancel_url: 'https://quiztime.pt/pricing',
      allow_promotion_codes: true,
    });

    res.status(200).json({ id: session.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
}
