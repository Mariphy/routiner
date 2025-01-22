import React from 'react';
import { format, startOfWeek, addDays } from 'date-fns';
interface BoardProps {
  tasks: Array<string>; 
}

export default function Board({ tasks }: BoardProps) {
  const startDate = startOfWeek(new Date(), { weekStartsOn: 0 });

  const daysOfWeek = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));

  return (
    <div className="board-container overflow-x-auto bg-gray-100">
      <div className="board flex gap-1 p-4">
        <div className="column border p-4 w-96 rounded-lg bg-white shadow-md">
          <h2 className="text-xl font-bold mb-4">Task List</h2>
          {tasks.map((task, index) => (
            <div key={index} className="task border p-2 mb-2">
              <h3 className="font-bold">{task}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}