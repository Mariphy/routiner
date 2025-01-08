import React from 'react';
interface TaskProps {
  task: {
    id: number;
    title: string;
    description: string;
  };
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function Task({ task, onEdit, onDelete }: TaskProps) {
    return (
      <div className="task border p-2 mb-2">
        <h3 className="font-bold">{task.title}</h3>
        <p>{task.description}</p>
        <button className="mr-2 p-1 bg-blue-500 text-white" onClick={() => onEdit(task.id)}>Edit</button>
        <button className="p-1 bg-red-500 text-white" onClick={() => onDelete(task.id)}>Delete</button>
      </div>
    );
  }