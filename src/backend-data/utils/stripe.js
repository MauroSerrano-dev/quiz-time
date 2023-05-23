const stripe = require('stripe')(process.env.NEXT_PUBLIC_SECRET_KEY)

async function getCustomerEmail(customerId) {
  try {
    const customer = await stripe.customers.retrieve(customerId);
    return customer.email;
  } catch (error) {
    console.error('Erro ao obter o email do cliente:', error);
    throw error;
  }
}

async function createCustomer(email, name) {
  try {
    const customer = await stripe.customers.create({
      email: email,
      name: name,
    })
    return customer.id
  } catch (error) {
    console.error('Erro ao criar o customer no Stripe:', error)
    throw error
  }
}

async function getCustomerByEmail(email) {
  try {
    const customers = await stripe.customers.list({ email: email });
    if (customers.data.length > 0) {
      return customers.data[0].id;
    }
    return null;
  } catch (error) {
    console.error('Erro ao obter o customer do Stripe:', error);
    throw error;
  }
}

module.exports = {
  createCustomer,
  getCustomerByEmail
}