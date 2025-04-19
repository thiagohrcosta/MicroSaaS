import { db } from "@/app/lib/firebase";
import "server-only";

import Stripe from "stripe";

export async function handleStripeCancelSubscription(event: Stripe.CustomerSubscriptionDeletedEvent) {
  console.log("Subscription was canceled!");
  const customerId = event.data.object.customer;

  const userRef = await db.collection("users").where("stripeCustomerId", "==", customerId).get();

  if (userRef.empty) {
    console.error("User not found");
    return;
  }

  const userId = userRef.docs[0].id;

  await db.collection("users").doc(userId).update({
    subscriptionStatus: "inactive",
  })
}