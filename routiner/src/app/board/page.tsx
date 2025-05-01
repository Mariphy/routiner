"use client";

import React, { useState, useEffect } from 'react';
import Board from '../components/Board';

export default function BoardPage() {
  const [tasks, setTasks] = useState<{ 
    title: string;
    id: string;
    day?: string;
    date?: string;
    startTime?: string;
    endTime?: string;
    checked: boolean; }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTasks() {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
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
      const response = await fetch(`${baseUrl}/api/routines`, {
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

  const handleDeleteTask = async () => {};

  if (loading) {
    return <div>Loading...</div>;
  } 

  return (
    <main className="flex-grow flex flex-col sm:flex-row pt-12 mt-4">
      <div className="flex-1 p-4">
        <Board 
          tasks={tasks} 
          onAddTask={handleAddTask} 
          onEditTask={handleEditTask} 
          onDeleteTask={handleDeleteTask} />
      </div>
    </main>
  );
}