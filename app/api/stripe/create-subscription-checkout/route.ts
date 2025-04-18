import { auth } from "@/app/lib/auth";
import stripe from "@/app/lib/stripe";
import { getOrCreateCustomer } from "@/app/server/stripe/getCustomerId";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { testId } = await req.json();

  const price = process.env.STRIPE_SUBSCRIPTION_PRICE_ID

  if(!price) {
    return NextResponse.json({ error: "Price not found"}, { status: 500});
  }

  const session = await auth();
  const userId = session?.user?.id;
  const userEmail = session?.user?.email;

  if(!userId || !userEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const customerId = await getOrCreateCustomer(userId, userEmail);

  const metadata = {
    testId,
    price,
    userId,
  }

  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [{ price, quantity: 1}],
      mode: "subscription",
      payment_method_types: ["card"],
      success_url: `${req.headers.get("origin") ?? ""}/success`,
      cancel_url: `${req.headers.get("origin") ?? ""}/cancel`,
      metadata,
      customer: customerId,
    })

    return NextResponse.json({ sessionId: session.id }, { status: 200 })
  } catch (error) {
    console.log(error)
    return NextResponse.error()
  }
}