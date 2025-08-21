import { getCurrentWeekRange } from '@/app/utils/helpers';
import { getServerSession } from "next-auth";
import { options } from '@/app/api/auth/[...nextauth]/options';
import { connectToDb } from '@/app/api/db';
import { startOfDay, endOfDay } from 'date-fns';

export async function getEventsForCurrentWeek() {
    try {
        const session = await getServerSession(options);
        if (!session?.user?.email) {
            console.error("User not authenticated");
            return [];
        }

        const { db } = await connectToDb();
        const { start, end } = getCurrentWeekRange();

        // Build match conditions for the week range
        const matchConditions: Record<string, unknown> = {
            "events.date": {
                $gte: startOfDay(start),
                $lte: endOfDay(end)
            }
        };

        // Use the same aggregation pipeline as the route handler
        const events = await db.collection("Users").aggregate([
            { $match: { email: session.user.email } },
            { $unwind: "$events" },
            { $match: matchConditions },
            { $replaceRoot: { newRoot: "$events" } }
        ]).toArray();

        return events;

    } catch (error) {
        console.error("Failed to fetch events for week:", error);
        return [];
    }
}

export async function getEventsByMonth(month: string) {
    try {
        const session = await getServerSession(options);
        if (!session?.user?.email) {
            console.error("User not authenticated");
            return [];
        }

        const { db } = await connectToDb();
        
        // Parse month string (format: 'YYYY-MM')
        const [year, monthNum] = month.split('-').map(Number);
        const start = new Date(year, monthNum - 1, 1); // First day of month
        const end = new Date(year, monthNum, 0); // Last day of month

        const matchConditions: Record<string, unknown> = {
            "events.date": {
                $gte: startOfDay(start),
                $lte: endOfDay(end)
            }
        };

        const events = await db.collection("Users").aggregate([
            { $match: { email: session.user.email } },
            { $unwind: "$events" },
            { $match: matchConditions },
            { $replaceRoot: { newRoot: "$events" } }
        ]).toArray();

        return events;

    } catch (error) {
        console.error("Failed to fetch events for month:", error);
        return [];
    }
}