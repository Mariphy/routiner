import React from 'react';
import { CiEdit } from "react-icons/ci";

interface TaskProps {
  task: {
    title: string; 
    id: string;
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
        className="task relative border p-2 mb-2 rounded-lg bg-neutral-100 shadow-sm cursor-pointer group"
        onClick={onClick} 
      >
        <h3 className="font-medium">{task.title}</h3>
        {task.date ? (
          <p className='font-light mt-2' >{task.date}</p>
        ): null}
        
        <div 
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