import React, { useState } from 'react';
import Task from '@/app/components/Task';
import Routine from './Routine';
import Event from './Event';
import type {
    Task as TaskType,
    Routine as RoutineType,
    Event as EventType
} from '@/app/types.ts';
import { addTask } from '@/app/actions/tasks';
import { editTask } from '@/app/actions/tasks';

interface DayColumnProps {
    dayName: string;
    tasks: TaskType[];
    routines: RoutineType[];
    events: EventType[];
    externalEvents: EventType[];
    showCompleted: boolean;
}


export default function DayColumn({ dayName, tasks, routines, events, externalEvents, showCompleted }: DayColumnProps) {
    const [newTask, setNewTask] = useState('');
    const [selectedDay, setSelectedDay] = useState<string | null>(null);
    // Filter tasks based on completion status
    const filteredTasks = showCompleted
        ? (tasks || []).filter(task => task.checked) // Show only completed tasks
        : (tasks || []).filter(task => !task.checked); // Show only uncompleted tasks
    //adds tasks from the board without opening the modal   
    const handleQuickAddTask = async (day?: string) => {
        const taskDay = day ?? selectedDay;
        if (!newTask.trim()) return;

        const formData = new FormData();
        formData.append('title', newTask.trim());
        if (taskDay) {
            formData.append('day', taskDay);
        }
        try {
            const result = await addTask(formData);
            if (result.task) {
                setNewTask('');
                setSelectedDay(null);
            } else {
                console.error('Failed to add task:', result.error);
            }
        } catch (error) {
            console.error('Error adding task:', error);
        }
    };
    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    };

    const handleDropTask = async (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const payload = event.dataTransfer.getData('application/json');
        if (!payload) return;

        try {
            const { taskId } = JSON.parse(payload);
            const taskToUpdate = tasks.find((t) => t.id === taskId);
            if (!taskToUpdate) return;

            const formData = new FormData();
            formData.append('title', taskToUpdate.title);
            formData.append('day', dayName);

            const result = await editTask(formData, taskId);
            if (!result.success) {
                console.error('Failed to reassign task:', result.error);
            }
        } catch (error) {
            console.error('Error handling drop:', error);
        }
    };

    return (
        <div
            className="column border p-4 sm:w-72 md:w-72 lg:w-80 rounded-lg bg-neutral-200 shadow-md"
            onDragOver={handleDragOver}
            onDrop={handleDropTask}
        >
            <h2 className="text-xl font-bold mb-4">
                {dayName} {showCompleted && '(Completed)'}
            </h2>

            {/* Filter tasks for this day */}
            {filteredTasks
                .filter((task) => task.day === dayName)
                .map((task, taskIndex) => (
                    <Task
                        key={taskIndex}
                        task={task}
                    />
                ))}

            {routines
                .map((routine, routineIndex) => (
                    <Routine
                        key={routineIndex}
                        routine={routine}
                    />
                ))}

            {events
                .map((event, eventIndex) => (
                    <Event
                        key={eventIndex}
                        event={event}
                    />
                ))}

            {externalEvents
                .map((event, eventIndex) => (
                    <Event
                        key={eventIndex}
                        event={event}
                    />
                ))}

            {/* Only show add task input when showing active tasks */}
            {!showCompleted && (
                <div className="flex items-center gap-2 mb-4">
                    <label htmlFor={`quick-add-task-${dayName}`} className="sr-only">
                        Add task for {dayName}
                    </label>
                    <input
                        id={`quick-add-task-${dayName}`}
                        type="text"
                        value={selectedDay === dayName ? newTask : ''}
                        onChange={(e) => {
                            setNewTask(e.target.value);
                            setSelectedDay(dayName);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleQuickAddTask(dayName);
                            }
                        }}
                        placeholder={`Click + to add task on ${dayName}`}
                        className="task border p-2 rounded-lg bg-neutral-100 shadow-sm flex-grow"
                    />
                    <button
                        onClick={() => handleQuickAddTask(dayName)}
                        className="bg-accent text-white px-4 py-2 rounded hover:bg-accent-hover flex-shrink-0"
                    >
                        +
                    </button>
                </div>
            )}
        </div>
    )
}