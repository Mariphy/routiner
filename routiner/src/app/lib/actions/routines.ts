import { auth } from "@/auth";
import { connectToDb } from '@/app/api/db';
import { Routine } from '@/app/types';

export async function getRoutines(): Promise<Routine[]> {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            console.error("User not authenticated");
            return [];
        }

        const { db } = await connectToDb();
        const user = await db.collection("users").findOne({ email: session.user.email });
        
        if (!user) {
            console.error("User not found");
            return [];
        }

        return user.routines || [];

    } catch (error) {
        console.error("Failed to fetch routines:", error);
        return [];
    }
}