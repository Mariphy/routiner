//fetches data through API requests
import { parseISO, isSameDay } from 'date-fns';
import { getCurrentWeekRange } from '../utils/helpers';
import type { Task, TaskInput, Event, EventInput, Routine, RoutineInput } from '@/app/types.ts';

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

//user id
//user id for client 
export async function fetchUserIdClient() {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/session`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch user ID: ${response.status}`);
    }

    const data = await response.json();
    return data.userId.toString();
}

//fetching functions:
//tasks:
export async function getTasks(userId: string) {
    const response = await fetch(`/api/users/${userId}/tasks`);

    if (!response.ok) {
        throw new Error(`Failed to fetch tasks: ${response.status}`);
    }

    const data = await response.json();
    return {
        ...data,
        tasks: (data.tasks || []).map(normalizeTask),
    };
}

export async function getTasksByDate(userId: string, date: string) {
    const response = await fetch(`/api/users/${userId}/tasks`);
    if (!response.ok) {
        throw new Error(`Failed to fetch tasks: ${response.status}`);
    }

    const data = await response.json();
    const tasks = data.tasks || [];

    return tasks.filter((task: Task) => {
        const taskDate = parsePossibleDate(task.date);
        return taskDate && isSameDay(taskDate, parseISO(date));
    });
}

//routines fetching functions:
export async function getRoutines(userId: string) {
    const response = await fetch(`/api/users/${userId}/routines`);

    if (!response.ok) {
        throw new Error(`Failed to fetch routines: ${response.status}`);
    }

    return response.json();
}  

//events fetching functions:
export async function getEventsByDate(userId: string, date: string): Promise<Event[]> {
  const response = await fetch(`/api/users/${userId}/events/search?date=${date}`);
  if (!response.ok) throw new Error(`Failed to fetch events: ${response.status}`);
  
  const data = await response.json();
  return data.events || [];
}

export async function getEventsByMonth(userId: string, month: string): Promise<Event[]> {
  const response = await fetch(`/api/users/${userId}/events/search?month=${month}`);
  if (!response.ok) throw new Error(`Failed to fetch events: ${response.status}`);
  
  const data = await response.json();
  return data.events || [];
}

export async function getEventsForCurrentWeek(userId: string) {
  const { start, end } = getCurrentWeekRange();
  const response = await fetch(`/api/users/${userId}/events/search?start=${start}&end=${end}`);
  if (!response.ok) throw new Error(`Failed to fetch events for week: ${response.status}`);
  const data = await response.json();
  return data.events || [];
}

//tasks mutations
//to-do: move to /actions/tasks
export async function addTask(userId: string, task: TaskInput) {
    const response = await fetch(`/api/users/${userId}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task }),
    });

    if (!response.ok) {
        throw new Error(`Failed to add task: ${response.status}`);
    }

    const responseData = await response.json();
    const newTask = responseData.task; // Extract the task object
    return newTask;
}
  
export async function editTask(userId: string, task: Task) {
    const response = await fetch(`/api/users/${userId}/tasks`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task }),
    });

    if (!response.ok) {
        throw new Error(`Failed to edit task: ${response.status}`);
    }

    const responseData = await response.json();
    const updatedTask = responseData.task; // Extract the updated task
    return updatedTask;
}
  
export async function deleteTask(userId: string, taskId: string) {
    const response = await fetch(`/api/users/${userId}/tasks`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: taskId }),
    });

    if (!response.ok) {
        throw new Error(`Failed to delete task: ${response.status}`);
    }

    return response.json();
}

//routines mutations
//to-do: move to /actions/routines
export async function addRoutine(userId: string, routine: RoutineInput) {
    const response = await fetch(`/api/users/${userId}/routines`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ routine }),
    });

    if (!response.ok) {
        throw new Error(`Failed to add routine: ${response.status}`);
    }

    const responseData = await response.json();
    const newRoutine = responseData.routine; // Extract the routine object
    return newRoutine;
}

export async function editRoutine(userId: string, routine: Routine) {
    const response = await fetch(`/api/users/${userId}/routines`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ routine }),
    });

    if (!response.ok) {
        throw new Error(`Failed to edit routine: ${response.status}`);
    }

    const responseData = await response.json();
    const updatedRoutine = responseData.routine; // Extract the updated routine
    return updatedRoutine;
}

export async function deleteRoutine(userId: string, routineId: string) {
    const response = await fetch(`/api/users/${userId}/routines`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: routineId }),
    });

    if (!response.ok) {
        throw new Error(`Failed to delete routine: ${response.status}`);
    }

    return response.json();
}

//events mutations
//to-do: move to /actions/routines
export async function addEvent(userId: string, event: EventInput) {
    const response = await fetch(`/api/users/${userId}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event }),
    });

    if (!response.ok) {
        throw new Error(`Failed to add event: ${response.status}`);
    }

    return response.json();
}       

export async function editEvent(userId: string, event: Event) {
    const response = await fetch(`/api/users/${userId}/events`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event }),
    });

    if (!response.ok) {
        throw new Error(`Failed to edit event: ${response.status}`);
    }

    return response.json();
}   

export async function deleteEvent(userId: string, eventId: string) {
    const response = await fetch(`/api/users/${userId}/events`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: eventId }),
    });

    if (!response.ok) {
        throw new Error(`Failed to delete event: ${response.status}`);
    }

    return response.json();
}   