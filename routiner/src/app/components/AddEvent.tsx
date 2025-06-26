import React, { useState } from 'react';
import type { EventInput } from '@/app/types.ts'

interface AddEventProps {
  onSave: (event:EventInput) => void;  
  onClose: () => void;
}  

export default function AddEvent( { onSave, onClose }: AddEventProps) {
  const now = new Date();
  const currentTime = now.toTimeString().slice(0, 5); // HH:MM format
  const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000).toTimeString().slice(0, 5);
  
  const [title, setTitle] = useState('');
  const [date, setDate] = useState<Date>(now);
  const [startTime, setStartTime] = useState(currentTime);
  const [endTime, setEndTime] = useState(oneHourLater);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ title, date, startTime, endTime });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-bold mb-4">Add Event</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Event Title"
            className="border p-2 rounded"
            required
          />
          <input
            type="date"
            value={date.toISOString().substring(0, 10)}
            onChange={(e) => {
              const value = e.target.value;
              if (value) {
                setDate(new Date(value));
              }
            }}
            className="border p-2 rounded"
            required
          />
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="border p-2 rounded"
            required
          />
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="border p-2 rounded"
            required
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
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}