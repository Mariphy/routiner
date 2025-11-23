import React, { useState } from 'react';
import { CiEdit } from "react-icons/ci";
import EditRoutine from '@/app/components/EditRoutine';
import type { Routine } from '@/app/types'

interface RoutineProps {
  routine: Routine;
}

export default function Routine({ routine }: RoutineProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRoutineClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div
      className="routine relative border p-2 mb-2 rounded-lg bg-blue-100 shadow-sm cursor-pointer group"
      onClick={handleRoutineClick}
      draggable="true"
    >
      <h3 className="font-medium">{routine.title}</h3>
      {routine.startTime && routine.endTime && (
        <p className="text-sm text-gray-600">
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