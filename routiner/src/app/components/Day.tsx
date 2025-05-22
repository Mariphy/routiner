import React, { useEffect, useState } from 'react';
import { format, getDay } from 'date-fns';
import { fetchUserId, getTasksByDate } from '../lib/api';

interface Task {
  id: string;
  title: string;
  day?: string;
  date?: Date;
  startTime?: string;
  endTime?: string;
  checked: boolean;
}

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

export default function Day({ selectedDate }: { selectedDate: Date }) {
  const [tasks, setTasks] = useState([]);
  const [routines, setRoutines] = useState([]);
  const [events, setEvents] = useState([]);
  const dayOfWeek = getDay(selectedDate);

  useEffect(() => {
    async function fetchData() {
      try {
        const userId = await fetchUserId();
        const tasks = await getTasksByDate(userId, format(selectedDate, 'yyyy-MM-dd'));
        setTasks(tasks || []);

        const eventsResponse = await fetch(`/api/users/[id]/events?date=${format(selectedDate, 'yyyy-MM-dd')}`);
        const eventsData = await eventsResponse.json();
        setEvents(eventsData);

        const routinesResponse = await fetch(`/api/users/[id]/routines?dayOfWeek=${dayOfWeek}`);
        const routinesData = await routinesResponse.json();
        setRoutines(routinesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, [selectedDate, dayOfWeek]);

  return (
    <div className="day-view">
      <h2 className="text-2xl font-bold mb-4 p-4">Day View</h2>
      <p>Selected Date: {format(selectedDate, 'EEEE, MMMM do, yyyy')}</p>

      <div className="mt-4">
        <h3 className="text-xl font-bold">Tasks</h3>
        {tasks.length > 0 ? (
          <ul>
            {tasks.map((task: Task) => (
              <li key={task.id}>{task.title}</li>
            ))}
          </ul>
        ) : (
          <p>No tasks for this date.</p>
        )}
      </div>

      <div className="mt-4">
        <h3 className="text-xl font-bold">Events</h3>
        {events.length > 0 ? (
          <ul>
            {events.map((event: Event) => (
              <li key={event.id}>{event.title}</li>
            ))}
          </ul>
        ) : (
          <p>No events for this date.</p>
        )}
      </div>
      <div className="mt-4">
          <h3 className="text-xl font-bold">Routines</h3>
          {routines.length > 0 ? (
            <ul>
              {routines.map((routine: Routine) => (
                <li key={routine.id}>{routine.title}</li>
              ))}
            </ul>
          ) : (
            <p>No routines for this day of the week.</p>
          )}
      </div>
    </div>
  );
}