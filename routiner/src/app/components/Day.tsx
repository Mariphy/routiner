"use client";
import React from 'react';
import type { Event as EventType } from '@/app/types';
import Event from "@/app/components/Event";

interface DayProps {
    userId: string;
    selectedDate: Date;
    events: EventType[];
}

export default function Day({ userId, selectedDate, events }: DayProps) {
    
    return (
        <div className='pb-10'>
            <h2 className="text-2xl font-bold mb-4 text-center">Shedule for the day</h2>
            {events.map(event => (
                <Event key={event.id} event={event} variant="compact" />
            ))}
        </div>
    )
}