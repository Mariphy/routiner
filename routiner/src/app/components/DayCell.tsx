import React from 'react';
import { isSameDay, isSameMonth, format } from 'date-fns';

export default function DayCell({
  day,
  today,
  selectedDate,
  onClick,
}: {
  day: Date;
  today: Date;
  selectedDate: Date;
  onClick: (date: Date) => void;
}) {
  const isCurrentMonth = isSameMonth(day, today);
  const isToday = isSameDay(day, today);
  const isSelected = isSameDay(day, selectedDate);

  return (
    <div
      className={`flex flex-col justify-between items-start p-2 border rounded-lg shadow-sm aspect-square cursor-pointer ${
        isCurrentMonth ? 'bg-white text-gray-900' : 'bg-gray-100 text-gray-400'
      } ${
        isToday ? 'border-2 border-green-500' : isSelected ? 'border-2 border-blue-500' : 'border-gray-300'
      }`}
      onClick={() => onClick(day)}
    >
      <span className="text-sm font-bold">{format(day, 'd')}</span>
    </div>
  );
}