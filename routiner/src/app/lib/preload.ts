import {
  getEventsForCurrentWeek,
  getEventsByMonth,
} from '@/app/lib/actions/events';
import { getTasks } from '@/app/lib/actions/tasks';
import { getRoutines } from '@/app/lib/actions/routines';

export function preloadBoardData() {
  // void evaluates the given expression and returns undefined
  void Promise.all([
    getTasks(),
    getRoutines(),
    getEventsForCurrentWeek(),
  ]);
}

export function preloadCalendarData() {
  const month = new Date().toISOString().slice(0, 7); // 'YYYY-MM'
  void getEventsByMonth(month);
}
