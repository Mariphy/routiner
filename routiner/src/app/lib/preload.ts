import {
  getTasks,
  getRoutines,
  getEventsForCurrentWeek,
  getEventsByMonth,
} from './api';

export function preloadBoardData(userId: string) {
  // void evaluates the given expression and returns undefined
  void Promise.all([
    getTasks(userId),
    getRoutines(userId),
    getEventsForCurrentWeek(userId),
  ]);
}

export function preloadCalendarData(userId: string) {
  const month = new Date().toISOString().slice(0, 7); // 'YYYY-MM'
  void getEventsByMonth(userId, month);
}
