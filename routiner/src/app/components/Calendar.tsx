import React from 'react';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, format, addDays, isSameMonth, isSameDay } from 'date-fns';
import Day from './Day';

export default function Calendar() {
  const today = new Date();
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const dateFormat = "d";
  const rows = [];
  let days = [];
  let day = startDate;
  let formattedDate = "";

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      formattedDate = format(day, dateFormat);
      const isCurrentMonth = isSameMonth(day, monthStart);
      const isToday = isSameDay(day, today);
      //const cloneDay = day;
      days.push(
        <div
          className={`flex flex-col justify-between items-start p-2 border rounded-lg shadow-sm aspect-square ${
            isCurrentMonth
              ? "bg-white text-gray-900"
              : "bg-gray-100 text-gray-400"
          } ${isToday ? "border-2 border-green-500" : "border-gray-300"}`}
          key={day.toString()}
        >
          <span className="">{formattedDate}</span>
        </div>
      );
      day = addDays(day, 1);
    }
    rows.push(
      <div className="grid grid-cols-7 w-full justify center" 
        key={day.toString()}>
        {days}
      </div>
    );
    days = [];
  }
  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-col justify-between items-center flex-shrink p-4">
        <div className="text-center mb-4 p-4">
          <h2 className="text-2xl font-bold">Calendar View</h2>
        </div>
        <div className="flex flex-col gap-1 w-full max-w-screen-lg max-h-screen-lg overflow-auto">
          {rows}
        </div>
      </div>
      <div className='p-6'>
        <Day></Day>
      </div>
    </div>
  );
  }