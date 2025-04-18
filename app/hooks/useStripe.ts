import { useEffect, useState } from "react";
import { loadStripe, Stripe } from "@stripe/stripe-js";

export function useStripe() {
  const [stripe, setStripe] = useState<Stripe | null>(null);

  useEffect(() => {
    async function loadStripeAsync() {
      const stripeInstance = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUB_KEY!);
      setStripe(stripeInstance);
    }

    loadStripeAsync();
  }, []);

  async function createPaymentStipeCheckout(checkoutData: any) {
    if(!stripe) return;

    try {
      const response = await fetch("/api/stripe/create-payment-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(checkoutData),
      })

      const data = await response.json();

      await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });
    } catch (error) {
      console.error("Error creating checkout session:", error);
      return;
    }
  }

  async function createSubscriptionStripeCheckout(checkoutData: any) {
    if(!stripe) return;

    try {
      const response = await fetch("/api/stripe/create-subscription-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(checkoutData),
      })

      const data = await response.json();

      await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });
    } catch (error) {
      console.error("Error creating checkout session:", error);
      return;
    }
  }

  async function handleCreateStripePortal() {
    if(!stripe) return;

    try {
      const response = await fetch("/api/stripe/create-portal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json();

      window.location.href = data.url;
    } catch (error) {
      console.error("Error creating checkout session:", error);
      return;
    }
  }

  return {
    createPaymentStipeCheckout,
    createSubscriptionStripeCheckout,
    handleCreateStripePortal
  };
}

// const {
//   createPaymentStipeCheckout,
//   createSubscriptionStripeCheckout,
//   handleCreateStripePortal
// } = useStripe();