import stripe from "@/app/lib/stripe";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { testId } = await req.json();

  const price = process.env.STRIPE_SUBSCRIPTION_PRICE_ID

  if(!price) {
    return NextResponse.json({ error: "Price not found"}, { status: 500});
  }

  const metadata = {
    testId,
  }

  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [{ price, quantity: 1}],
      mode: "subscription",
      payment_method_types: ["card"],
      success_url: `${req.headers.get("origin") ?? ""}/success`,
      cancel_url: `${req.headers.get("origin") ?? ""}/cancel`,
      metadata
    })
  } catch (error) {
    console.log(error)
    return NextResponse.error()
  }
}