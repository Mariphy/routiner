"use client";
import React, { useState, useEffect } from 'react';
import type { Event as EventType, Task as TaskType } from '@/app/types';
import Event from "@/app/components/Event";
import Task from "@/app/components/Task";
import { getTasksByDate } from '@/app/lib/api';

interface DayProps {
    userId: string;
    selectedDate: Date;
    events: EventType[];
}

export default function Day({ userId, selectedDate, events }: DayProps) {
    const [tasks, setTasks] = useState<TaskType[]>([]);
    
    useEffect(() => {
        async function fetchData() {
            try {
                const dateString = selectedDate.toISOString().split('T')[0];
                const fetchedTasks = await getTasksByDate(userId, dateString);
                setTasks(fetchedTasks);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        fetchData();
    }, [selectedDate, userId]);

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