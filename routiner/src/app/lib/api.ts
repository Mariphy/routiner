export async function addTask(userId: string, task: { title: string; day?: string; date?: string; startTime?: string; endTime?: string; checked?: boolean }) {
    const response = await fetch(`/api/users/${userId}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task }),
    });

    if (!response.ok) {
        throw new Error(`Failed to add task: ${response.status}`);
    }

    return response.json();
}
  
export async function editTask(userId: string, task: { id: string; title: string; day?: string; date?: string; startTime?: string; endTime?: string; checked?: boolean }) {
    const response = await fetch(`/api/users/${userId}/tasks`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task }),
    });

    if (!response.ok) {
        throw new Error(`Failed to edit task: ${response.status}`);
    }

    return response.json();
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

export async function addRoutine(userId: string, routine: { title: string; day?: string; date?: string; startTime?: string; endTime?: string }) {
    const response = await fetch(`/api/users/${userId}/routines`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ routine }),
    });

    if (!response.ok) {
        throw new Error(`Failed to add routine: ${response.status}`);
    }

    return response.json();
}

export async function editRoutine(userId: string, routine: { id: string; title: string; day?: string; date?: string; startTime?: string; endTime?: string }) {
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

export async function addEvent(userId: string, event: { title: string; date?: string; startTime?: string; endTime?: string }) {
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

export async function editEvent(userId: string, event: { id: string; title: string; date?: string; startTime?: string; endTime?: string }) {
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

