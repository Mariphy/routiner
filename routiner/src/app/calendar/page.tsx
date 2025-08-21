"use server"
import Calendar from "../components/Calendar";
import { getEventsByMonth } from '@/app/lib/api';
import { fetchUserId } from '@/app/lib/actions/actions';
import { preloadCalendarData } from '../lib/preload';
import AddButton from '../components/AddButton';

export default async function CalendarPage() {
  const userId = await fetchUserId();
  // Start preloading data
  preloadCalendarData(userId);
  const month = new Date().toISOString().slice(0, 7); // 'YYYY-MM'
  const events = await getEventsByMonth(userId, month);
     
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