import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil',
});

export const createOrRetrieveCustomer = async (customerId?: string) => {
  const params: Stripe.CustomerCreateParams = {
    email: customerId,
  };

  const customer = await stripe.customers.create(params);
  return customer.id;
};

