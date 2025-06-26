import React, { useEffect, useState } from 'react';
import { format, getDay } from 'date-fns';
import { fetchUserId, getTasksByDate, getEventsByDate, getRoutinesByDate } from '../lib/api';
import type { Event, Task, Routine } from '@/app/types.ts';

type PlannerItem = {
  id: string;
  type: 'Task' | 'Event' | 'Routine';
  title: string;
  startTime?: string;
  endTime?: string;
  description?: string;
  location?: string;
  url?: string;
};

interface DayProps {
  selectedDate: Date;
  events?: Event[];  // Optional pre-filtered events
}

export default function Day({ selectedDate, events: passedEvents }: DayProps) {
  const [plannerItems, setPlannerItems] = useState<PlannerItem[]>([]);
  const dayOfWeek = getDay(selectedDate);

  useEffect(() => {
    async function fetchData() {
      try {
        const userId = await fetchUserId();
        const dateString = selectedDate.toISOString().split('T')[0];
        
        // Only fetch what we don't already have
        const promises = [
          getTasksByDate(userId, dateString),
          getRoutinesByDate(userId, dateString),
        ];
        
        // Only fetch events if not passed
        if (!passedEvents) {
          promises.push(getEventsByDate(userId, dateString));
        }
        
        const results = await Promise.all(promises);
        const [tasks, routines, fetchedEvents] = results;
        
        // Use passed events or fetched events
        const eventsToUse = passedEvents || fetchedEvents || [];

        // Normalize and combine all items
        const allItems: PlannerItem[] = [
          ...(tasks || []).map((task: Task) => ({
            id: task.id,
            type: 'Task',
            title: task.title,
            startTime: task.startTime,
            endTime: task.endTime,
          })),
          ...(eventsToUse).map((event: Event) => ({
            id: event.id,
            type: 'Event',
            title: event.title,
            startTime: event.startTime,
            endTime: event.endTime,
            description: event.description,
            location: event.location,
            url: event.url,
          })),
          ...(routines || []).map((routine: Routine) => ({
            id: routine.id,
            type: 'Routine',
            title: routine.title,
            startTime: routine.startTime,
            endTime: routine.endTime,
          })),
        ];

        setPlannerItems(allItems);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, [selectedDate, dayOfWeek, passedEvents]);

  // Separate timed and untimed items
  const untimedItems = plannerItems.filter(item => !item.startTime);
  const timedItems = plannerItems.filter(item => item.startTime);

  // Find min/max hour for timed items
  const hours = timedItems.map(item => parseInt(item.startTime!.split(':')[0], 10));
  const minHour = hours.length ? Math.min(...hours, 8) : 8;
  const maxHour = hours.length ? Math.max(...hours, 22) : 22;
  const startHour = Math.min(minHour, 8);
  const endHour = Math.max(maxHour, 22);

  // Generate time slots
  const timeSlots = [];
  for (let hour = startHour; hour <= endHour; hour++) {
    timeSlots.push(hour);
  }

  return (
    <div className="day-view max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-2 text-center">Day Planner</h2>
      <p className="text-center text-gray-600 mb-6">
        {format(selectedDate, 'EEEE, MMMM do, yyyy')}
      </p>

      {/* Untimed items */}
      {untimedItems.length > 0 && (
        <div className="mb-4">
          <h3 className="font-semibold text-gray-700 mb-2">All-day</h3>
          <ul className="space-y-2">
            {untimedItems.map(item => (
              <li 
                key={item.type + '-' + item.id} 
                className="p-2 rounded bg-gray-100 shadow-sm">
                <span className="font-semibold">{item.type}: </span>
                {item.title}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Timed items in time slots */}
      <div className="border rounded-lg overflow-hidden">
        {timeSlots.map(hour => {
          const hourStr = `${hour.toString().padStart(2, '0')}:00`;
          const itemsThisHour = timedItems.filter(item => {
            if (!item.startTime) return false;
            return parseInt(item.startTime.split(':')[0], 10) === hour;
          });
          return (
            <div key={hour} className="flex border-b last:border-b-0">
              <div className="w-20 text-right pr-4 py-2 text-gray-500 bg-gray-50">{hourStr}</div>
              <div className="flex-1 py-2">
                {itemsThisHour.length === 0 ? (
                  <div className="h-6"/>
                ) : (
                  itemsThisHour.map(item => (
                    <div
                      key={item.type + '-' + item.id}
                      className={`p-4 rounded-lg shadow border flex flex-col gap-1 transition hover:shadow-md cursor-pointer ${
                        item.type === 'Task'
                          ? 'bg-blue-100 border-l-4 border-blue-400'
                          : item.type === 'Event'
                          ? 'bg-green-100 border-l-4 border-green-400'
                          : 'bg-purple-100 border-l-4 border-purple-400'
                      }`}
                    >
                      <span className="font-semibold">{item.type}: </span>
                      {item.title}
                      {item.endTime && (
                        <span className="ml-2 text-xs text-gray-500">
                          ({item.startTime} - {item.endTime})
                        </span>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}