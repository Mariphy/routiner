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
      //const cloneDay = day;
      days.push(
        <div
          className={`col cell ${!isSameMonth(day, monthStart) ? "disabled" : isSameDay(day, today) ? "selected" : ""}`}
          key={day.toString()}
        >
          <span className="number">{formattedDate}</span>
        </div>
      );
      day = addDays(day, 1);
    }
    rows.push(
      <div className="row" key={day.toString()}>
        {days}
      </div>
    );
    days = [];
  }
  return (
    <div className="calendar">
      <div className="header">
        <h2 className="text-2xl font-bold mb-4">Calendar View</h2>
      </div>
      <div className="body">
        {rows}
      </div>
      <Day></Day>
    </div>
  );
  }