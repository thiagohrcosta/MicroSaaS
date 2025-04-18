import stripe from "@/app/lib/stripe";
import { handleStripeCancelSubscription } from "@/app/server/stripe/handle-cancel";
import { handleStripePayment } from "@/app/server/stripe/handle-payment";
import { handleStripeSubscription } from "@/app/server/stripe/handle-subscription";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const secret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if(!signature || !secret) {
    return NextResponse.json({ error: "No signature or secret"}, { status: 400 });
  }

  try {
    const event = stripe.webhooks.constructEvent(body, signature, secret);

    switch(event.type) {
      case "checkout.session.completed":  // paid
        const metadata = event.data.object.metadata;

        if(metadata?.price === process.env.STRIPE_PRODUCT_PRICE_ID) {
          await handleStripePayment(event);
        }

        if(metadata?.price === process.env.STRIPE_SUBSCRIPTION_PRICE_ID) {
          await handleStripeSubscription(event);
        }

        console.log("Payment was successfull!");
        break;
      case "checkout.session.expired": // time expired
        console.log("Sending email to user to inform about the expiration.");
        break;
      case "checkout.session.async_payment_succeeded": // paid
        console.log("Send email to user to inform about the payment success");
        break;
      case "customer.subscription.created": // subscription created
        console.log("Send email to user to inform about the subscription creation.");
        break;
      case "customer.subscription.updated": // subscription updated
        console.log("Send email to user to inform about the subscription updated")
        break;
      case "customer.subscription.deleted": // subscription cancelled
        await handleStripeCancelSubscription(event);
        break;
      default: // unhandled event
        console.log(`Unhandled event type ${event.type}`);
        break;
    }

    return NextResponse.json({ message: "Webhook received" }, { status: 200 });
  } catch (error) {
    console.log("Error in Stripe webhook", error);
    return NextResponse.json({ error: "Webhook Error" }, { status: 500 });
  }
}