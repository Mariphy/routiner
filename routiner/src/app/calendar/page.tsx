"use server"
import Calendar from "../components/Calendar";
import { getEventsByMonth, getTasks, getRoutines } from '@/app/lib/api';
import { fetchUserIdServer } from '@/app/lib/actions/userId';
import AddButton from '../components/AddButton';
import type { Routine, Task, Event } from '@/app/types';
import { cookies, headers } from "next/headers";

export default async function CalendarPage() {
  let tasks: Task[] = [];
  let routines: Routine[] = [];
  let events: Event[] = [];
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

  return (
    <main className="flex-grow flex flex-col sm:flex-row pt-12">
      <div className="flex-1 p-4">
        {<Calendar
          events={events}
          tasks={tasks}
          routines={routines}
        />}
        <AddButton />
      </div>
    </main>
  );
}