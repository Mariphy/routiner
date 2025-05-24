"use client";

import React, { useState, useEffect } from 'react';
import Board from '../components/Board';
import AddButton from '../components/AddButton';
import { Task, Event, Routine, TaskInput, EventInput, RoutineInput} from '../components/AddButton';
import { 
  fetchUserId, getTasks, getRoutines, getEventsForCurrentWeek, 
  addTask, editTask, deleteTask, 
  addEvent,
  addRoutine
} from '../lib/api';
import { format } from 'date-fns';

export default function BoardPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initialize() {
      const id = await fetchUserId();
      setUserId(id);
      
      if (id) {
        try {
          const [tasksData, routinesData, eventsData] = await Promise.all([
            getTasks(id),
            getRoutines(id),
            getEventsForCurrentWeek(id),
          ]);

          setTasks(tasksData.tasks || []);
          setRoutines(routinesData.routines || []);
          const eventsWithDay = (eventsData || []).map((event: Event) => ({
            ...event,
            date: event.date
              ? (event.date instanceof Date ? event.date : new Date(event.date))
              : undefined,
            day: event.date
              ? format(event.date instanceof Date ? event.date : new Date(event.date), 'EEEE')
              : undefined,
          }));
          setEvents(eventsWithDay);
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    }

    initialize();
  }, []);

  const handleAddTask = async (newTask: TaskInput) => {
    try {
      const createdTask = await addTask(userId!, newTask);
      setTasks((prevTasks) => [...prevTasks, createdTask]); 
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleEditTask = async (updatedTask: Task) => {
    try {
      const editedTask = await editTask(userId!, updatedTask); 
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === editedTask.id ? editedTask : task
        )
      ); 
    } catch (error) {
      console.error('Error editing task:', error);
    }
  };

  const handleDeleteTask = async (taskToDelete: {id: string}) => {
    try {
      await deleteTask(userId!, taskToDelete.id); // Use the `deleteTask` function from `api.ts`
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskToDelete.id)); // Remove the deleted task from the local state
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleAddEvent = async (newEvent: EventInput) => {
    try {
      const createdEvent = await addEvent(userId!, newEvent); 
      setEvents((prevEvents) => [...prevEvents, createdEvent]); 
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  const handleAddRoutine = async (newRoutine: RoutineInput) => {
    try {
      const createdRoutine = await addRoutine(userId!, newRoutine); 
      setRoutines((prevRoutines) => [...prevRoutines, createdRoutine]); 
    } catch (error) {
      console.error('Error adding routine:', error);
    }
  }

  if (loading) {
    return <div>Loading...</div>;
  } 

  return (
    <main className="flex-grow flex flex-col sm:flex-row pt-12 mt-4">
      <div className="flex-1 p-4">
        <Board 
          tasks={tasks} 
          routines={routines}
          events={events}
          onAddTask={handleAddTask} 
          onEditTask={handleEditTask} 
          onDeleteTask={handleDeleteTask} 
        />
        {userId && (
          <AddButton 
            onTaskAdded={handleAddTask} 
            onEventAdded={handleAddEvent} 
            onRoutineAdded={handleAddRoutine}
          />
        )}
      </div>
    </main>
  );
}