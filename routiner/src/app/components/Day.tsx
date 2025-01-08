import React from 'react';
import { format } from 'date-fns';

export default function Day() {
  const today = new Date();

  return (
    <div className="day-view">
      <h2 className="text-2xl font-bold mb-4">Day View</h2>
      <p>Today is {format(today, 'EEEE, MMMM do, yyyy')}</p>
      {/* Add more details for the day view here */}
    </div>
  );
}