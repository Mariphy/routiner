'use client';
import React, { useState } from 'react';
import AddTask from './AddTask';
import AddEvent from './AddEvent';
import AddRoutine from './AddRoutine';

export default function AddButton() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentForm, setCurrentForm] = useState<'task' | 'event' | 'routine' | null>(null);
    

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
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    onClick={() => setIsModalOpen(false)}
                >
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
                    onClose={() => {
                        setCurrentForm(null);
                        setIsModalOpen(false);
                    }} 
                />
            )}
            {currentForm === 'event' && (
                <AddEvent 
                    onClose={() => {
                        setCurrentForm(null);
                        setIsModalOpen(false);
                    }} 
                />
            )}
            {currentForm === 'routine' && (
                <AddRoutine 
                    onClose={() => {
                        setCurrentForm(null);
                        setIsModalOpen(false);
                    }} 
                />
            )}
        </div>
    );
}