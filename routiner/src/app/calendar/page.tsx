"use server"
import Calendar from "../components/Calendar";
import { getEventsByMonth, getTasks, getRoutines } from '@/app/lib/api';
import { getExternalEvents } from '@/app/lib/icalparser';
import { fetchUserIdServer } from '@/app/actions/userId';
import AddButton from '../components/AddButton';
import type { Routine, Task, Event } from '@/app/types';
import type { VEvent } from 'node-ical';
import { cookies, headers } from "next/headers";

export default async function CalendarPage() {
  let tasks: Task[] = [];
  let routines: Routine[] = [];
  let events: Event[] = [];
  let externalEvents: VEvent[] = [];
  const cookieStore = await cookies();
  const allHeaders = await headers();
  const userId = await fetchUserIdServer();
  const month = new Date().toISOString().slice(0, 7); // 'YYYY-MM'
  if (userId) {
    try{
      const [tasksData, routinesData, eventsData] = await Promise.all([
        getTasks(userId, { cookies: cookieStore, headers: allHeaders }),
        getRoutines(userId, { cookies: cookieStore, headers: allHeaders }),
        getEventsByMonth(userId, month, { cookies: cookieStore, headers: allHeaders })
      ]);
      tasks = tasksData.tasks;
      routines = routinesData.routines;
      events = eventsData;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  try {
    const fetchedEvents = await getExternalEvents(userId, { cookies: cookieStore, headers: allHeaders });
    externalEvents = fetchedEvents;
  } catch (error) {
    console.error('Error fetching external events:', error);
  }

  return (
    <main className="flex-grow flex flex-col sm:flex-row pt-12">
      <div className="flex-1 p-4">
        {<Calendar
          events={events}
          tasks={tasks}
          routines={routines}
          externalEvents={externalEvents}
        />}
        <AddButton />
      </div>
    </main>
  );
}