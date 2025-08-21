import { getServerSession } from "next-auth";
import { options } from '@/app/api/auth/[...nextauth]/options';
import { connectToDb } from '@/app/api/db';
import { Routine } from '@/app/types';

export async function getRoutines(): Promise<Routine[]> {
    try {
        const session = await getServerSession(options);
        if (!session?.user?.email) {
            console.error("User not authenticated");
            return [];
        }

        const { db } = await connectToDb();
        const user = await db.collection("Users").findOne({ email: session.user.email });
        
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