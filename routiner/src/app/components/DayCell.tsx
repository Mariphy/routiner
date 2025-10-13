import React from 'react';
import { isSameDay, format } from 'date-fns';

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
  const isToday = isSameDay(day, today);
  const isSelected = isSameDay(day, selectedDate);

  return (
    <div
      className={`flex flex-col justify-between items-start p-1 border rounded-lg shadow-sm aspect-square cursor-pointer overflow-hidden bg-white text-gray-900 md:min-h-24 md:min-w-24' 
       ${isToday ? 'border-2 border-green-500' : isSelected ? 'border-2 border-blue-500' : 'border-gray-300'
      }`}
      onClick={() => onClick(day)}
    >
      <span className="text-sm font-bold">{format(day, 'd')}</span>
      {/* Event previews */}
      {events.slice(0, 3).map((event, idx) => (
        <span key={event.id || idx} className="text-xs truncate bg-green-100 rounded px-1">
          {event.title}
        </span>
      ))}
      {events.length > 3 && (
        <span className="text-xs text-gray-400 mt-1">+{events.length - 3} more</span>
      )}
    </div>
  );
}