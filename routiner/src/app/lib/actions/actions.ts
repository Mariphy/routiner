'use server'

import { revalidatePath } from 'next/cache';
import { connectToDb } from '../../api/db';
import { getServerSession } from 'next-auth';
import { options } from "@/app/api/auth/[...nextauth]/options";
import type { Task, UserDocument } from '@/app/types';
import { generateUniqueId } from "@/app/utils/helpers";

//user id
export async function fetchUserId() {
    const session = await getServerSession(options);
    if (!session?.user?.email) {
        throw new Error("Unauthorized"); // or return null
    }

    const { db } = await connectToDb();
    const user = await db.collection("Users").findOne({ email: session.user.email });

    if (!user) {
        throw new Error("User not found");
    }

    return user._id.toString();
}

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

