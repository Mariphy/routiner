import React, { useState }  from 'react';

interface EditTaskProps {
    task: {
      title: string;
      id: string;
      day?: string;
      date?: string;
      startTime?: string;
      endTime?: string;
      checked: boolean;
    };
    onEditTask: (task: {
      title: string;
      id: string;
      day?: string;
      date?: string;
      startTime?: string;
      endTime?: string;
      checked: boolean;
    }) => void;
    onClose: () => void;
}

export default function EditTask({ task, onEditTask, onClose }: EditTaskProps) {
    const [title, setTitle] = useState(task.title);
    const [day, setDay] = useState(task.day || "");
    const [date, setDate] = useState(task.date || "");  
    const [startTime, setStartTime] = useState(task.startTime || "");
    const [endTime, setEndTime] = useState(task.endTime || "");
    const [checked, setChecked] = useState(task.checked || false);
    const id = task.id;  

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (title.trim()) {
          onEditTask({ title, id, day, date, startTime, endTime, checked });
          onClose(); // Close the modal after adding the task
        }
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
                        <input
                            type="text"
                            value={day}
                            onChange={(e) => setDay(e.target.value)}
                            className="w-full border p-2 rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Date</label>
                        <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
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
                </form>
            </div>
        </div>

    );
}