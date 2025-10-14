"use client";
import React from 'react';
import type { Event as EventType, Task as TaskType, Routine as RoutineType } from '@/app/types';
import Event from "@/app/components/Event";
import Task from "@/app/components/Task";
import Routine from '@/app/components/Routine';


interface DayProps {
    selectedDate: Date;
    events: EventType[];
    tasks: TaskType[];
    routines: RoutineType[];
    externalEvents: EventType[];
}

export default function Day({ selectedDate, events, tasks, routines, externalEvents }: DayProps) { 
    return (
        <div className='pb-10'>
            {selectedDate.toISOString().slice(0, 10)}
            <h2 className="text-2xl font-bold mb-4 text-center">Shedule for the day</h2>
            {routines.map(routine => (
                <Routine key={routine.id} routine={routine} />
            ))}
            {tasks.map(task => (
                <Task key={task.id} task={task} />
            ))}
            {events.map(event => (
                <Event key={event.id} event={event} variant="compact" />
            ))}
            {externalEvents.map(event => (
                <Event key={event.id} event= {event} variant="compact"/>
            ))}
        </div>
    )
}