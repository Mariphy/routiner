import { options } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import GuestHomePage from "./components/GuestHomePage";
import UserHomePage from "./components/UserHomePage";

export default async function Home() {
  const session = await getServerSession(options);

  return (
    <main className="flex-grow flex flex-col sm:flex-row pt-12">
      <div className="m-6">
        {session ? ( 
          <div className="text-center m-6">
            <h1 className="text-2xl font-bold">Welcome, {session.user.name}!</h1>
            <UserHomePage />
          </div>
        ) : ( 
          <GuestHomePage />
        )}
      </div>
    </main>
  );
}