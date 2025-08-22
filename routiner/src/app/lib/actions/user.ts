import { options } from "@/app/api/auth/[...nextauth]/options";
import { connectToDb } from "@/app/api/db";
import { getServerSession } from "next-auth";

export async function getUserByEmail(email: string) {
  try {
    const { db } = await connectToDb();
    const user = await db.collection("Users").findOne({ email });
    return user;
  } catch (error) {
    console.error("Error fetching user by email:", error);
    return null;
  }
}

export async function createUser({ name, email, password }: { name: string; email: string; password: string }) {
  try {
    const { db } = await connectToDb();
    const result = await db.collection("Users").insertOne({ name, email, password, tasks: [], routines: [], events: [] }); // Insert user
    return result;
  } catch (error) {
    console.error("Error creating user:", error);
    return null;
  }
}

export async function fetchUserIdServer() {
    const session = await getServerSession(options);
    if (!session?.user?.email) {
        throw new Error("Unauthorized"); // or return null
    }

    const { db } = await connectToDb();
    const user = await db.collection("Users").findOne({ email: session.user.email });

    if (!user) {
        throw new Error("User not found");
    }

    return user._id.toString();
}