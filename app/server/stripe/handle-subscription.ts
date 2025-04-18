import { db } from "@/app/lib/firebase";
import Stripe from "stripe";

export async function handleStripeSubscription(event: Stripe.CheckoutSessionCompletedEvent){
  if(event.data.object.payment_status === "paid") {
    console.log("Subscription was successfull!");

    const metadata = event.data.object.metadata;

    const userId = metadata?.userId;

    if (!userId) {
      console.error("User ID not found");
      return;
    }

    await db.collection("users").doc(userId).update({
      stripeSubscriptionId: event.data.object.subscription,
      subscriptionStatus: "active",
    })
  }


}