//fetches data through API requests
import { parseISO, isSameDay } from 'date-fns';
import { getCurrentWeekRange } from '@/app/lib/helpers';
import type { Task, Event } from '@/app/types.ts';
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';
import { ReadonlyHeaders } from 'next/dist/server/web/spec-extension/adapters/headers';

interface RequestHeaders {
  cookies: ReadonlyRequestCookies;
  headers: ReadonlyHeaders;
}

//helpers
function isMongoDate(obj: unknown): obj is { $date: string } {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        '$date' in obj &&
        typeof (obj as { $date: unknown }).$date === 'string'
    );
}

function parsePossibleDate(date: unknown): Date | null {
    if (typeof date === 'string') {
        return new Date(date);
    } else if (isMongoDate(date)) {
        return new Date(date.$date);
    } else if (date instanceof Date) {
        return date;
    }
    return null;
}

function normalizeTask(task: Task) {
    return {
        ...task,
        date: task.date ? parsePossibleDate(task.date) ?? undefined : undefined,
    };
}

//user id for client 
export async function fetchUserIdClient() {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/session`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
    console.error(`Failed to fetch user ID: ${response.status}`);
    return '';
    }

    const data = await response.json();
    return data.userId.toString();
}

//fetching functions:
//tasks:
export async function getTasks(userId: string, reqHeaders: RequestHeaders) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/users/${userId}/tasks`,
        {
            credentials: "include", // browser will send cookies automatically
            headers: { "cookie": reqHeaders.cookies.getAll().map((c: Record<string, string>) => `${c.name}=${c.value}`).join('; ') },

        }
    );

    if (!response.ok) {
    console.error(`Failed to fetch tasks: ${response.status}`);
    return { tasks: [] };
    }

    const data = await response.json();
    return {
        ...data,
        tasks: (data.tasks || []).map(normalizeTask),
    };
}

//to-do: add cookies (maybe not, using with a client side component Day)
export async function getTasksByDate(userId: string, date: string) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/users/${userId}/tasks`,);
    if (!response.ok) {
    console.error(`Failed to fetch tasks: ${response.status}`);
    return [];
    }

    const data = await response.json();
    const tasks = data.tasks || [];

    return tasks
        .filter((task: Task) => {
            const taskDate = parsePossibleDate(task.date);
            return taskDate && isSameDay(taskDate, parseISO(date));
        })
        .map(normalizeTask);
}

//routines fetching functions:
export async function getRoutines(userId: string, reqHeaders: RequestHeaders) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/users/${userId}/routines`,
        {
            credentials: "include", // browser will send cookies automatically
            headers: { "cookie": reqHeaders.cookies.getAll().map((c: Record<string, string>) => `${c.name}=${c.value}`).join('; ') },

        }
    );

    if (!response.ok) {
    console.error(`Failed to fetch routines: ${response.status}`);
    return [];
    }

    return response.json();
}  

//events fetching functions:
//to-do: add cookies
export async function getEventsByDate(userId: string, date: string): Promise<Event[]> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/users/${userId}/events/search?date=${date}`);
    if (!response.ok) {
        console.error(`Failed to fetch events: ${response.status}`);
        return [];
    }
  
  const data = await response.json();
  return data.events || [];
}

export async function getEventsByMonth(userId: string, month: string, reqHeaders: RequestHeaders): Promise<Event[]> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/users/${userId}/events/search?month=${month}`, {
    credentials: "include",
    headers: { "cookie": reqHeaders.cookies.getAll().map((c: Record<string, string>) => `${c.name}=${c.value}`).join('; ') },
  });
    if (!response.ok) {
        console.error(`Failed to fetch events: ${response.status}`);
        return [];
    }
  
  const data = await response.json();
  return data.events || [];
}

export async function getEventsForCurrentWeek(userId: string, reqHeaders: RequestHeaders) {
  const { start, end } = getCurrentWeekRange();
  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/users/${userId}/events/search?start=${start}&end=${end}`,
        {
            credentials: "include", // browser will send cookies automatically
            headers: { "cookie": reqHeaders.cookies.getAll().map((c: Record<string, string>) => `${c.name}=${c.value}`).join('; ') },
        }
    );
    if (!response.ok) {
        console.error(`Failed to fetch events for week: ${response.status}`);
        return [];
    }
  const data = await response.json();
  return data.events || [];
}

//fetch events from an external calendar
export async function fetchRawICS(userId: string, reqHeaders: RequestHeaders) {
    const url = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/users/${userId}`,
        {
            credentials: "include", // browser will send cookies automatically
            headers: { "cookie": reqHeaders.cookies.getAll().map((c: Record<string, string>) => `${c.name}=${c.value}`).join('; ') },

        }
    );
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ICS: ${res.status}`);
  const text = await res.text(); // raw iCalendar text
  return text;
}