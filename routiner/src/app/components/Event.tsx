import React, { useState } from 'react';
import { CiEdit } from "react-icons/ci";
import EditEvent from '@/app/components/EditEvent';
import type { Event as EventType } from '@/app/types.ts';

interface EventProps {
    event: EventType;
}
export default function Event({ event }: EventProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleEventClick = () => {
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
                <h3 className="font-medium">{event.title}</h3>
                {event.date && (
                    <p className="font-light text-sm text-gray-600">
                        Date: {event.date instanceof Date ? event.date.toLocaleDateString() : new Date(event.date).toLocaleDateString()}
                    </p>
                )}
                {event.startTime && event.endTime && (
                    <p className="text-sm text-gray-600">
                        {event.startTime} - {event.endTime}
                    </p>
                )}
                <div
                    data-testid="edit-button"
                    className="absolute top-2 right-2 text-gray-500 cursor-pointer hidden group-hover:block"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleEventClick();
                    }}
                >
                    <CiEdit />
                </div>
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