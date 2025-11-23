"use client";

import React, { useState } from 'react';
import { startOfWeek, addDays, format, isSameDay } from 'date-fns';
import TaskListColumn from '@/app/components/TaskListColumn';
import DayColumn from '@/app/components/DayColumn';
import type {
  Task as TaskType,
  Routine as RoutineType,
  Event as EventType
} from '@/app/types.ts';
import type { VEvent } from 'node-ical';

interface BoardProps {
  tasks: TaskType[];
  routines: RoutineType[];
  events: EventType[];
  externalEvents: VEvent[];
}

export default function Board({ tasks: tasks, routines: routines, events: events, externalEvents: externalEvents }: BoardProps) {
  const [showCompleted, setShowCompleted] = useState(false);

  const startDate = startOfWeek(new Date(), { weekStartsOn: 0 });
  const daysOfWeek = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));

  // Filter tasks based on completion status
  const filteredTasks = showCompleted
    ? (tasks || []).filter(task => task.checked) // Show only completed tasks
    : (tasks || []).filter(task => !task.checked); // Show only uncompleted tasks

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

        <TaskListColumn tasks={tasks} showCompleted={showCompleted} />

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
            <DayColumn
              key={index}
              dayName={dayName}
              tasks={tasks}
              routines={routinesForDay}
              events={eventsForDay}
              externalEvents={externalEventsForDay}
              showCompleted={showCompleted}
            />
          );
        })}
      </div>
    </div>
  );
}