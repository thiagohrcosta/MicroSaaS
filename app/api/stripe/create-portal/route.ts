import { auth } from "@/app/lib/auth";
import { db } from "@/app/lib/firebase";
import stripe from "@/app/lib/stripe";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await auth();
  const userId = session?.user?.id;

  // if (!session) {
  //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // }

  if (!userId) {
    return NextResponse.json({ error: "User ID is undefined" }, { status: 400 });
  }

  try {
    const userRef = db.collection("users").doc(userId);
    const userDoc = await userRef.get();

    if(!userDoc.exists){
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const customerId = userDoc.data()?.stripeCustomerId;

    if(!customerId) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404})
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${req.headers.get("origin")}/dashboard`
    })

    return NextResponse.json({ url: portalSession.url }, { status: 200 });
  } catch (error) {
    console.error("Error creating portal session:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}