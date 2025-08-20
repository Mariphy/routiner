import Board from '../components/Board';
import AddButton from '../components/AddButton';
import { 
  fetchUserId, getTasks, getRoutines, getEventsForCurrentWeek, 
} from '../lib/api';
import { preloadBoardData } from '../lib/preload';

export default async function BoardPage() {
  let tasks = [];
  let routines = [];
  let events = [];
  
  const userId = await fetchUserId();
  if (userId) {
    // Start preloading data
    preloadBoardData(userId);
    
    try {
      const [tasksData, routinesData, eventsData] = await Promise.all([
        getTasks(userId),
        getRoutines(userId),
        getEventsForCurrentWeek(userId),
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
        />
        <AddButton />
      </div>
    </main>
  );
}