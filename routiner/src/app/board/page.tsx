"use server";
import Board from '../components/Board';
import AddButton from '../components/AddButton';
import {  getRoutines } from '../lib/actions/routines';
import { getEventsForCurrentWeek } from '../lib/actions/events';
import { getTasks } from '@/app/lib/actions/tasks'
import { fetchUserId } from '@/app/lib/actions/actions';
import { preloadBoardData } from '../lib/preload';
import type { Routine, Task, Event } from '@/app/types';

export default async function BoardPage() {
  let tasks: Task[] = [];
  let routines: Routine[] = [];
  let events: Event[] = [];
  
  const userId = await fetchUserId();
  if (userId) {
    // Start preloading data
    preloadBoardData(userId);
    
    try {
      const [tasksData, routinesData, eventsData] = await Promise.all([
        getTasks(),
        getRoutines(),
        getEventsForCurrentWeek(),
      ]);
      
      tasks = tasksData;
      routines = routinesData;
      events = eventsData;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }  

  return (
    <main className="flex-grow flex flex-col sm:flex-row pt-12 mt-4">
      <div className="flex-1 p-4">
        <Board 
          tasks={tasks} 
          routines={routines}
          events={events}
          userId={userId}
        />
        <AddButton />
      </div>
    </main>
  );
}