import React, { useState, useTransition } from 'react';
import { CiEdit } from "react-icons/ci";
import EditTask from '@/app/components/EditTask';
import { editTask } from '@/app/lib/actions/tasks';
import type { Task as TaskType } from '@/app/types.ts';

interface TaskProps {
  task: TaskType;
}

export default function Task({ task }: TaskProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleTaskClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    
    const formData = new FormData();
    formData.append('title', task.title);
    formData.append('checked', e.target.checked ? 'on' : '');

    if (task.day) formData.append('day', task.day);
    if (task.date) formData.append('date', task.date.toISOString());
    if (task.startTime) formData.append('startTime', task.startTime);
    if (task.endTime) formData.append('endTime', task.endTime);
    startTransition(async () => {
      try {
        const result = await editTask(formData, task.id);
        if (!result.success) {
          console.error('Failed to update task:', result.error);
        }
      } catch (error) {
        console.error('Error updating task:', error);
      }
    });
  };

  return (
    <>
      <div 
        className={`task relative border p-2 mb-2 rounded-lg shadow-sm cursor-pointer group ${
          task.checked ? 'bg-green-50 border-green-200' : 'bg-neutral-100'
        } ${isPending ? 'opacity-50' : ''}`}
        onClick={handleTaskClick} 
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
          <p className="font-light mt-2">Deadline: {task.date.toISOString().split('T')[0]}</p>
        ) : null}
        
        <div 
          data-testid="edit-button"
          className="absolute top-2 right-2 text-gray-500 cursor-pointer hidden group-hover:block"
          onClick={(e) => {
            e.stopPropagation();
            handleTaskClick();
          }}
        >
          <CiEdit />
        </div>
      </div>
      {isModalOpen && (
          <EditTask
            task={task}
            onClose={closeModal}
          />
      )}
    </>
  );
}