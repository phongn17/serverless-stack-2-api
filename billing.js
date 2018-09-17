import stripePackage from 'stripe';
import { calcCost } from './libs/billing-lib';
import { success, failure } from './libs/response-lib';

export async function main(event, context, callback) {
  const { storage, source } = JSON.parse(event.body);
  const amount = calcCost(storage);
  const desc = 'Scratch charge';

  // Load our secret key 
  const stripe = stripePackage(process.env.stripeSecretKey);

  try {
    await stripe.charges.create({ source, amount, desc, currency: 'usd' });
    callback(null, success({ status: true }));
  } catch (ex) {
    callback(null, failure({ message: ex.message }));
  }
}