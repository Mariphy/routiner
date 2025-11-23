import React, { useState } from "react";
import Task from '@/app/components/Task';
import type { Task as TaskType } from '@/app/types.ts';
import { addTask } from "@/app/actions/tasks";
import { editTask } from "@/app/actions/tasks";

interface TaskListColumnProps {
    tasks: TaskType[];
    showCompleted: boolean;
}

export default function TaskListColumn({ tasks, showCompleted }: TaskListColumnProps) {
    const [newTask, setNewTask] = useState('');

    const handleQuickAddTask = async () => {
        if (!newTask.trim()) return;
        const formData = new FormData();
        formData.append('title', newTask.trim());
        try {
          const result = await addTask(formData);
          if (result.task) {
            setNewTask('');
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
            formData.append('day', '');

            if (taskToUpdate.date instanceof Date) {
                formData.append('date', taskToUpdate.date.toISOString());
            } else if (taskToUpdate.date) {
                formData.append('date', taskToUpdate.date);
            }
            if (taskToUpdate.startTime) formData.append('startTime', taskToUpdate.startTime);
            if (taskToUpdate.endTime) formData.append('endTime', taskToUpdate.endTime);

            const result = await editTask(formData, taskId);
            if (!result.success) {
                console.error('Failed to remove task day:', result.error);
            }
        } catch (error) {
            console.error('Error handling drop:', error);
        }
    };

    // Filter tasks based on completion status
    const filteredTasks = showCompleted
        ? (tasks || []).filter(task => task.checked) // Show only completed tasks
        : (tasks || []).filter(task => !task.checked); // Show only uncompleted tasks
    return (
        <div className="column border p-4 sm:w-72 md:w-72 lg:w-80 flex-shrink-0 rounded-lg bg-neutral-200 shadow-md"
            onDragOver={handleDragOver}
            onDrop={handleDropTask}
        >
            <h2 className="text-xl font-bold mb-4">
                Task List {showCompleted && '(Completed)'}
            </h2>
            {filteredTasks.map((task) => (
                <Task
                    key={task.id}
                    task={task}
                />
            ))}

            {/* Only show add task input when showing active tasks */}
            {!showCompleted && (
                <div className="flex items-center gap-2 mb-4">
                    <label htmlFor="quick-add-task" className="sr-only">
                        Add new task
                    </label>
                    <input
                        id="quick-add-task"
                        type="text"
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleQuickAddTask();
                            }
                        }}
                        placeholder="Click + to add a new task"
                        className="task border p-2 rounded-lg bg-neutral-100 shadow-sm flex-grow"
                    />
                    <button
                        onClick={() => handleQuickAddTask()}
                        className="bg-accent text-white px-4 py-2 rounded hover:bg-accent-hover"
                    >
                        +
                    </button>
                </div>
            )}
        </div>
    );
}
