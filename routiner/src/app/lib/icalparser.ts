import ical from 'node-ical';
import type { RequestHeaders } from '@/app/types';
import type { CalendarComponent } from 'node-ical';

// do stuff in an async function
export async function getExternalEvents(userId: string, reqHeaders: RequestHeaders) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/users/${userId}/account`,
        {
            credentials: "include", // browser will send cookies automatically
            headers: { "cookie": reqHeaders.cookies.getAll().map((c: Record<string, string>) => `${c.name}=${c.value}`).join('; ') },

        }
    );
    const user = await response.json();
    if (user.link) {
        const events = await ical.async.fromURL(user.link);
        const filteredEvents = Object.values(events).filter((event: CalendarComponent) => event.type === "VEVENT");
        return filteredEvents;
    } else {
        return [];
    }
}