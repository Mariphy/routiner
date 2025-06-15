"use client";

import Calendar from "../components/Calendar";
import type {Event as CalendarEvent} from '@/app/types.ts'
import { useEffect, useState } from 'react';
import { fetchUserId, getEventsByMonth } from '@/app/lib/api'; // or your fetch function

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    async function fetchEvents() {
      const userId = await fetchUserId();
      const month = new Date().toISOString().slice(0, 7); // 'YYYY-MM'
      const eventsData = await getEventsByMonth(userId, month);
      setEvents(eventsData);
    }
    fetchEvents();
  }, []);
    return (
      <main className="flex-grow flex flex-col sm:flex-row pt-12">
        <div className="flex-1 p-4">
          {<Calendar events = {events} />}
          
        </div>
      </main>
    );
}