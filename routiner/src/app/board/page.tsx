"use client";

import React, { useState, useEffect } from 'react';
import Board from '../components/Board';
import AddButton from '../components/AddButton';

export default function BoardPage() {
  const [userId, setUserId] = useState<string | null>(null); 
  const [tasks, setTasks] = useState<{ 
    title: string;
    id: string;
    day?: string;
    date?: string;
    startTime?: string;
    endTime?: string;
    checked: boolean; }[]>([]);

  const [routines, setRoutines] = useState<{ 
    title: string;
    id: string;
    day?: string;
    startTime?: string;
    endTime?: string;
    subissue?: string;
    repeat?: string;
  }[]>([]);

  const [events, setEvents] = useState<{ 
    title: string;
    id: string;
    date: string;
    startTime?: string;
    endTime?: string;
  }[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserId() {
      try {
        const response = await fetch('/api/auth/session');
        if (!response.ok) {
          throw new Error(`Failed to fetch user ID: ${response.status}`);
        }
        const data = await response.json();
        setUserId(data.userId);
      } catch (error) {
        console.error('Error fetching user ID:', error);
      }
    }

    fetchUserId();
  }, []);

  useEffect(() => {
    async function fetchData() {
      if (!userId) return;
      try {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
        const [tasksResponse, routinesResponse, eventsResponse] = await Promise.all([
          fetch(`${baseUrl}/api/users/${userId}/tasks`),
          fetch(`${baseUrl}/api/users/${userId}/routines`),
          fetch(`${baseUrl}/api/users/${userId}/events`),
        ]);

        if (!tasksResponse.ok || !routinesResponse.ok || !eventsResponse.ok) {
          throw new Error("Failed to fetch data");
        }
        const tasksData = await tasksResponse.json();
        const routinesData = await routinesResponse.json();
        const eventsData = await eventsResponse.json();

        setTasks(tasksData.tasks || []);
        setRoutines(routinesData.routines || []);
        setEvents(eventsData.events || []);
        setLoading(false);
      } catch (error) {
        console.error('Fetch error:', error);
        setLoading(false);
      }
    }
    fetchData();
  }, [userId]);

  const handleAddTask = async (newTask: { 
    title: string;
    day?: string;
    date?: string;
    startTime?: string;
    endTime?: string;
    checked: boolean;
  }) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
      const response = await fetch(`${baseUrl}/api/users/${userId}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ task: newTask }),
      });

      if (!response.ok) {
        throw new Error(`Failed to add task: ${response.status}`);
      }

      const { task: createdTask } = await response.json();

      // Update the local state with the new task
      setTasks((prevTasks) => [...prevTasks, createdTask]);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleEditTask = async (updatedTask: { 
    title: string;
    id: string;
    day?: string;
    date?: string;
    startTime?: string;
    endTime?: string;
    checked: boolean;
  }) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
      const response = await fetch(`${baseUrl}/api/users/${userId}/tasks`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ task: updatedTask }),
      });

      if (!response.ok) {
        throw new Error(`Failed to edit task: ${response.status}`);
      }

      // Update the local state with the edited task
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === updatedTask.id ? updatedTask : task
        )
      );
    } catch (error) {
      console.error('Error editing task:', error);
    }
  };

  const handleDeleteTask = async (taskToDelete: { 
    title: string;
    id: string;
    day?: string;
    date?: string;
    startTime?: string;
    endTime?: string;
    checked: boolean;
  }) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
      const response = await fetch(`${baseUrl}/api/users/${userId}/tasks`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ task: taskToDelete }),
      });

      if (!response.ok) {
        throw new Error(`Failed to delete task: ${response.status}`);
      }

      // Update the local state to remove the deleted task
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskToDelete.id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

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
        <AddButton />
      </div>
    </main>
  );
}