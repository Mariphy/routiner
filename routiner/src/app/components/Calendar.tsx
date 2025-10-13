"use client";
import React, { useState, useMemo } from 'react';
import { startOfMonth, endOfMonth, addDays, subMonths, addMonths, format, getDay, isSameDay } from 'date-fns';
import Day from '@/app/components/Day';
import DayCell from '@/app/components/DayCell';
import type { Event as CalendarEvent } from '@/app/types.ts';
import { X } from 'lucide-react';

interface CalendarProps {
  userId: string;
  events: CalendarEvent[];
}

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function Calendar({ userId, events }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDayView, setIsDayView] = useState(false);

  // Filter events for the selected date
  const eventsForSelectedDate = events.filter(event =>
    event.date && isSameDay(
      event.date instanceof Date ? event.date : new Date(event.date),
      selectedDate
    )
  );

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);

  // Memoize the calendar grid to avoid infinite loops
  const calendarGrid = useMemo(() => {
    const days: Date[] = [];
    let day = monthStart;
    while (day <= monthEnd) {
      days.push(day);
      day = addDays(day, 1);
    }
    // Add leading empty days for the first week
    const startDayOfWeek = getDay(monthStart);
    const leadingEmptyDays = Array.from({ length: startDayOfWeek });
    return { days, leadingEmptyDays };
  }, [monthStart, monthEnd]);

  return (
    <div className="flex flex-col lg:flex-row justify-evenly h-screen">
      {/* Calendar grid */}
      <div className="flex flex-col justify-start items-center flex-shrink p-4">
        <div className="text-center mb-4 p-4 flex items-center justify-center gap-4">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="px-2 py-1 rounded hover:bg-gray-200"
            aria-label="Previous Month"
          >
            &#8592; {/* Left arrow */}
          </button>
          <h2 className="text-2xl font-bold min-w-[120px]">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="px-2 py-1 rounded hover:bg-gray-200"
            aria-label="Next Month"
          >
            &#8594; {/* Right arrow */}
          </button>
        </div>
        {/* Days of week header */}
        <div className="grid grid-cols-7 w-full max-w-screen-lg mb-1">
          {weekDays.map((wd) => (
            <div key={wd} className="text-center font-semibold text-gray-600">{wd}</div>
          ))}
        </div>
        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1 w-full max-w-screen-lg max-h-screen-lg overflow-auto">
          {/* Leading empty cells */}
          {calendarGrid.leadingEmptyDays.map((_, idx) => (
            <div key={`empty-${idx}`} />
          ))}
          {/* Day cells */}
          {calendarGrid.days.map((day) => {
            // Find events for this day
            const eventsForDay = events.filter(
              (event) =>
                event.date &&
                isSameDay(
                  event.date instanceof Date ? event.date : new Date(event.date),
                  day
                )
            );
            return (
              <DayCell
                key={day.toISOString()}
                day={day}
                today={new Date()}
                selectedDate={selectedDate}
                onClick={(date) => {
                  setSelectedDate(date);
                  setIsDayView(true);
                }}
                events={eventsForDay} // Pass events for preview
              />
            );
          })}
        </div>
      </div>

      {/* Day view */}
      {selectedDate && isDayView &&(
        <div className="py-6 px-2 flex-1">
          <div className="flex justify-end">
            <button
              onClick={() => setIsDayView(false)}
              className='border rounded-full m-2 p-2'
            >
              <X />
            </button>
          </div>
          <Day
            userId={userId}
            selectedDate={selectedDate}
            events={eventsForSelectedDate}  // Pass pre-filtered events
          />
        </div>)}
    </div>
  );
}