import { startOfWeek, addDays } from 'date-fns';

export default function Loading() {
  const startDate = startOfWeek(new Date(), { weekStartsOn: 0 });
  const daysOfWeek = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));
  
  return (
    <div className="w-full overflow-x-auto">
      {/* Toggle Header Skeleton */}
      <div className="flex justify-between items-center p-4 bg-white border-b">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>

      {/* Board Container */}
      <div className="board flex gap-2 p-4 min-w-max min-h-[600px]">
        {/* All Tasks Column */}
        <div className="column border p-4 sm:w-72 md:w-72 lg:w-80 flex-shrink-0 rounded-lg bg-neutral-200 shadow-md">
          <div className="h-6 w-24 bg-gray-300 rounded animate-pulse mb-4"></div>
          
          {/* Task Skeletons */}
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="border p-2 mb-2 rounded-lg bg-gray-100 shadow-sm">
              <div className="h-4 w-3/4 bg-gray-300 rounded animate-pulse mb-2"></div>
              <div className="h-3 w-1/2 bg-gray-300 rounded animate-pulse"></div>
            </div>
          ))}

          {/* Add Task Input Skeleton */}
          <div className="flex items-center gap-2 mb-4">
            <div className="h-10 flex-grow bg-gray-300 rounded animate-pulse"></div>
            <div className="h-10 w-10 bg-gray-300 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Day Columns */}
        {daysOfWeek.map((day, index) => {
          return (
            <div key={index} className="column border p-4 sm:w-72 md:w-72 lg:w-80 rounded-lg bg-neutral-200 shadow-md">
              <div className="h-6 w-20 bg-gray-300 rounded animate-pulse mb-4"></div>
              
              {/* Task Skeletons */}
              {Array.from({ length: 2 }, (_, i) => (
                <div key={`task-${i}`} className="border p-2 mb-2 rounded-lg bg-gray-100 shadow-sm">
                  <div className="h-4 w-3/4 bg-gray-300 rounded animate-pulse mb-2"></div>
                  <div className="h-3 w-1/2 bg-gray-300 rounded animate-pulse"></div>
                </div>
              ))}

              {/* Routine Skeletons */}
              {Array.from({ length: 1 }, (_, i) => (
                <div key={`routine-${i}`} className="border p-2 mb-2 rounded-lg bg-blue-100 shadow-sm">
                  <div className="h-4 w-2/3 bg-gray-300 rounded animate-pulse mb-2"></div>
                  <div className="h-3 w-1/3 bg-gray-300 rounded animate-pulse"></div>
                </div>
              ))}

              {/* Event Skeletons */}
              {Array.from({ length: 1 }, (_, i) => (
                <div key={`event-${i}`} className="border p-2 mb-2 rounded-lg bg-green-100 shadow-sm">
                  <div className="h-4 w-2/3 bg-gray-300 rounded animate-pulse mb-2"></div>
                  <div className="h-3 w-1/2 bg-gray-300 rounded animate-pulse mb-1"></div>
                  <div className="h-3 w-1/3 bg-gray-300 rounded animate-pulse"></div>
                </div>
              ))}

              {/* Add Task Input Skeleton */}
              <div className="flex items-center gap-2 mb-4">
                <div className="h-10 flex-grow bg-gray-300 rounded animate-pulse"></div>
                <div className="h-10 w-10 bg-gray-300 rounded animate-pulse"></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
