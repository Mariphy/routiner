import { options } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import NavBar from "./components/NavBar";
import Link from "next/link";

export default async function Home() {
  const session = await getServerSession(options);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="p-4 bg-gray-800 text-white text-center">
        <NavBar/>
      </header>
      <main className="flex-grow p-4">
        <div>
          {session ? ( 
            <div>
              <h1 className="text-2xl font-bold">Welcome, {session.user.email}!</h1>
              <p className="mt-4">You are signed in. Explore your dashboard or manage your tasks.</p>
              <Link href="/api/auth/signout">
                  <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                    Sign Out
                  </button>
              </Link>
            </div>
          ) : ( 
            <div className="text-center">
              <h1 className="text-2xl font-bold">Welcome to Routiner!</h1>
              <p className="mt-4">Sign in or sign up to start managing your tasks efficiently.</p>
              <div className="mt-6 flex justify-center gap-4">
                <Link href="/api/auth/signin">
                  <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Sign In
                  </button>
                </Link>
                <Link href="/signup">
                  <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                    Sign Up
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}