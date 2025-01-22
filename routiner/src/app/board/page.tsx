"use client";

import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import Board from '../components/Board';

export default function BoardPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTasks() {
      try {
        const response = await fetch('http://localhost:3000/api/routines');
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

  if (loading) {
    return <div>Loading...</div>;
  } 

  return (
    <div className="flex flex-col min-h-screen">
      <header className="p-4 bg-gray-800 text-white text-center">
        <NavBar/>
      </header>
      <main className="flex-grow flex flex-col sm:flex-row">
        <div className="flex-1 p-4">
          <Board tasks={tasks}/>
        </div>
      </main>
    </div>
  );
}