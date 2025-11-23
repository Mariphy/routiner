"use client";

import React, { useState } from 'react';
import { startOfWeek, addDays, format, isSameDay } from 'date-fns';
import Task from '@/app/components/Task';
import Routine from './Routine';  
import Event from './Event';
import TaskListColumn from '@/app/components/TaskListColumn';
import type { 
  Task as TaskType, 
  Routine as RoutineType, 
  Event as EventType } from '@/app/types.ts';
import type { VEvent } from 'node-ical';
import { addTask } from '@/app/actions/tasks'

interface BoardProps {
  tasks: TaskType[];
  routines: RoutineType[];
  events: EventType[];
  externalEvents: VEvent[];
}

export default function Board({ tasks: tasks, routines: routines, events: events, externalEvents: externalEvents }: BoardProps) {
  const [newTask, setNewTask] = useState(''); //quickAdd
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [showCompleted, setShowCompleted] = useState(false);

  const startDate = startOfWeek(new Date(), { weekStartsOn: 0 });
  const daysOfWeek = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));


  // Filter tasks based on completion status
  const filteredTasks = showCompleted
    ? (tasks || []).filter(task => task.checked) // Show only completed tasks
    : (tasks || []).filter(task => !task.checked); // Show only uncompleted tasks

  //adds tasks from the board without opening the modal   
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
  const externalEventsForSelectedWeek = externalEvents
    .filter(event => 
      event.start >= startDate && event.start < addDays(startDate, 7)
    )
    .map(event => ({
      id: event.uid || Math.random().toString(36),
      title: event.summary || 'Untitled Event',
      date: event.start || new Date(),
      startTime: event.start.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      }),
      endTime: event.end.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      }),
      description: event.description || '',
      location: event.location || ''
  }));

  return (
    <div className="w-full overflow-x-auto">
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
      {/* Board */}
      <div className="board flex gap-2 p-4 min-w-max min-h-[600px]">

        <TaskListColumn tasks={tasks} onQuickAddTask={handleQuickAddTask} showCompleted={showCompleted} />

        {/* Day Columns */}
        {daysOfWeek.map((day, index) => {
          const dayName = format(day, 'EEEE');
          const eventsForDay = events.filter(event =>
            event.date && isSameDay(event.date, day)
          );
          const routinesForDay = routines.filter(routine => routine.repeat.includes(dayName));
          const externalEventsForDay = externalEventsForSelectedWeek.filter(event =>
            event.date && isSameDay(event.date, day)
          );

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
                  />
                ))}

              {routinesForDay
                .map((routine, routineIndex) => (
                  <Routine
                    key={routineIndex}
                    routine={routine}
                  />
                ))}

              {eventsForDay
                .map((event, eventIndex) => (
                  <Event
                    key={eventIndex}
                    event={event}
                  />
                ))}

              {externalEventsForDay
                .map((event, eventIndex) => (
                  <Event
                    key={eventIndex}
                    event={event}
                  />
                ))}

              {/* Only show add task input when showing active tasks */}
              {!showCompleted && (
                <div className="flex items-center gap-2 mb-4">
                  <label htmlFor={`quick-add-task-${dayName}`} className="sr-only">
                    Add task for {dayName}
                  </label>
                  <input
                    id={`quick-add-task-${dayName}`}
                    type="text"
                    value={selectedDay === dayName ? newTask : ''}
                    onChange={(e) => {
                      setNewTask(e.target.value);
                      setSelectedDay(dayName);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleQuickAddTask(dayName);
                      }
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