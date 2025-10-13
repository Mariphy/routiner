"use client";
import React from 'react';
import type { Event as EventType, Task as TaskType } from '@/app/types';
import Event from "@/app/components/Event";
import Task from "@/app/components/Task";


interface DayProps {
    userId: string;
    selectedDate: Date;
    events: EventType[];
    tasks: TaskType[];
}

export default function Day({ userId, selectedDate, events, tasks }: DayProps) { 
    return (
        <div className='pb-10'>
            <h2 className="text-2xl font-bold mb-4 text-center">Shedule for the day</h2>
            {events.map(event => (
                <Event key={event.id} event={event} variant="compact" />
            ))}
            {tasks.map(task => (
                <Task key={task.id} task={task} />
            ))}
        </div>
    )
}