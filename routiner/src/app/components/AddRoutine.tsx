import React, { useState } from 'react';

interface Routine {
    title: string;
    id: string;
    day?: string;
    date?: Date;
    startTime?: string;
    endTime?: string;
    subissue?: string;
    repeat?: string; 
}

type RoutineInput = Omit<Routine, 'id'>;

interface AddRoutineProps {
  onSave: (routine:RoutineInput) => void;
  onClose: () => void;
}

export default function AddRoutine({ onSave, onClose }: AddRoutineProps) {
  const [title, setTitle] = useState('');
  const [day, setDay] = useState('');
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [repeat, setRepeat] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ title, day, date, startTime, endTime, repeat });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-bold mb-4">Add Routine</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Routine Title"
            className="border p-2 rounded"
            required
          />
          <select
            value={day}
            onChange={(e) => setDay(e.target.value)}
            className="border p-2 rounded"
            required
          >
            <option value="">Select Day</option>
            <option value="Monday">Monday</option>
            <option value="Tuesday">Tuesday</option>
            <option value="Wednesday">Wednesday</option>
            <option value="Thursday">Thursday</option>
            <option value="Friday">Friday</option>
            <option value="Saturday">Saturday</option>
            <option value="Sunday">Sunday</option>
          </select>
          <input
            type="date"
            value={date ? date.toISOString().substring(0, 10) : ""}
            onChange={(e) => {
              const value = e.target.value;
              setDate(value ? new Date(value) : undefined);
            }}
            className="border p-2 rounded"
          />
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="border p-2 rounded"
          />
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="border p-2 rounded"
          />
          <input
            type="text"
            value={repeat}
            onChange={(e) => setRepeat(e.target.value)}
            placeholder="Repeat (e.g., Weekly)"
            className="border p-2 rounded"
          />
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
              className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}