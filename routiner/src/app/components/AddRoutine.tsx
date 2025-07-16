import React, { useState } from 'react';
import Select from 'react-select';
import type { RoutineInput } from '@/app/types.ts';

interface AddRoutineProps {
  onSave: (routine:RoutineInput) => void;
  onClose: () => void;
}

export default function AddRoutine({ onSave, onClose }: AddRoutineProps) {
  const [title, setTitle] = useState('');
  const [daily, setDaily] = useState(false);
  const [repeat, setRepeat] = useState<string[]>(["Monday"]);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  

  const repeatOptions = [
    { value: 'Monday', label: 'Monday' },
    { value: 'Tuesday', label: 'Tuesday' },
    { value: 'Wednesday', label: 'Wednesday' },
    { value: 'Thursday', label: 'Thursday' },
    { value: 'Friday', label: 'Friday' },
    { value: 'Saturday', label: 'Saturday' },
    { value: 'Sunday', label: 'Sunday' }
  ];

  const handleDailyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setDaily(isChecked);
    if (isChecked) {
      setRepeat(repeatOptions.map(option => option.value))
    }
  }  

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!daily && repeat.length === 0) {
      alert('Please select either daily routine or specific days');
      return;
    }
    
    onSave({ title, daily, repeat, startTime, endTime });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 overflow-y-auto">
        <h2 className="text-lg font-bold mb-4">Add Routine</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Morning Routine"
            className="border p-2 rounded"
            required
          />

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={daily}
              onChange={handleDailyChange}
              className="form-checkbox"
            />
            <span>Repeat Daily</span>
          </label>  
          <span>Or choose which days of week to repeat:</span>
          <Select
            isOptionDisabled={() => daily}
            defaultValue={repeatOptions[0]}
            isMulti
            name="repeat"
            options={repeatOptions}
            className="basic-multi-select"
            classNamePrefix="select"
            onChange={(selectedOptions) => {
              setRepeat(selectedOptions.map(option => option.value))
            }}
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