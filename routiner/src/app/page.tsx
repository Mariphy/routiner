'use client';

import React, { useState } from 'react';
import Board from "./components/Board";
import Calendar from "./components/Calendar";
import Day from "./components/Day";

export default function Home() {
  const [view, setView] = useState('board');

  return (
    <div className="flex flex-col min-h-screen">
      <header className="p-4 bg-gray-800 text-white text-center">
        <h1 className="text-2xl">Routiner App</h1>
        <div className="mt-4">
        <button
            className={`p-2 ${view === 'board' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
            onClick={() => setView('board')}
          >
            Board
          </button>
          <button
            className={`mr-4 p-2 ${view === 'calendar' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
            onClick={() => setView('calendar')}
          >
            Calendar
          </button>
          <button
            className={`p-2 ${view === 'day' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
            onClick={() => setView('day')}
          >
            Day View
          </button>
        </div>
      </header>
      <main className="flex-grow p-4">
        {view === 'calendar' && <Calendar />}
        {view === 'board' && <Board />}
        {view === 'day' && <Day />}
      </main>
    </div>
  );
  }