import { auth } from "@/app/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import NavBar from "./components/NavBar";

export default async function Home() {
  const session = await getServerSession(auth) as { user?: { email?: string } };

  if (!session?.user) {
    redirect("/login");
  }


  return (
    <div className="flex flex-col min-h-screen">
      <header className="p-4 bg-gray-800 text-white text-center">
        <NavBar/>
      </header>
      <main className="flex-grow p-4">
        <div>
          <h1>Welcome, {session.user.email}!</h1>
        </div>
      </main>
    </div>
  );
}