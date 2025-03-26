import React, { useState } from 'react';
//import { startOfWeek, addDays } from 'date-fns';
interface BoardProps {
  tasks: Array<string>; 
  onAddTask: (newTask: string) => void;
}

export default function Board({ tasks, onAddTask }: BoardProps) {
  //const startDate = startOfWeek(new Date(), { weekStartsOn: 0 });

  //const daysOfWeek = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));
  const [newTask, setNewTask] = useState('');
  const handleAddTask = () => {
    if (newTask.trim()) {
      onAddTask(newTask); // Call the parent-provided callback to add the task
      setNewTask(''); // Clear the input field
    }
  };

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
          <div className="flex items-center gap-2 mb-4">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Add a new task"
              className="border p-2 flex-grow"
            />
            <button
              onClick={handleAddTask}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              +
            </button>
          </div>
        </div>
        
      </div>
    </div>
  );
}