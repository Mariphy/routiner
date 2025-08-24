import {
  getEventsForCurrentWeek,
  getEventsByMonth,
} from '@/app/lib/actions/events';
import { getTasks } from '@/app/lib/api';
import { getRoutines } from '@/app/lib/api';
import { fetchUserIdServer } from '@/app/lib/actions/user';

export async function preloadBoardData() {
  const userId = await fetchUserIdServer();
  // void evaluates the given expression and returns undefined
  void Promise.all([
    getTasks(userId),
    getRoutines(userId),
    getEventsForCurrentWeek(),
  ]);
}

export function preloadCalendarData() {
  const month = new Date().toISOString().slice(0, 7); // 'YYYY-MM'
  void getEventsByMonth(month);
}
