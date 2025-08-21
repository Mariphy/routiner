import { getCurrentWeekRange } from '@/app/utils/helpers';
import { getServerSession } from "next-auth";
import { options } from '@/app/api/auth/[...nextauth]/options';
import type { Event } from '@/app/types';

export async function getEventsForCurrentWeek(): Promise<Event[]>{
    const { start, end } = getCurrentWeekRange();
    try {
        const session = await getServerSession(options);
        if (!session?.user?.email) {
            console.error("User not authenticated");
            return [];
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/users/${session.user.id}/events/search?start=${start}&end=${end}`);
        if (!response.ok) {
            console.error(`Failed to fetch events for week: ${response.status}`);
            return [];
        }
        const data = await response.json();
        return data.events || [];
    } catch (error) {
        console.error("Failed to fetch events for week:", error);
        return [];
    }
}

export async function getEventsByMonth(month: string): Promise<Event[]> {
    try {
        const session = await getServerSession(options);
        if (!session?.user?.email) {
            console.error("User not authenticated");
            return [];
        }
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/users/${session.user.id}/events/search?month=${month}`);
        if (!response.ok) {
            console.error(`Failed to fetch events for month: ${response.status}`);
            return [];
        }
        const data = await response.json();
        return data.events || [];
    } catch (error) {
        console.error("Failed to fetch events:", error);
        return [];
    }
}   