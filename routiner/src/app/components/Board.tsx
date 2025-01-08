import React, { useState } from 'react';
import { format, startOfWeek, addDays } from 'date-fns';
import Task from './Task';

const initialTasks = [
  { id: 1, title: 'Task 1', day: 0, description: 'Description for Task 1' },
  { id: 2, title: 'Task 2', day: 1, description: 'Description for Task 2' },
  { id: 3, title: 'Task 3', day: 2, description: 'Description for Task 3' },
];

export default function Board() {
  const [tasks, setTasks] = useState(initialTasks);
  const startDate = startOfWeek(new Date(), { weekStartsOn: 0 });

  const daysOfWeek = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));

  return (
    <div className="board-container overflow-x-auto">
      <div className="board flex gap-1 p-4 bg-gray-100">
        <div className="column border p-4 w-64 rounded-lg bg-white shadow-md">
          <h2 className="text-xl font-bold mb-4">Task List</h2>
          {tasks.map(task => (
            <Task key={task.id} task={task} onEdit={() => {}} onDelete={() => {}} />
          ))}
        </div>
        {daysOfWeek.map((day, index) => (
          <div key={index} className="column border p-4 w-64 rounded-lg bg-white shadow-md">
            <h2 className="text-xl font-bold mb-4">{format(day, 'EEEE')}</h2>
            {tasks
              .filter(task => task.day === index)
              .map(task => (
                <Task key={task.id} task={task} onEdit={() => {}} onDelete={() => {}} />
              ))}
          </div>
        ))}
      </div>
    </div>
    
  );
}