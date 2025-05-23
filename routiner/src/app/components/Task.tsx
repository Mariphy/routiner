import React from 'react';
import { CiEdit } from "react-icons/ci";

interface TaskProps {
  task: {
    title: string; 
    id: string;
    day?: string;
    date?: Date;
    startTime?: string;
    endTime?: string;
    checked: boolean;
  };
  onClick?: () => void;
}

export default function Task({ task, onClick }: TaskProps) {
    return (
      <div 
        className="task relative border p-2 mb-2 rounded-lg bg-neutral-100 shadow-sm cursor-pointer group"
        onClick={onClick} 
      >
        <div className="flex items-center mb-2">

          <input
            type="checkbox"
            checked={task.checked}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => {
              e.stopPropagation(); // Prevent triggering the parent onClick
              // Handle checkbox change logic here
              console.log(`Task ${task.id} checked:`, e.target.checked);
            }}
            className="mr-2 cursor-pointer"
          />
          <h3 className="font-medium">{task.title}</h3>
        </div>  
        {task.date && task.date instanceof Date && !isNaN(task.date.getTime()) ? (
          <p className="font-light mt-2">{task.date.toLocaleDateString()}</p>
        ) : null}
        
        <div 
          data-testid="edit-button"
          className="absolute top-2 right-2 text-gray-500 cursor-pointer hidden group-hover:block"
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