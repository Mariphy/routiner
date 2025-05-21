import React, { useState } from 'react';
import AddTask from './AddTask';
import AddEvent from './AddEvent';
import AddRoutine from './AddRoutine';

export interface Task {
    title: string; 
    id: string;
    day?: string;
    date?: Date;
    startTime?: string;
    endTime?: string;
    checked: boolean;
}

export type TaskInput = Omit<Task, 'id'>;

export interface Event {
    title: string;
    id: string;
    day?: string;
    description?: string;
    location?: string;
    url?: string;
    date?: Date;
    startTime?: string;
    endTime?: string;
    repeat?: string;
}

export type EventInput = Omit<Event, 'id'>;

export interface Routine {
    title: string;
    id: string;
    day?: string;
    date?: Date;
    startTime?: string;
    endTime?: string;
    subissue?: string;
    repeat?: string; 
}

export type RoutineInput = Omit<Routine, 'id'>;

interface AddButtonProps {
    onTaskAdded: (task: TaskInput) => void;
    onEventAdded: (event: EventInput) => void;
    onRoutineAdded: (routine: RoutineInput) => void;
}    

export default function AddButton({ onTaskAdded, onEventAdded, onRoutineAdded }: AddButtonProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentForm, setCurrentForm] = useState<'task' | 'event' | 'routine' | null>(null);

    const handleSaveTask = (task: TaskInput) => {
        onTaskAdded(task); // Pass the task data to the parent
        setCurrentForm(null); // Close the modal
    };

    const handleSaveEvent = (event: EventInput) => {
        onEventAdded(event); // Pass the event data to the parent
        setCurrentForm(null); // Close the modal
    };

    const handleSaveRoutine = (routine: RoutineInput) => {
        onRoutineAdded(routine); // Pass the routine data to the parent
        setCurrentForm(null); // Close the modal
    };

    return (
        <div>
            {/* Floating "+" Button */}
            <button
                onClick={() => setIsModalOpen(true)}
                className="fixed bottom-4 right-4 bg-accent text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg hover:bg-accent-hover"
            >
                +
            </button>

            {/* Modal */}
            {isModalOpen && !currentForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                        <h2 className="text-lg font-bold mb-4">Add New</h2>
                        <div className="flex flex-col gap-4">
                            <button
                                onClick={() => {
                                    setIsModalOpen(false);
                                    setCurrentForm('task');
                                }}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                Task
                            </button>
                            <button
                                onClick={() => {
                                    setIsModalOpen(false);
                                    setCurrentForm('event');
                                }}
                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                            >
                                Event
                            </button>
                            <button
                                onClick={() => {
                                    setIsModalOpen(false);
                                    setCurrentForm('routine');
                                }}
                                className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
                            >
                                Routine
                            </button>
                        </div>
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="mt-4 text-gray-500 hover:underline"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
            {currentForm === 'task' && (
                <AddTask 
                    onSave={handleSaveTask}
                    onClose={() => setCurrentForm(null)}
                />
            )}
            {currentForm === 'event' && (
                <AddEvent 
                    onSave={handleSaveEvent}
                    onClose={() => setCurrentForm(null)}
                />
            )}
            {currentForm === 'routine' && (
                <AddRoutine 
                    onSave={handleSaveRoutine}
                    onClose={() => setCurrentForm(null)}
                />
            )}
        </div>
    );
}