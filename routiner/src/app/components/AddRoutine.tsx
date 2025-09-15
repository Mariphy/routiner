"use client";
import React, { useTransition } from 'react';
import Select from 'react-select';
import { addRoutine } from "@/app/lib/actions/routines";

interface AddRoutineProps {
  onClose: () => void;
}

export default function AddRoutine({ onClose }: AddRoutineProps) {
  const [isPending, startTransition] = useTransition();

  const addRoutineAction = async (formData: FormData) => {
    startTransition(async () => {
      const res = await addRoutine(formData);
      if (res.success) {
        onClose();
      } else {
        console.error(res.error);
      }
    });
  };

  const repeatOptions = [
    { value: 'Monday', label: 'Monday' },
    { value: 'Tuesday', label: 'Tuesday' },
    { value: 'Wednesday', label: 'Wednesday' },
    { value: 'Thursday', label: 'Thursday' },
    { value: 'Friday', label: 'Friday' },
    { value: 'Saturday', label: 'Saturday' },
    { value: 'Sunday', label: 'Sunday' }
  ];

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-white p-6 rounded-lg shadow-lg w-96 overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold mb-4">Add Routine</h2>
        <form action={addRoutineAction} className="flex flex-col gap-4">
          <input
            type="text"
            name="title"
            placeholder="Morning Routine"
            className="border p-2 rounded"
            required
          />

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="daily"
              className="form-checkbox"
            />
            <span>Repeat Daily</span>
          </label>
          <span>Or choose which days of week to repeat:</span>
          <Select
            defaultValue={repeatOptions[0]}
            isMulti
            name="repeat"
            options={repeatOptions}
            className="basic-multi-select"
            classNamePrefix="select"
          />
          <input
            type="time"
            name="startTime"
            className="border p-2 rounded"
          />
          <input
            type="time"
            name="endTime"
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
              disabled={isPending}
              className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
            >
              {isPending ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}