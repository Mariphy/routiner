import React from 'react';
import { CiEdit } from "react-icons/ci";

interface TaskProps {
  task: {
    title: string; 
    day?: string;
    date?: string;
    startTime?: string;
    endTime?: string;
    checked: boolean;
  };
  onClick?: () => void;
}

export default function Task({ task, onClick }: TaskProps) {
    return (
      <div 
        className="task border p-2 mb-2 rounded-lg bg-neutral-100 shadow-sm cursor-pointer"
        onClick={onClick} 
      >
        <h3 className="font-normal">{task.title}</h3>
        <div 
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation(); // Prevent triggering the parent onClick
            if (onClick) onClick();
          }}
        >
          <CiEdit />
        </div>
      </div>
    );
}