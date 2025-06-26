import React, { useState } from 'react';
import { startOfWeek, addDays, format, isSameDay } from 'date-fns';
import EditTask from './EditTask';
import Task from './Task';  
import Routine from './Routine';
import type { Task as TaskType, TaskInput } from '@/app/types.ts';
import type { Routine as RoutineType, RoutineInput } from '@/app/types.ts';
import type { Event as EventType, EventInput } from '@/app/types.ts';

interface BoardProps {
  tasks: TaskType[];
  routines: RoutineType[];
  events: EventType[];
  onAddTask: (newTask: TaskInput) => void;
  onEditTask: (task: TaskType) => void;
  onDeleteTask: (task: TaskType) => void;
  onAddRoutine: (newRoutine: RoutineInput) => void;
  onAddEvent: (newEvent: EventInput) => void;
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
  const [taskToEdit, setTaskToEdit] = useState<TaskType | null>(null);

  const startDate = startOfWeek(new Date(), { weekStartsOn: 0 });
  const daysOfWeek = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));

  const handleQuickAddTask = async (day?: string) => {
    const taskDay = day ?? selectedDay; // Use the passed day or the selectedDay state
    if (!newTask.trim()) return;

    const newTaskObject = { title: newTask.trim(), day: taskDay ?? undefined, checked: false };
  
    onAddTask(newTaskObject); // Pass the task to the parent-provided callback
    setNewTask(''); // Clear the input field
    setSelectedDay(null); // Reset the selected day
  };

  const openModalForTask = (task: TaskType) => {
    setTaskToEdit(task);
    setIsModalOpen(true);
  };

  const handleEditTask = (task: TaskType) => {
    onEditTask(task);
    setIsModalOpen(false);
    setTaskToEdit(null);
  };

  const handleDeleteTask = (task: TaskType) => {
    onDeleteTask(task);
  };
  
  return (
    <div className="board-container w-full overflow-x-auto">
      <div className="board flex gap-2 p-4 min-w-max min-h-[600px]">
        <div className="column border p-4 sm:w-72 md:w-72 lg:w-80 flex-shrink-0 rounded-lg bg-neutral-200 shadow-md">
          <h2 className="text-xl font-bold mb-4">Task List</h2>
          {tasks.map((task) => (
            <Task 
              key={task.id} 
              task={task}
              onClick={() => openModalForTask(task)} 
            />
          ))}
          <div className="flex items-center gap-2 mb-4">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Click + to add a new task"
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
          const eventsForDay = events.filter(event => 
            event.date && isSameDay(
              event.date instanceof Date ? event.date : new Date(event.date),
              day
            )
          );
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
                {eventsForDay.map(event => (
                  <div key={event.id} className="event border p-2 mb-2 rounded-lg bg-green-100 shadow-sm">
                    <h3 className="font-medium">{event.title}</h3>
                     {event.date && event.date instanceof Date && !isNaN(event.date.getTime()) ? (
                        <p className="font-light text-sm text-gray-600">Date: {event.date.toLocaleDateString()}</p>
                      ) : null}
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
                  placeholder={`Click + to add task on ${dayName}`}
                  className="task border p-2 rounded-lg bg-neutral-100 shadow-sm flex-grow"
                />
                <button
                  onClick={() => handleQuickAddTask(dayName)}
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