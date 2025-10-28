import React, { useState } from 'react';
import { CiEdit } from "react-icons/ci";
import EditEvent from '@/app/components/EditEvent';
import type { Event as EventType } from '@/app/types.ts';

interface EventProps {
    event: EventType;
    variant?: 'compact' | 'detailed' | 'external';
}
export default function Event({ event, variant = 'detailed' }: EventProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleEventClick = () => {
        if (variant === 'external') {
            return; 
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };
    
    return (
        <>
            <div className="event relative border p-2 mb-2 rounded-lg bg-green-100 shadow-sm cursor-pointer group"
                onClick={handleEventClick}
            >   
                <div className="flex flex-row">
                    {event.startTime && event.endTime && (
                    <p className="text-sm text-gray-600 p-1 mt-1">
                        {event.startTime} - {event.endTime}
                    </p>
                    )}
                    <h3 className="font-medium p-1">{event.title}</h3>
                </div>
                {variant === 'detailed' && event.date && (
                    <p className="font-light text-sm text-gray-600">
                        Date: {new Date(event.date).toISOString().split('T')[0]}
                    </p>
                )}
                {variant !== 'external' && <div
                    data-testid="edit-button"
                    className="absolute top-2 right-2 text-gray-500 cursor-pointer hidden group-hover:block"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleEventClick();
                    }}
                >
                    <CiEdit />
                </div>}
            </div>
            {isModalOpen && (
                <EditEvent
                    event={event}
                    onClose={closeModal}
                />
            )}

        </>
    );
}