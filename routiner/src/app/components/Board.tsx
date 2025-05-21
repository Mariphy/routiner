import React, { useState } from 'react';
import { startOfWeek, addDays, format } from 'date-fns';
import EditTask from './EditTask';
import Task from './Task';  
import Routine from './Routine';

interface BoardProps {
  tasks: Array<{
    title: string;
    id: string;
    day?: string;
    date?: Date;
    startTime?: string;
    endTime?: string;
    checked: boolean;
  }>;
  routines: Array<{
    title: string;
    id: string;
    day?: string;
    date?: Date;
    startTime?: string;
    endTime?: string;
    repeat?: string;
  }>;
  events: Array<{
    title: string;
    id: string;
    day?: string;
    description?: string;
    location?: string;
    url?: string;
    date?: Date;
    startTime?: string;
    endTime?: string;
    repeat?: string;
  }>;
  onAddTask: (newTask: {
    title: string;
    day?: string;
    date?: Date;
    startTime?: string;
    endTime?: string;
    checked: boolean;
  }) => void;
  onEditTask: (task: {
    title: string;
    id: string;
    day?: string;
    date?: Date;
    startTime?: string;
    endTime?: string;
    checked: boolean;
  }) => void;
  onDeleteTask: (task: {
    title: string;
    id: string;
    day?: string;
    date?: Date;
    startTime?: string;
    endTime?: string;
    checked: boolean;
  }) => void;
}

export default function Board({ 
  tasks, 
  routines,
  events,
  onAddTask, onEditTask, onDeleteTask 
}: BoardProps) {
  const [newTask, setNewTask] = useState('');
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<
    | {
        title: string;
        id: string;
        day?: string;
        date?: Date;
        startTime?: string;
        endTime?: string;
        checked: boolean;
      }
    | null
  >(null);

  const startDate = startOfWeek(new Date(), { weekStartsOn: 0 });
  const daysOfWeek = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));

  const handleAddTask = async (day?: string) => {
    const taskDay = day ?? selectedDay; // Use the passed day or the selectedDay state
    if (!newTask.trim()) return;

    const newTaskObject = { title: newTask.trim(), day: taskDay ?? undefined, checked: false };
  
    onAddTask(newTaskObject); // Pass the task to the parent-provided callback
    setNewTask(''); // Clear the input field
    setSelectedDay(null); // Reset the selected day
  };

  const openModalForTask = (task: {
    title: string;
    id: string;
    day?: string;
    date?: Date;
    startTime?: string;
    endTime?: string;
    checked: boolean;
  }) => {
    setTaskToEdit(task);
    setIsModalOpen(true);
  };

  const handleEditTask = (task: {
    title: string;
    id: string;
    day?: string;
    date?: Date;
    startTime?: string;
    endTime?: string;
    checked: boolean;
  }) => {
    onEditTask(task);
    setIsModalOpen(false);
    setTaskToEdit(null);
  };

  const handleDeleteTask = (task: {
    title: string;
    id: string;
    day?: string;
    date?: Date;
    startTime?: string;
    endTime?: string;
    checked: boolean;
  }) => {
    onDeleteTask(task);
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
              onClick={() => handleAddTask()}
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
                {routines
                  .filter((routine) => routine.day === dayName)
                  .map((routine, routineIndex) => (
                    <Routine
                      key={routineIndex}
                      routine={routine}
                    />
                ))}
                {events
                  .filter((event) => event.day === dayName)
                  .map((event, eventIndex) => (
                    <div key={eventIndex} className="event border p-2 mb-2 rounded-lg bg-green-100 shadow-sm">
                      <h3 className="font-medium">{event.title}</h3>
                      {event.startTime && event.endTime && (
                        <p className="text-sm text-gray-600">
                          {event.startTime} - {event.endTime}
                        </p>
                      )}
                    </div>
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
                  onClick={() => handleAddTask(dayName)}
                  className="bg-accent text-white px-4 py-2 rounded hover:bg-accent-hover flex-shrink-0"
                >
                  +
                </button>
              </div>
              {isModalOpen && taskToEdit && (
                <EditTask
                  task={taskToEdit}
                  onEditTask={handleEditTask}
                  onDeleteTask={handleDeleteTask}
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