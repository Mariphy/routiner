import { startOfWeek, addDays, format, isSameDay } from 'date-fns';

export default function Loading() {
   const daysOfWeek = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));
  
  return (
    <div className="board-container w-full overflow-x-auto">
      {/* All Tasks */}
      <div className="board flex gap-2 p-4 min-w-max min-h-[600px]">
        <div className="column border p-4 sm:w-72 md:w-72 lg:w-80 flex-shrink-0 rounded-lg bg-neutral-200 shadow-md">
        </div>
        {/* Day Columns */}
        {daysOfWeek.map((day, index) => {
          const dayName = format(day, 'EEEE');

          return (
            <div key={index} className="column border p-4 sm:w-72 md:w-72 lg:w-80 rounded-lg bg-neutral-200 shadow-md">
            </div>
          );
        })}
      </div>
    </div>

  )
}
