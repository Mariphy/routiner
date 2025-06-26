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
  onEditTask?: (task: TaskProps['task']) => void; // Use your existing edit handler
}

export default function Task({ task, onClick, onEditTask }: TaskProps) {
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    
    // Create updated task with new checked status
    const updatedTask = {
      ...task,
      checked: e.target.checked
    };
    
    // Use your existing edit handler
    if (onEditTask) {
      onEditTask(updatedTask);
    }
  };

  return (
    <div 
      className={`task relative border p-2 mb-2 rounded-lg shadow-sm cursor-pointer group ${
        task.checked ? 'bg-green-50 border-green-200' : 'bg-neutral-100'
      }`}
      onClick={onClick} 
    >
      <div className="flex items-center mb-2">
        <input
          type="checkbox"
          checked={task.checked}
          onClick={(e) => e.stopPropagation()}
          onChange={handleCheckboxChange}
          className="mr-2 cursor-pointer"
        />
        <h3 className={`font-medium ${task.checked ? 'line-through text-gray-500' : ''}`}>
          {task.title}
        </h3>
      </div>  
      {task.date && task.date instanceof Date && !isNaN(task.date.getTime()) ? (
        <p className="font-light mt-2">Deadline: {task.date.toLocaleDateString()}</p>
      ) : null}
      
      <div 
        data-testid="edit-button"
        className="absolute top-2 right-2 text-gray-500 cursor-pointer hidden group-hover:block"
        onClick={(e) => {
          e.stopPropagation();
          if (onClick) onClick();
        }}
      >
        <CiEdit />
      </div>
    </div>
  );
}