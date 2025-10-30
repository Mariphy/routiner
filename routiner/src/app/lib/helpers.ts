import { startOfWeek, endOfWeek, format } from 'date-fns';

export function getCurrentWeekRange() {
  const now = new Date();
  const start = startOfWeek(now, { weekStartsOn: 0 }); // Sunday
  const end = endOfWeek(now, { weekStartsOn: 0 });
  return {
    start: format(start, 'yyyy-MM-dd'),
    end: format(end, 'yyyy-MM-dd'),
  };
}

export function generateUniqueId(): string {
    return 'task-' + Math.random().toString(36).substr(2, 9);
}
