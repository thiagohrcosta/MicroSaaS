import { auth } from "@/app/lib/auth"
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await auth();

  if(!session) {
    return (
      redirect("/login")
    )
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">Protected Dashboard</h1>
      <p>Welcome {session?.user?.email}</p>

    </div>
  )
}