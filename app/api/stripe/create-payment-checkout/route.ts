import stripe from "@/app/lib/stripe";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { testId, userEmail } = await req.json();

  const price = process.env.STRIPE_PRODUCT_PRICE_ID

  if(!price) {
    return NextResponse.json({ error: "Price not found"}, { status: 500});
  }

  const metadata = {
    testId,
  }

  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [{ price, quantity: 1}],
      mode: "payment" ,
      payment_method_types: ["card"],
      success_url: `${req.headers.get("origin") ?? ""}/success`,
      cancel_url: `${req.headers.get("origin") ?? ""}/cancel`,
      ...(userEmail ? { customer_email: userEmail } : {}), // check here if any error,
      metadata,
    });

    if(!session.url) {
      return NextResponse.json(
        {error: "Session URL not found"},
        {status: 500}
      );
    }

    return NextResponse.json({ sessionId: session.id}, { status: 200})
  } catch (error) {
    console.error(error);
    return NextResponse.error();
  }
}