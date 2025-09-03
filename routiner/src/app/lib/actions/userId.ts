import { auth } from "@/auth";
import { connectToDb } from "@/app/api/db";

export async function fetchUserIdServer() {
    const session = await auth();
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