import { db } from "@/app/lib/firebase";
import "server-only";

import Stripe from "stripe";

export async function handleStripePayment(event: Stripe.CheckoutSessionCompletedEvent) {
  if (event.data.object.payment_status === "paid") {
    console.log("Payment was successfull!");

    const metadata = event.data.object.metadata;

    const userId = metadata?.userId;

    if (!userId) {
      console.error("User ID not found");
      return;
    }

    await db.collection("users").doc(userId).update({
      stripeCustomerId: event.data.object.customer,
      stripeSubscriptionId: event.data.object.subscription,
      subscriptionStatus: "active",
    })
  }
}