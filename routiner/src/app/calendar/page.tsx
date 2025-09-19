"use server"
import Calendar from "../components/Calendar";
import { getEventsByMonth } from '@/app/lib/api';
import { fetchUserIdServer } from '@/app/lib/actions/userId';
//import { preloadCalendarData } from '../lib/preload';
import AddButton from '../components/AddButton';
import { cookies, headers } from "next/headers";

export default async function CalendarPage() {
  const cookieStore = await cookies();
  const allHeaders = await headers();
  const userId = await fetchUserIdServer();
  // Start preloading data
  //preloadCalendarData();
  const month = new Date().toISOString().slice(0, 7); // 'YYYY-MM'
  const events = await getEventsByMonth(userId, month, { cookies: cookieStore, headers: allHeaders });

  return (
    <main className="flex-grow flex flex-col sm:flex-row pt-12">
      <div className="flex-1 p-4">
        {<Calendar
          userId={userId}
          events={events} />}
        <AddButton />
      </div>
    </main>
  );
}