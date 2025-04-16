import Link from "next/link"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-24">
      <h1 className="text-4xl font-bold text-gray-800">Welcome to MicroSaaS</h1>
      <p className="mt-4 text-lg text-gray-600">
        This is a micro SaaS application built with Next.js and Tailwind CSS.
      </p>
      <p className="mt-2 text-lg text-gray-600">
        Start building your micro SaaS today!
      </p>
      <Link href="/login">
        <button className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Login</button>
      </Link>
    </div>
  );
}
