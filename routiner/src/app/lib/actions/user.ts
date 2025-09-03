import { connectToDb } from "@/app/api/db";

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