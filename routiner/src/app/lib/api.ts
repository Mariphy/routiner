import { parseISO, isSameDay } from 'date-fns';

interface Event {
    title: string;
    id: string;
    day?: string;
    description?: string;
    location?: string;
    url?: string;
    date?: Date;
    startTime?: string;
    endTime?: string;
    repeat?: string;
}

type EventInput = Omit<Event, 'id'>;

interface Task {
  id: string;
  title: string;
  day?: string;
  date?: Date;
  startTime?: string;
  endTime?: string;
  checked: boolean;
}

type TaskInput = Omit<Task, 'id'>;

interface Routine {
    title: string;
    id: string;
    day?: string;
    date?: Date;
    startTime?: string;
    endTime?: string;
    subissue?: string;
    repeat?: string;
}

type RoutineInput = Omit<Routine, 'id'>;

export async function fetchUserId() {
    const response = await fetch('/api/auth/session', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch user ID: ${response.status}`);
    }

    const data = await response.json();
    return data.userId;
}

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
  
export async function getTasks(userId: string) {
    const response = await fetch(`/api/users/${userId}/tasks`);

    if (!response.ok) {
        throw new Error(`Failed to fetch tasks: ${response.status}`);
    }

    return response.json();
}

function isMongoDate(obj: unknown): obj is { $date: string } {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        '$date' in obj &&
        typeof (obj as { $date: unknown }).$date === 'string'
    );
}

export async function getTasksByDate(userId: string, date: string) {
    const response = await fetch(`/api/users/${userId}/tasks`);
    if (!response.ok) {
        throw new Error(`Failed to fetch tasks: ${response.status}`);
    }

    const data = await response.json();
    const tasks = data.tasks || [];

    const filteredTasks = tasks.filter((task: Task) => {
        if (!task.date) return false;
   
        let taskDate: Date | null = null;
        if (typeof task.date === 'string') {
            taskDate = parseISO(task.date);
         } else if (isMongoDate(task.date)) {
            taskDate = parseISO(task.date.$date);
        } else if (task.date instanceof Date) {
            taskDate = task.date;
        }
        // Compare only the date part
        return taskDate && isSameDay(taskDate, parseISO(date));
    });
    return filteredTasks;

}

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

    return response.json();
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

export async function getRoutines(userId: string) {
    const response = await fetch(`/api/users/${userId}/routines`);

    if (!response.ok) {
        throw new Error(`Failed to fetch routines: ${response.status}`);
    }

    return response.json();
}   

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

export async function getEvents(userId: string) {
    const response = await fetch(`/api/users/${userId}/events`);

    if (!response.ok) {
        throw new Error(`Failed to fetch events: ${response.status}`);
    }

    return response.json();
}

