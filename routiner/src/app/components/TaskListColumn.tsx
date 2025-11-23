import React, { useState } from "react";
import Task from '@/app/components/Task';
import type { Task as TaskType } from '@/app/types.ts';
import { addTask } from "@/app/actions/tasks";

interface TaskListColumnProps {
    tasks: TaskType[];
    showCompleted: boolean;
    onQuickAddTask: (taskTitle: string) => Promise<void>;
}

export default function TaskListColumn({ tasks, showCompleted, onQuickAddTask }: TaskListColumnProps) {
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
    // Filter tasks based on completion status
    const filteredTasks = showCompleted
        ? (tasks || []).filter(task => task.checked) // Show only completed tasks
        : (tasks || []).filter(task => !task.checked); // Show only uncompleted tasks
    return (
        <div className="column border p-4 sm:w-72 md:w-72 lg:w-80 flex-shrink-0 rounded-lg bg-neutral-200 shadow-md" draggable="true">
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
