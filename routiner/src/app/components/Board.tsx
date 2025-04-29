import React, { useState } from 'react';
import { startOfWeek, addDays, format } from 'date-fns';
import AddTask from './AddTask';
import Task from './Task';  

interface BoardProps {
  tasks: Array<{
    title: string;
    day?: string;
    date?: string;
    startTime?: string;
    endTime?: string;
    checked: boolean;
  }>;
  onAddTask: (newTask: {
    title: string;
    day?: string;
    date?: string;
    startTime?: string;
    endTime?: string;
    checked: boolean;
  }) => void;
}

export default function Board({ tasks, onAddTask }: BoardProps) {
  const [newTask, setNewTask] = useState('');
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<
    | {
        title: string;
        day?: string;
        date?: string;
        startTime?: string;
        endTime?: string;
        checked: boolean;
      }
    | null
  >(null);

  const startDate = startOfWeek(new Date(), { weekStartsOn: 0 });
  const daysOfWeek = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));

  const handleQuickAddTask = (day?: string) => {
    const taskDay = day ?? selectedDay; // Use the passed day or the selectedDay state
    if (newTask.trim()) {
      // Always create a task object with the correct format
      const newTaskObject = { title: newTask.trim(), day: taskDay ?? undefined, checked: false };
      onAddTask(newTaskObject); // Pass the task object to the parent-provided callback
      setNewTask(''); // Clear the input field
      setSelectedDay(null); // Reset the selected day
    }
  };

  const openModalForTask = (task: {
    title: string;
    day?: string;
    date?: string;
    startTime?: string;
    endTime?: string;
    checked: boolean;
  }) => {
    setTaskToEdit(task);
    setIsModalOpen(true);
  };

  const handleAddTask = (task: {
    title: string;
    day?: string;
    date?: string;
    startTime?: string;
    endTime?: string;
    checked: boolean;
  }) => {
    onAddTask(task);
    setIsModalOpen(false);
    setTaskToEdit(null);
  };

  return (
    <div className="board-container w-full overflow-x-auto">
      <div className="board flex gap-2 p-4 min-w-max min-h-[600px]">
        <div className="column border p-4 sm:w-72 md:w-72 lg:w-80 flex-shrink-0 rounded-lg bg-neutral-200 shadow-md">
          <h2 className="text-xl font-bold mb-4">Task List</h2>
          {tasks.map((task, index) => (
            <Task 
              key={index} 
              task={task}
              onClick={() => openModalForTask(task)} 
            />
          ))}
          <div className="flex items-center gap-2 mb-4">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Add a new task"
              className="task border p-2 rounded-lg bg-neutral-100 shadow-sm flex-grow"
            />
            <button
              onClick={() => handleQuickAddTask()}
              className="bg-accent text-white px-4 py-2 rounded hover:bg-accent-hover"
            >
              +
            </button>
          </div>
        </div>
        
        {daysOfWeek.map((day, index) => {
          const dayName = format(day, 'EEEE'); // Get the full name of the day (e.g., "Monday")
          return (
            <div key={index} className="column border p-4 sm:w-72 md:w-72 lg:w-80 rounded-lg bg-neutral-200 shadow-md">
              <h2 className="text-xl font-bold mb-4">{dayName}</h2>
              {tasks
                .filter((task) => task.day === dayName) // Filter tasks for the current day
                .map((task, taskIndex) => (
                  <Task
                    key={taskIndex}
                    task={task}
                    onClick={() => openModalForTask(task)} 
                  />
                ))}
              <div className="flex items-center gap-2 mb-4">
                <input
                  type="text"
                  value={selectedDay === dayName ? newTask : ''}
                  onChange={(e) => {
                    setNewTask(e.target.value);
                    setSelectedDay(dayName);
                  }}
                  placeholder={`Add a task for ${dayName}`}
                  className="task border p-2 rounded-lg bg-neutral-100 shadow-sm flex-grow"
                />
                <button
                  onClick={() => handleQuickAddTask(dayName)}
                  className="bg-accent text-white px-4 py-2 rounded hover:bg-accent-hover flex-shrink-0"
                >
                  +
                </button>
              </div>
              {isModalOpen && (
                <AddTask
                  onAddTask={handleAddTask}
                  onClose={() => setIsModalOpen(false)}
                />
              )}
            </div>
          );
        })}

      </div>
    </div>
  );
}