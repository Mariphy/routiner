import { connectToDb } from "@/app/api/db";

export async function getUserByEmail(email: string) {
    try {
      const { db } = await connectToDb(); 
      const user = await db.collection("Users").findOne({ email }); 
      return user;
    } catch (error) {
      return null; 
    }
}

export async function createUser({ email, password }: { email: string; password: string }) {
    try {
      const { db } = await connectToDb(); 
      const result = await db.collection("Users").insertOne({ email, password, tasks: [] }); // Insert user
      return result; 
    } catch (error) {
      return null; 
    }
}    