import Calendar from "../components/Calendar";
import { fetchUserId, getEventsByMonth } from '@/app/lib/api'; // or your fetch function

export default async function CalendarPage() {
  const userId = await fetchUserId();
  const month = new Date().toISOString().slice(0, 7); // 'YYYY-MM'
  const events = await getEventsByMonth(userId, month);
     
  return (
    <main className="flex-grow flex flex-col sm:flex-row pt-12">
      <div className="flex-1 p-4">
        {<Calendar events={events} />}
      </div>
    </main>
  );
}