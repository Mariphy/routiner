import React, { useState, useEffect } from 'react';
import { format, startOfWeek, addDays } from 'date-fns';
import Task from './Task';

export default function Board() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const startDate = startOfWeek(new Date(), { weekStartsOn: 0 });

  const daysOfWeek = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));

  useEffect(() => {
    async function fetchTasks() {
      const response = await fetch('/api/routines');
      const data = await response.json();
      setTasks(data);
      setLoading(false);
    }
    fetchTasks();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="board-container overflow-x-auto bg-gray-100">
      <div className="board flex gap-1 p-4">
        <div className="column border p-4 w-96 rounded-lg bg-white shadow-md">
          <h2 className="text-xl font-bold mb-4">Task List</h2>
          {tasks.map(task => (
            <Task key={task} task={task} />
          ))}
        </div>
      </div>
    </div>
  );
}