import React, { useState, useTransition } from 'react';
import { CiEdit } from "react-icons/ci";
import EditRoutine from '@/app/components/EditRoutine';
import { editRoutine } from '@/app/actions/routines';
import type { Routine } from '@/app/types';
import { format, startOfWeek } from 'date-fns';

interface RoutineProps {
  routine: Routine;
  dayName?: string;
}

export default function Routine({ routine, dayName }: RoutineProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Get current week identifier (e.g., "2025-W47")
  const currentWeekStart = startOfWeek(new Date(), { weekStartsOn: 0 });
  const currentWeekKey = format(currentWeekStart, 'yyyy-MM-dd');

  // Create a week-specific key for the checkbox
  const weekDayKey = dayName ? `${currentWeekKey}-${dayName}` : '';
  const isCheckedForDay = weekDayKey ? (routine.checkedDays?.[weekDayKey] || false) : false;

  const handleRoutineClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    
    if (!weekDayKey) return;

    const isChecked = e.target.checked;
    const newCheckedDays = {
      ...routine.checkedDays,
      [weekDayKey]: isChecked
    };

    // Calculate new completion count
    const currentCount = routine.completionCount || 0;
    const newCount = isChecked ? currentCount + 1 : Math.max(0, currentCount - 1);

    startTransition(async () => {
      const formData = new FormData();
      // Only send the fields that are actually changing
      formData.append('checkedDays', JSON.stringify(newCheckedDays));
      formData.append('completionCount', newCount.toString());
      
      await editRoutine(formData, routine.id);
    });
  };

  return (
    <div
      className={`routine relative border p-2 mb-2 rounded-lg shadow-sm cursor-pointer group ${
        isCheckedForDay ? 'bg-blue-50/20 border-blue-100/30 text-gray-300' : 'bg-blue-100'
      } ${isPending ? 'opacity-50' : ''}`}
      onClick={handleRoutineClick}
    >
      <div className="flex items-center mb-1">
        <label htmlFor={`routine-checkbox-${routine.id}-${dayName}`} className="sr-only">
          Routine completion status for {dayName}
        </label>
        <input
          id={`routine-checkbox-${routine.id}-${dayName}`}
          type="checkbox"
          checked={isCheckedForDay}
          onClick={(e) => e.stopPropagation()}
          onChange={handleCheckboxChange}
          className={`mr-2 cursor-pointer appearance-none rounded-full w-4 h-4 border-2 border-gray-400 ${
            isCheckedForDay ? 'bg-blue-500 border-blue-500 opacity-30' : 'bg-white'
          }`}
        />
        <h3 className={`font-medium ${isCheckedForDay ? 'text-gray-300' : ''}`}>{routine.title}</h3>
        {routine.completionCount !== undefined && routine.completionCount > 0 && (
          <span className={`ml-auto text-xs font-semibold px-2 py-1 rounded-full ${
            isCheckedForDay ? 'bg-blue-200/30 text-gray-400' : 'bg-blue-200 text-blue-800'
          }`}>
            {routine.completionCount}
          </span>
        )}
      </div>
      {routine.startTime && routine.endTime && (
        <p className={`text-sm ${isCheckedForDay ? 'text-gray-300' : 'text-gray-600'}`}>
          {routine.startTime} - {routine.endTime}
        </p>
      )}
      <div 
        data-testid="edit-button"
        className="absolute top-2 right-2 text-gray-500 cursor-pointer hidden group-hover:block"
        onClick={(e) => {
          e.stopPropagation();
          handleRoutineClick();
        }}
      >
        <CiEdit />
      </div>
      {isModalOpen && (
          <EditRoutine
            routine={routine}
            onClose={closeModal}
          />
      )}
    </div>
  );
}