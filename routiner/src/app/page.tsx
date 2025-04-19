import { options } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import NavBar from "./components/NavBar";
import Login from "./components/Login";
import SignOutButton from "./components/SignOutButton";

export default async function Home() {
  const session = await getServerSession(options);

  if (!session) {
    redirect("/api/auth/signin");
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="p-4 bg-gray-800 text-white text-center">
        <NavBar/>
      </header>
      <main className="flex-grow p-4">
        <div>
          {session ? <h1>Welcome, {session.user.email}!</h1> : <h1>Welcome, Guest!</h1>}
          <Login />
          <SignOutButton />
        </div>
      </main>
    </div>
  );
}