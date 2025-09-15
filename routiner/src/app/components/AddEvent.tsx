"use client";
import React, { useTransition } from 'react';
import { addEvent } from "@/app/lib/actions/events";

interface AddEventProps { 
  onClose: () => void;
}  

export default function AddEvent( { onClose }: AddEventProps) {
  const [isPending, startTransition] = useTransition();

  const now = new Date();
  const currentHour = now.getHours().toString().padStart(2, '0');
  const nextHour = ((now.getHours() + 1) % 24).toString().padStart(2, '0');
  const currentTime = `${currentHour}:00`;
  const oneHourLater = `${nextHour}:00`;
  const todayDate = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;

  const addEventAction = async (formData: FormData) => {
    startTransition(async () => {
      const res = await addEvent(formData);
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
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-bold mb-4">Add Event</h2>
        <form action={addEventAction} className="flex flex-col gap-4">
          <input
            type="text"
            name="title"
            placeholder="Event Title"
            className="border p-2 rounded"
            required
          />
          <input
            type="date"
            name="date"
            defaultValue={todayDate}
            className="border p-2 rounded"
            required
          />
          <input
            type="time"
            name="startTime"
            defaultValue={currentTime}
            className="border p-2 rounded"
            required
          />
          <input
            type="time"
            name="endTime"
            defaultValue={oneHourLater}
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
              disabled={isPending}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              {isPending ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}