'use client'
import React from 'react';
import { addTask } from '@/app/lib/actions/actions';


interface AddTaskProps {
  onClose: () => void;
}

export default function AddTask({ onClose }: AddTaskProps) {
  const postForm = (formData: FormData) => {
    const newTask = {
      title: formData.get("title") as string,
      day: formData.get("day") as string,
      date: formData.get("date") ? new Date(formData.get("date") as string) : undefined,
      startTime: formData.get("startTime") as string,
      endTime: formData.get("endTime") as string,
      checked: formData.get("checked") === "on"
    };
    addTask(newTask as unknown as FormData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-bold mb-4">Add Task</h2>
        <form action={postForm} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Title</label>
            <input
              name="title"
              type="text"
          
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Day</label>
            <select
              name="day"
           
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
              name="date"
              type="date"
             
              className="w-full border p-2 rounded"
            />
          </div>
          <div className="flex gap-4">
            <div>
              <label className="block text-sm font-medium">Start Time</label>
              <input
                name="startTime"
                type="time"
             
                className="w-full border p-2 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">End Time</label>
              <input
                name="endTime"
                type="time"
               
                className="w-full border p-2 rounded"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              name="checked"
              type="checkbox"
     
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
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};