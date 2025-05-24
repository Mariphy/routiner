import React, { useState } from 'react';
import { startOfMonth, endOfMonth, addDays, subMonths, addMonths, format, getDay } from 'date-fns';
import Day from './Day';
import DayCell from './DayCell';

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);

  // Calculate leading empty days for the first week
  const startDayOfWeek = getDay(monthStart);
  const allDays: Date[] = [];
  let day = monthStart;
  while (day <= monthEnd) {
    allDays.push(day);
    day = addDays(day, 1);
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-col justify-between items-center flex-shrink p-4">
        <div className="text-center mb-4 p-4 flex items-center justify-center gap-4">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="px-2 py-1 rounded hover:bg-gray-200"
            aria-label="Previous Month"
          >
            &#8592;
          </button>
          <h2 className="text-2xl font-bold min-w-[120px]">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="px-2 py-1 rounded hover:bg-gray-200"
            aria-label="Next Month"
          >
            &#8594;
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
          {/* Add empty cells for days before the first of the month */}
          {Array.from({ length: startDayOfWeek }).map((_, idx) => (
            <div key={`empty-${idx}`} />
          ))}
          {allDays.map((day) => (
            <DayCell
              key={day.toISOString()}
              day={day}
              today={new Date()}
              selectedDate={selectedDate}
              onClick={setSelectedDate}
            />
          ))}
        </div>
      </div>
      <div className="p-6">
        <Day selectedDate={selectedDate} />
      </div>
    </div>
  );
}