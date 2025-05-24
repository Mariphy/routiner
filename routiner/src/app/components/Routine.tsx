import React from 'react';
import type { Routine } from '@/app/types'

interface RoutineProps {
  routine: Routine;
  onClick?: () => void;
}

export default function Routine({ routine, onClick }: RoutineProps) {
  return (
    <div
      className="routine relative border p-2 mb-2 rounded-lg bg-blue-100 shadow-sm cursor-pointer group"
      onClick={onClick}
    >
      <h3 className="font-medium">{routine.title}</h3>
      {routine.startTime && routine.endTime && (
        <p className="text-sm text-gray-600">
          {routine.startTime} - {routine.endTime}
        </p>
      )}
    </div>
  );
}