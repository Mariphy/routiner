'use client'
import React, { useTransition } from 'react';
import { addTask } from "@/app/lib/actions/tasks";

interface AddTaskProps {
  onClose: () => void;
}

export default function AddTask({ onClose }: AddTaskProps) {
  const [isPending, startTransition] = useTransition();

  const addTaskAction = async (formData: FormData) => {
    startTransition(async () => {
      const res = await addTask(formData);
      if (res.success) {
        onClose();
      } else {
        console.error(res.error);
      }
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-white p-6 rounded-lg shadow-lg w-96"
        onClick={(e) => e.stopPropagation()}
        >
        <h2 className="text-lg font-bold mb-4">Add Task</h2>
        <form action={addTaskAction} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Title</label>
            <input
              name="title"
              type="text"
              className="w-full border p-2 rounded"
              required
              disabled={isPending} />
          </div>

          <div>
            <label className="block text-sm font-medium">Day</label>
            <select name="day" className="w-full border p-2 rounded" disabled={isPending}>
              <option value="">(Optional)</option>
              <option>Monday</option><option>Tuesday</option><option>Wednesday</option>
              <option>Thursday</option><option>Friday</option><option>Saturday</option><option>Sunday</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Date</label>
            <input name="date" type="date" className="w-full border p-2 rounded" disabled={isPending} />
          </div>

          <div className="flex gap-4">
            <div>
              <label className="block text-sm font-medium">Start Time</label>
              <input name="startTime" type="time" className="w-full border p-2 rounded" disabled={isPending} />
            </div>
            <div>
              <label className="block text-sm font-medium">End Time</label>
              <input name="endTime" type="time" className="w-full border p-2 rounded" disabled={isPending} />
            </div>
          </div>

          <label className="flex items-center gap-2">
            <input name="checked" type="checkbox" className="w-4 h-4" disabled={isPending} />
            <span className="text-sm font-medium">Mark as Completed</span>
          </label>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              disabled={isPending}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-accent text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
              disabled={isPending}
            >
              {isPending ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}