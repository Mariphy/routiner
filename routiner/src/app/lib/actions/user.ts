import { connectToDb } from "@/app/api/db";
import { DatabaseError } from "@/app/lib/errors";

export async function getUserByEmail(email: string) {
  try {
    const { db } = await connectToDb();
    const user = await db.collection("users").findOne({ email });
    return user;
  } catch (error) {
    console.error("Error fetching user by email:", error);
    throw new DatabaseError("Failed to fetch user from database");
  }
}

export async function createUser({ name, email, password }: { name: string; email: string; password: string }) {
  try {
    const { db } = await connectToDb();
    const result = await db.collection("users").insertOne({ name, email, password, tasks: [], routines: [], events: [] });
    return result;
  } catch (error) {
    console.error("Error creating user:", error);
    throw new DatabaseError("Failed to create user in database");
  }
}