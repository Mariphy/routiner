'use server'

import { revalidatePath } from 'next/cache';
import { connectToDb } from '../../api/db';
import { getServerSession } from 'next-auth';
import { options } from "@/app/api/auth/[...nextauth]/options";
import type { Task, UserDocument } from '@/app/types';
import { generateUniqueId } from "@/app/utils/helpers";
import { parseISO, isSameDay } from 'date-fns';
//import { getCurrentWeekRange } from '@/app/utils/helpers';

export async function addTask(formData: FormData) {
    try {
        const session = await getServerSession(options);
        if (!session?.user?.email) {
            throw new Error('Not authenticated');
        }

        const task: Task = {
            title: formData.get('title') as string,
            day: formData.get('day') as string || undefined,
            date: formData.get('date') ? new Date(formData.get('date') as string) : undefined,
            startTime: formData.get('startTime') as string || undefined,
            endTime: formData.get('endTime') as string || undefined,
            checked: formData.get('checked') === 'on',
            id: generateUniqueId(),
        };

        if (!task.title) {
            return { success: false, error: "Task title is required" };
        }

        const { db } = await connectToDb();

        const result = await db.collection<UserDocument>("Users").updateOne(
            { email: session.user.email },
            { $push: { tasks: task } }
        );

        if (result.modifiedCount === 0) {
            return { success: false, error: "Failed to add task" };
        };

        revalidatePath('/board');
        return { success: true };
    } catch (error) {
        return {
            success: false,
            error: `Failed to add task: ${error instanceof Error ? error.message : String(error)}`
        };
    }
}

//helpers
function isMongoDate(obj: unknown): obj is { $date: string } {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        '$date' in obj &&
        typeof (obj as { $date: unknown }).$date === 'string'
    );
}

function parsePossibleDate(date: unknown): Date | null {
    if (typeof date === 'string') {
        return new Date(date);
    } else if (isMongoDate(date)) {
        return new Date(date.$date);
    } else if (date instanceof Date) {
        return date;
    }
    return null;
}
function normalizeTask(task: Task) {
    return {
        ...task,
        date: task.date ? parsePossibleDate(task.date) ?? undefined : undefined,
    };
}

export async function getTasks() {
    try {
        const session = await getServerSession(options);
        if (!session?.user?.email) {
            console.error("User not authenticated");
            return [];
        }
        const { db } = await connectToDb();
        const user = await db.collection("Users").findOne({ email: session.user.email });
        if (!user) {
            console.error("User not found");
            return [];
        }
        return user.tasks?.map(normalizeTask) || [];
    } catch (err) {
        console.error("Failed to fetch tasks:", err);
        return [];
    }
}

export async function getTasksByDate(userId: string, date: string) {
    try {
        const session = await getServerSession(options);
        if (!session?.user?.email) {
            console.error("User not authenticated");
            return [];
        }

        const { db } = await connectToDb();
        const user = await db.collection("Users").findOne({ email: session.user.email });

        if (!user) {
            console.error("User not found");
            return [];
        }

        return (user.tasks || [])
            .map(normalizeTask)
            .filter((task: Task) => {
                const taskDate = parsePossibleDate(task.date);
                return taskDate && isSameDay(taskDate, parseISO(date));
            });

    } catch (error) {
        console.error("Failed to fetch tasks by date:", error);
        return [];
    }
}