'use server'

import { revalidatePath } from 'next/cache';
import { connectToDb } from '@/app/api/db';
import type { Task, UserDocument } from '@/app/types';
import { generateUniqueId } from '@/app/utils/helpers';
import { auth } from "@/auth";

export async function addTask(formData: FormData) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return { success: false, error: 'Unauthenticated' };
    }

    const rawTitle = (formData.get('title') ?? '').toString().trim();
    if (!rawTitle) {
      return { success: false, error: 'Task title is required' };
    }

    const dayRaw = (formData.get('day') ?? '').toString().trim();
    const dateRaw = formData.get('date')?.toString();
    const startTimeRaw = formData.get('startTime')?.toString().trim() || undefined;
    const endTimeRaw = formData.get('endTime')?.toString().trim() || undefined;
    const checked = formData.get('checked') === 'on';

    const task: Task = {
      id: generateUniqueId(),
      title: rawTitle,
      day: dayRaw || undefined,
      date: dateRaw ? new Date(dateRaw) : undefined,
      startTime: startTimeRaw,
      endTime: endTimeRaw,
      checked,
    };

    const { db } = await connectToDb();
    const result = await db.collection<UserDocument>('users').updateOne(
      { email: session.user.email },
      { $push: { tasks: task } }
    );

    if (result.modifiedCount === 0) {
      return { success: false, error: 'Failed to add task' };
    }

    revalidatePath('/board');
    revalidatePath('/calendar');
    return { success: true, task };
  } catch (e) {
    console.error('addTask error:', e);
    return { success: false, error: 'Internal error' };
  }
}