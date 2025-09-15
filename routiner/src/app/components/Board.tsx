"use client";

import React, { useState } from 'react';
import { startOfWeek, addDays, format, isSameDay } from 'date-fns';
import Task from './Task';
import Routine from './Routine';
import type { Task as TaskType } from '@/app/types.ts';
import type { Routine as RoutineType } from '@/app/types.ts';
import type { Event as EventType } from '@/app/types.ts';
import { addTask } from '@/app/lib/actions/tasks'

interface BoardProps {
  userId: string;
  tasks: TaskType[];
  routines: RoutineType[];
  events: EventType[];
}

export default function Board({ userId: userId, tasks: tasks, routines: routines, events: events }: BoardProps) {
  const [newTask, setNewTask] = useState(''); //quickAdd
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [showCompleted, setShowCompleted] = useState(false); 

  const startDate = startOfWeek(new Date(), { weekStartsOn: 0 });
  const daysOfWeek = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));


  // Filter tasks based on completion status
  const filteredTasks = showCompleted
    ? (tasks || []).filter(task => task.checked) // Show only completed tasks
    : (tasks || []).filter(task => !task.checked); // Show only uncompleted tasks

  const handleQuickAddTask = async (day?: string) => {
    const taskDay = day ?? selectedDay;
    if (!newTask.trim()) return;

    const formData = new FormData();
    formData.append('title', newTask.trim());
    if (taskDay) {
      formData.append('day', taskDay);
    }
    try {
      const result = await addTask(formData);
      if (result.task) {
        setNewTask('');
        setSelectedDay(null);
      } else {
        console.error('Failed to add task:', result.error);
      }
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  return (
    <div className="board-container w-full overflow-x-auto">
      {/* Toggle Header */}
      <div className="flex justify-between items-center p-4 bg-white border-b">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              {showCompleted ? 'Showing completed tasks' : 'Showing active tasks'}
            </span>
            <button
              onClick={() => setShowCompleted(!showCompleted)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${showCompleted
                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                }`}
            >
              {showCompleted ? 'Show Active' : 'Show Completed'}
            </button>
          </div>
          <div className="text-sm text-gray-500">
            {filteredTasks.length} {showCompleted ? 'completed' : 'active'} tasks
          </div>
        </div>
      </div>

      {/* All Tasks */}
      <div className="board flex gap-2 p-4 min-w-max min-h-[600px]">
        <div className="column border p-4 sm:w-72 md:w-72 lg:w-80 flex-shrink-0 rounded-lg bg-neutral-200 shadow-md">
          <h2 className="text-xl font-bold mb-4">
            Task List {showCompleted && '(Completed)'}
          </h2>
          {filteredTasks.map((task) => (
            <Task
              key={task.id}
              task={task}
              //onClick={() => openModalForTask(task)}
              //onEditTask={handleEditTask}
            />
          ))}

          {/* Only show add task input when showing active tasks */}
          {!showCompleted && (
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
          )}
        </div>

        {/* Day Columns */}
        {daysOfWeek.map((day, index) => {
          const dayName = format(day, 'EEEE');
          const eventsForDay = events.filter(event =>
            event.date && isSameDay(
              event.date instanceof Date ? event.date : new Date(event.date),
              day
            )
          );
          const routinesForDay = routines.filter(routine => routine.repeat.includes(dayName));

          return (
            <div key={index} className="column border p-4 sm:w-72 md:w-72 lg:w-80 rounded-lg bg-neutral-200 shadow-md">
              <h2 className="text-xl font-bold mb-4">
                {dayName} {showCompleted && '(Completed)'}
              </h2>

              {/* Filter tasks for this day */}
              {filteredTasks
                .filter((task) => task.day === dayName)
                .map((task, taskIndex) => (
                  <Task
                    key={taskIndex}
                    task={task}
                    //onClick={() => openModalForTask(task)}
                  />
                ))}

              {routinesForDay
                .map((routine, routineIndex) => (
                  <Routine
                    key={routineIndex}
                    routine={routine}
                  />
                ))}

              {eventsForDay.map(event => (
                <div key={event.id} className="event border p-2 mb-2 rounded-lg bg-green-100 shadow-sm">
                  <h3 className="font-medium">{event.title}</h3>
                  {event.date && (
                    <p className="font-light text-sm text-gray-600">
                      Date: {event.date instanceof Date ? event.date.toLocaleDateString() : new Date(event.date).toLocaleDateString()}
                    </p>
                  )}
                  {event.startTime && event.endTime && (
                    <p className="text-sm text-gray-600">
                      {event.startTime} - {event.endTime}
                    </p>
                  )}
                </div>
              ))}

              {/* Only show add task input when showing active tasks */}
              {!showCompleted && (
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
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}