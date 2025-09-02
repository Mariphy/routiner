import { auth } from "@/auth";
import { connectToDb } from "@/app/api/db";

export async function GET() {
  const session = await auth();

  if (!session?.user?.email) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const { db } = await connectToDb();
  const user = await db.collection("Users").findOne({ email: session.user.email });

  if (!user) {
    return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
  }

  return new Response(JSON.stringify({ userId: user._id }), { status: 200 });
}