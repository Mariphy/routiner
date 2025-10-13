'use client';
import React, { useState, useTransition } from 'react';
import { editRoutine, deleteRoutine } from '@/app/actions/routines';
import type { Routine as RoutineType } from '@/app/types.ts';
import Select from 'react-select';

interface EditRoutineProps {
    routine: RoutineType;
    onClose: () => void;
}

export default function EditRoutine({ routine, onClose }: EditRoutineProps) {
    const [isPending, startTransition] = useTransition();
    const [daily, setDaily] = useState(routine.daily || false);
    const [repeat, setRepeat] = useState(routine.repeat || []);

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
            setRepeat(repeatOptions.map(option => option.value));
        }
    };

    const editRoutineAction = async (formData: FormData) => {
        startTransition(async () => {
            const res = await editRoutine(formData, routine.id);
            if (res.success) {
                onClose();
            } else {
                console.error('Failed to edit routine:', res.error);
            }
        });
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this routine?')) {
            startTransition(async () => {
                const res = await deleteRoutine(routine.id);
                if (res.success) {
                    onClose();
                } else {
                    console.error('Failed to delete routine:', res.error);
                }
            });
        }
    }; 

    // Convert repeat array to Select format
    const selectedDays = repeat.map(day => ({ value: day, label: day }));

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div className="bg-white p-6 m-2 rounded-lg shadow-lg w-full max-w-lg"
                 onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-xl font-bold mb-4">Edit Routine</h2>
                <form action={editRoutineAction} className="flex flex-col gap-4">
                    <label htmlFor="edit-routine-title" className="block text-sm font-medium">
                        Title
                    </label>
                    <input
                        id="edit-routine-title"
                        type="text"
                        name="title"
                        defaultValue={routine.title}
                        className="border p-2 rounded"
                        required
                    />
                
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="daily"
                            className="form-checkbox"
                            checked={daily}
                            onChange={handleDailyChange}
                        />
                        <span>Repeat Daily</span>
                    </label>

                    <label htmlFor="edit-routine-repeat-days" className="block text-sm font-medium">
                        Or choose which days of week to repeat:
                    </label>
                    <Select
                        inputId="edit-routine-repeat-days"
                        value={selectedDays}
                        onChange={(selected) => setRepeat(selected?.map(option => option.value) || [])}
                        isMulti
                        options={repeatOptions}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        isDisabled={daily}
                    />

                    {/* Hidden input to pass repeat data to form */}
                    <input
                        type="hidden"
                        name="repeat"
                        value={repeat.join(',')}
                    />

                    <label htmlFor="edit-routine-start-time" className="block text-sm font-medium">
                        Start Time
                    </label>
                    <input
                        id="edit-routine-start-time"
                        type="time"
                        name="startTime"
                        defaultValue={routine.startTime}
                        className="border p-2 rounded"
                    />
                    <label htmlFor="edit-routine-end-time" className="block text-sm font-medium">
                        End Time
                    </label>
                    <input
                        id="edit-routine-end-time"
                        type="time"
                        name="endTime"
                        defaultValue={routine.endTime}
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
                <div>
                    <button
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        onClick={handleDelete}
                        disabled={isPending}
                    >
                        {isPending ? 'Deleting...' : 'Delete'}
                    </button>
                </div>
            </div >
        </div >
    );
}