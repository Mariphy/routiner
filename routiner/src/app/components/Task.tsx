import React from 'react';
interface TaskProps {
  task: {
    title: string; 
    day?: string;
    date?: string;
    startTime?: string;
    endTime?: string;
    checked: boolean;
  };
 
}

export default function Task({ task }: TaskProps) {
    return (
      <div className="task border p-2 mb-2">
        <h3 className="font-bold">{task.title}</h3>
      </div>
    );
}