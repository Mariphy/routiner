"use client";

import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import Board from '../components/Board';

export default function BoardPage() {
  const [tasks, setTasks] = useState<{ title: string; day?: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTasks() {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL
        const response = await fetch(`${baseUrl}/api/routines`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setTasks(data.tasks);
        setLoading(false);
      } catch (error) {
        console.error('Fetch error:', error);
        setLoading(false);
      }
    }
    fetchTasks();
  }, []);

  const handleAddTask = async (newTask: { title: string; day?: string, time?: string }) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL
      const response = await fetch(`${baseUrl}/api/routines`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ task: newTask }),
      });

      if (!response.ok) {
        throw new Error(`Failed to add task: ${response.status}`);
      }

      // Update the local state with the new task
      setTasks((prevTasks) => [...prevTasks, newTask]);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  } 

  return (
    <div className="flex flex-col min-h-screen">
      <header className="fixed top-0 left-0 w-full bg-gray-800 text-white z-50 shadow-md">
        <NavBar/>
      </header>
      <main className="flex-grow flex flex-col sm:flex-row pt-28">
        <div className="flex-1 p-4">
          <Board tasks={tasks} onAddTask={handleAddTask} />
        </div>
      </main>
    </div>
  );
}