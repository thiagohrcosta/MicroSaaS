"use client";

import { useStripe } from "@/app/hooks/useStripe"

export default function Payments() {
  const {
    createPaymentStipeCheckout,
    createSubscriptionStripeCheckout,
    handleCreateStripePortal
  } = useStripe();

  return (
    <div className="flex flex-col gap-10 items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">Payments</h1>
      <button
        className="border rounded-md px-1"
        onClick={() => createPaymentStipeCheckout({
          testId: "123",
        })}
      >
        Stripe Payment
      </button>
      <button
        className="border rounded-md px-1"
        onClick={() => createSubscriptionStripeCheckout({
          testId: "123",
        })}
      >
        Stripe Subscription
      </button>
      <button
        className="border rounded-md px-1"
        onClick={handleCreateStripePortal}
      >
        Stripe Portal
      </button>
    </div>
  )
}