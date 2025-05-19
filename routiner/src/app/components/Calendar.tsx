import React, { useState } from 'react';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays } from 'date-fns';
import Day from './Day';
import DayCell from './DayCell';

export default function Calendar() {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today);
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const allDays: Date[] = [];
  let day = startDate;
  while (day <= endDate) {
    allDays.push(day);
    day = addDays(day, 1);
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-col justify-between items-center flex-shrink p-4">
        <div className="text-center mb-4 p-4">
          <h2 className="text-2xl font-bold">Calendar View</h2>
        </div>
        <div className="grid grid-cols-7 gap-1 w-full max-w-screen-lg max-h-screen-lg overflow-auto">
          {allDays.map((day) => (
              <DayCell
                key={day.toISOString()}
                day={day}
                today={today}
                selectedDate={selectedDate}
                onClick={setSelectedDate}
              />
            ))}
        </div>
      </div>
      <div className='p-6'>
        <Day selectedDate={selectedDate} />
      </div>
    </div>
  );
  }