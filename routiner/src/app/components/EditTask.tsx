'use client';
import React, { useState }  from 'react';

interface EditTaskProps {
    task: {
      title: string;
      id: string;
      day?: string;
      date?: Date;
      startTime?: string;
      endTime?: string;
      checked: boolean;
    };
    onEditTask: (task: {
      title: string;
      id: string;
      day?: string;
      date?: Date;
      startTime?: string;
      endTime?: string;
      checked: boolean;
    }) => void;
    onDeleteTask: (task: {
      title: string;
      id: string;
      day?: string;
      date?: Date;
      startTime?: string;
      endTime?: string;
      checked: boolean;
    }) => void;
    onClose: () => void;
}

export default function EditTask({ task, onEditTask, onDeleteTask, onClose }: EditTaskProps) {
    const [title, setTitle] = useState(task.title);
    const [day, setDay] = useState(task.day || "");
    const [date, setDate] = useState<Date | undefined>(task.date);  
    const [startTime, setStartTime] = useState(task.startTime || "");
    const [endTime, setEndTime] = useState(task.endTime || "");
    const [checked, setChecked] = useState(task.checked || false);
    const id = task.id;  

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (title.trim()) {
          // Apply the same date fix as AddEvent
          const taskDate = date ? new Date(date.getFullYear(), date.getMonth(), date.getDate()) : undefined;
          
          onEditTask({ title, id, day, date: taskDate, startTime, endTime, checked });
          onClose();
        }
    };

    const handleDelete = () => {
        onDeleteTask(task);
        onClose();
    };


    return (
        <div 
            className="fixed inset-0 bg-white bg-opacity-25 flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div className="bg-white p-6 m-2 rounded-lg shadow-lg w-full max-w-lg"
                onClick={(e) => e.stopPropagation()} 
            >
                <h2 className="text-xl font-bold mb-4">Edit Task</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full border p-2 rounded"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Day</label>
                        <select
                            value={day}
                            onChange={(e) => setDay(e.target.value)}
                            className="w-full border p-2 rounded"
                        >
                            <option value="">Select a day</option>
                            <option value="Monday">Monday</option>
                            <option value="Tuesday">Tuesday</option>
                            <option value="Wednesday">Wednesday</option>
                            <option value="Thursday">Thursday</option>
                            <option value="Friday">Friday</option>
                            <option value="Saturday">Saturday</option>
                            <option value="Sunday">Sunday</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Date</label>
                        <input
                            type="date"
                            value={date ? date.toISOString().substring(0, 10) : ""}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (value) {
                                    // Create date in local timezone at midnight (same as AddEvent)
                                    const [year, month, day] = value.split('-').map(Number);
                                    setDate(new Date(year, month - 1, day));
                                } else {
                                    setDate(undefined);
                                }
                            }}
                            className="w-full border p-2 rounded"
                        />
                    </div>
                    <div className="flex gap-4">
                        <div>
                        <label className="block text-sm font-medium">Start Time</label>
                        <input
                            type="time"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            className="w-full border p-2 rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">End Time</label>
                        <input
                            type="time"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            className="w-full border p-2 rounded"
                        />
                       </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => setChecked(e.target.checked)}
                        className="w-4 h-4"
                        />
                        <label className="text-sm font-medium">Mark as Completed</label>
                    </div>
                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                            >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-accent text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                            Save Changes
                        </button>
                    </div>
                    <div>
                        <button
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                            onClick={handleDelete}
                        >
                            Delete
                        </button>
                    </div>
                </form>
            </div>
        </div>

    );
}