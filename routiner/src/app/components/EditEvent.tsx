"use client";
import React, { useTransition } from 'react';
import { editEvent, deleteEvent } from "@/app/lib/actions/events";
import type { Event as EventType } from '@/app/types.ts';

interface EditEventProps {
    event: EventType;
    onClose: () => void;
}

export default function EditEvent({ event, onClose }: EditEventProps) {
    const [isPending, startTransition] = useTransition();

    const now = new Date();
    const currentHour = now.getHours().toString().padStart(2, '0');
    const nextHour = ((now.getHours() + 1) % 24).toString().padStart(2, '0');
    const currentTime = `${currentHour}:00`;
    const oneHourLater = `${nextHour}:00`;
    const todayDate = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;

    const editEventAction = async (formData: FormData) => {
        startTransition(async () => {
            const res = await editEvent(formData);
            if (res.success) {
                onClose();
            } else {
                console.error(res.error);
            }
        });
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this task?')) {

            startTransition(async () => {
                const res = await deleteEvent(event.id);
                if (res.success) {
                    onClose();
                } else {
                    console.error('Failed to delete event:', res.error);
                }
            });
        }
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
                <h2 className="text-lg font-bold mb-4">Edit Event</h2>
                <form action={editEventAction} className="flex flex-col gap-4">
                    <input type="hidden" name="id" value={event.id} />
                    <input
                        type="text"
                        name="title"
                        defaultValue={event.title}
                        className="border p-2 rounded"
                        required
                    />
                    <input
                        type="date"
                        name="date"
                        defaultValue={event.date ? new Date(event.date).toISOString().split('T')[0] : todayDate}
                        className="border p-2 rounded"
                        required
                    />
                    <input
                        type="time"
                        name="startTime"
                        defaultValue={event.startTime || currentTime}
                        className="border p-2 rounded"
                        required
                    />
                    <input
                        type="time"
                        name="endTime"
                        defaultValue={event.endTime || oneHourLater}
                        className="border p-2 rounded"
                        required
                    />
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
                            className="bg-accent text-white px-4 py-2 rounded hover:bg-blue-600"
                            disabled={isPending}
                        >
                            {isPending ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
                <div>
                    <button
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        onClick={handleDelete}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}