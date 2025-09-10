import Stripe from "stripe";
import { PaymentProvider } from "./index";

const stripe = new Stripe(process.env.STRIPE_SECRET!);

export const initializePayment: PaymentProvider["initializePayment"] = async ({
  amount,
  currency,
  email,
  metadata,
  callback_url,
}) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    customer_email: email,
    line_items: [
      {
        price_data: {
          currency: currency.toLowerCase(),
          product_data: { name: "fin-mcp Payment" },
          unit_amount: Math.round(amount * 100),
        },
        quantity: 1,
      },
    ],
    success_url: callback_url,
    cancel_url: callback_url,
    metadata,
  });

  return session;
};

export const verifyPayment: PaymentProvider["verifyPayment"] = async (
  sessionId: string
) => {
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  return session;
};

export const refundPayment: PaymentProvider["refundPayment"] = async ({
  payment_intent,
  amount,
}) => {
  const refund = await stripe.refunds.create({
    payment_intent,
    amount: amount ? Math.round(amount * 100) : undefined,
  });
  return refund;
};

export const createCustomer: PaymentProvider["createCustomer"] = async ({
  email,
  first_name,
  last_name,
}) => {
  const customer = await stripe.customers.create({
    email,
    name: `${first_name || ""} ${last_name || ""}`.trim(),
  });
  return customer;
};

export const createInvoice: PaymentProvider["createInvoice"] = async ({
  customerId,
  amount,
  currency,
  description,
}) => {
  const invoiceItem = await stripe.invoiceItems.create({
    customer: customerId,
    amount: Math.round(amount * 100),
    currency,
    description,
  });

  const invoice = await stripe.invoices.create({
    customer: customerId,
    auto_advance: true,
  });

  return invoice;
};
