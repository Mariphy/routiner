import React, { useState } from 'react';
import { startOfWeek, addDays, format } from 'date-fns';

interface BoardProps {
  tasks: Array<{ title: string; day?: string; time?: string }>;
  onAddTask: (newTask: { title: string; day?: string; time?: string }) => void;
}

export default function Board({ tasks, onAddTask }: BoardProps) {
  const [newTask, setNewTask] = useState('');
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const startDate = startOfWeek(new Date(), { weekStartsOn: 0 });
  const daysOfWeek = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));

  const handleAddTask = (day?: string) => {
    const taskDay = day ?? selectedDay; // Use the passed day or the selectedDay state
    if (newTask.trim()) {
      // Always create a task object with the correct format
      const newTaskObject = { title: newTask.trim(), day: taskDay ?? undefined };
      onAddTask(newTaskObject); // Pass the task object to the parent-provided callback
      setNewTask(''); // Clear the input field
      setSelectedDay(null); // Reset the selected day
    }
  };

  return (
    <div className="board-container overflow-x-auto bg-gray-100">
      <div className="board flex gap-1 p-4 min-w-max min-h-[600px]">
        <div className="column border p-4 w-full sm:w-64 md:w-72 lg:w-80 rounded-lg bg-white shadow-md">
          <h2 className="text-xl font-bold mb-4">Task List</h2>
          {tasks.map((task, index) => (
            <div key={index} className="task border p-2 mb-2">
              <h3 className="font-normal">{task.title}</h3>
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
              onClick={() => handleAddTask()}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              +
            </button>
          </div>
        </div>
        
        {daysOfWeek.map((day, index) => {
          const dayName = format(day, 'EEEE'); // Get the full name of the day (e.g., "Monday")
          return (
            <div key={index} className="column border p-4 w-full sm:w-64 md:w-72 lg:w-80 rounded-lg bg-white shadow-md">
              <h2 className="text-xl font-bold mb-4">{dayName}</h2>
              {tasks
                .filter((task) => task.day === dayName) // Filter tasks for the current day
                .map((task, taskIndex) => (
                  <div
                    key={taskIndex}
                    className="task border p-2 mb-2 rounded-lg bg-gray-50 shadow-sm"
                  >
                    <h3 className="font-normal">{task.title}</h3>
                  </div>
                ))}
              <div className="flex items-center gap-2 mt-4">
                <input
                  type="text"
                  value={selectedDay === dayName ? newTask : ''}
                  onChange={(e) => {
                    setNewTask(e.target.value);
                    setSelectedDay(dayName);
                  }}
                  placeholder={`Add a task for ${dayName}`}
                  className="border p-2 flex-grow"
                />
                <button
                  onClick={() => handleAddTask(dayName)}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  +
                </button>
              </div>
            </div>
          );
        })}

      </div>
    </div>
  );
}