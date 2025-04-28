import React, { useState }  from 'react';

interface AddTaskProps {
    onAddTask: (task: {
      title: string;
      day?: string;
      date?: string;
      startTime?: string;
      endTime?: string;
      checked: boolean;
    }) => void;
    onClose: () => void;
}

export default function AddTask({ onAddTask, onClose }: AddTaskProps) {
    const [title, setTitle] = useState("");
    const [day, setDay] = useState("");
    const [date, setDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [checked, setChecked] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (title.trim()) {
          onAddTask({ title, day, date, startTime, endTime, checked });
          onClose(); // Close the modal after adding the task
        }
    };


    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Add New Task</h2>
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
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                            Add Task
                        </button>
                    </div>
                </form>
            </div>
        </div>

    );
}