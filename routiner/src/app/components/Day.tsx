"use client";

import React, { useEffect, useState } from 'react';
import { getDay } from 'date-fns';
import { Calendar, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchUserId, getTasksByDate, getEventsByDate } from '../lib/api';
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
  events?: Event[];
  onNavigateDay?: (direction: 'prev' | 'next') => void;
  onBackToMonth?: () => void;
  onCreateEvent?: () => void;
}

export default function Day({ 
  selectedDate, 
  events: passedEvents,
  onNavigateDay,
  onBackToMonth,
  onCreateEvent
}: DayProps) {
  const [plannerItems, setPlannerItems] = useState<PlannerItem[]>([]);
  const dayOfWeek = getDay(selectedDate);

  useEffect(() => {
    async function fetchData() {
      try {
        const userId = await fetchUserId();
        const dateString = selectedDate.toISOString().split('T')[0];
        
        const promises = [
          getTasksByDate(userId, dateString),
        ];
        
        if (!passedEvents) {
          promises.push(getEventsByDate(userId, dateString));
        }
        
        const results = await Promise.all(promises);
        const [tasks, routines, fetchedEvents] = results;
        
        const eventsToUse = passedEvents || fetchedEvents || [];

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

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Separate and sort items
  const untimedItems = plannerItems.filter(item => !item.startTime);
  const timedItems = plannerItems.filter(item => item.startTime).sort((a, b) => {
    return (a.startTime || '').localeCompare(b.startTime || '');
  });

  const getItemColor = (type: string) => {
    switch (type) {
      case 'Task':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'Event':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'Routine':
        return 'bg-purple-50 border-purple-200 text-purple-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  return (
    <div className="bg-white">
      {/* Day View Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {onBackToMonth && (
              <button
                onClick={onBackToMonth}
                className="flex items-center px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Month
              </button>
            )}
            
            <div className="flex items-center space-x-2">
              {onNavigateDay && (
                <button
                  onClick={() => onNavigateDay('prev')}
                  className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
              )}
              
              <h2 className="text-xl font-semibold text-gray-800 min-w-[300px] text-center">
                {formatDate(selectedDate)}
              </h2>
              
              {onNavigateDay && (
                <button
                  onClick={() => onNavigateDay('next')}
                  className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {onCreateEvent && (
            <button
              onClick={onCreateEvent}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
            >
              Add Event
            </button>
          )}
        </div>
      </div>

      {/* Day Content */}
      <div className="p-6">
        {plannerItems.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">No items scheduled</h3>
            <p className="text-gray-500 mb-4">Add tasks, events, or routines to get started</p>
            {onCreateEvent && (
              <button
                onClick={onCreateEvent}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
              >
                Create Event
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* All-day items */}
            {untimedItems.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  All-day ({untimedItems.length})
                </h3>
                <div className="grid gap-3">
                  {untimedItems.map(item => (
                    <div
                      key={item.type + '-' + item.id}
                      className="p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className={`text-xs px-2 py-1 rounded ${getItemColor(item.type)}`}>
                              {item.type}
                            </span>
                            <span className="font-medium text-gray-800">{item.title}</span>
                          </div>
                          {item.description && (
                            <p className="text-sm text-gray-600 mt-2">
                              {item.description}
                            </p>
                          )}
                          {item.location && (
                            <p className="text-sm text-gray-500 mt-1">
                              📍 {item.location}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Timed items */}
            {timedItems.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Scheduled ({timedItems.length})
                </h3>
                <div className="grid gap-3">
                  {timedItems.map(item => (
                    <div
                      key={item.type + '-' + item.id}
                      className="p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4 text-gray-500" />
                              <span className="text-sm font-medium text-gray-600">
                                {item.startTime}{item.endTime && ` - ${item.endTime}`}
                              </span>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded ${getItemColor(item.type)}`}>
                              {item.type}
                            </span>
                            <span className="font-medium text-gray-800">{item.title}</span>
                          </div>
                          {item.description && (
                            <p className="text-sm text-gray-600 mt-2 pl-6">
                              {item.description}
                            </p>
                          )}
                          {item.location && (
                            <p className="text-sm text-gray-500 mt-1 pl-6">
                              📍 {item.location}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}