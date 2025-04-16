"use server";

import { auth, signIn, signOut } from "@/app/lib/auth";
import { redirect } from "next/dist/server/api-utils";

export async function handleAuth() {
  const session = await auth();

  if (session) {
    return await signOut({
      redirectTo: "/login",
    })
  }

  await signIn("google", {
    redirectTo: "/dashboard",
  })
}