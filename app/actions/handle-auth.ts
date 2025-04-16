"use server";

import { signIn } from "@/app/lib/auth";

export async function handleAuth() {
  await signIn("google", {
    redirectTo: "/dashboard",
  })
}