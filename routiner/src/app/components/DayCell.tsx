import React from 'react';
import { isSameDay, isSameMonth, format } from 'date-fns';

export default function DayCell({
  day,
  today,
  selectedDate,
  onClick,
  events = [],
}: {
  day: Date;
  today: Date;
  selectedDate: Date;
  onClick: (date: Date) => void;
  events?: Array<{ id?: string; title?: string }>;
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
      {/* Event previews */}
      {events.slice(0, 2).map((event, idx) => (
        <span key={event.id || idx} className="text-xs truncate bg-green-100 rounded px-1 mt-1">
          {event.title}
        </span>
      ))}
      {events.length > 2 && (
        <span className="text-xs text-gray-400 mt-1">+{events.length - 2} more</span>
      )}
    </div>
  );
}