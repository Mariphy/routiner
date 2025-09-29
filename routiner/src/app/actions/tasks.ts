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
    const dateRaw = (formData.get('date') ?? '').toString() || undefined;
    const startTimeRaw = formData.get('startTime')?.toString().trim() || undefined;
    let date;
    //to-do use new Date(day, time)
    if (dateRaw && startTimeRaw) {
      const dateTimeString = `${dateRaw}T${startTimeRaw}:00`;
      date = new Date(dateTimeString);
    }  else if (dateRaw) {
      date = new Date(`${dateRaw}T00:00`);
    }
    const endTimeRaw = formData.get('endTime')?.toString().trim() || undefined;
    const checked = formData.get('checked') === 'on';

    const task: Task = {
      id: generateUniqueId(),
      title: rawTitle,
      day: dayRaw || undefined,
      date: date || undefined,
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

export async function editTask(formData: FormData, id: string) {
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
    const dateRaw = (formData.get('date') ?? '').toString() || undefined;
    const startTimeRaw = formData.get('startTime')?.toString().trim() || undefined;
    let date;
    if (dateRaw && startTimeRaw) {
      const dateTimeString = `${dateRaw}T${startTimeRaw}:00`;
      date = new Date(dateTimeString);
    }  else if (dateRaw) {
      date = new Date(dateRaw + 'T00:00');
    }
    const endTimeRaw = formData.get('endTime')?.toString().trim() || undefined;
    const checked = formData.get('checked') === 'on';

    const task: Task = {
      id: id,
      title: rawTitle,
      day: dayRaw || undefined,
      date: date || undefined,
      startTime: startTimeRaw,
      endTime: endTimeRaw,
      checked,
    };

    const { db } = await connectToDb();
    const result = await db.collection<UserDocument>('users').updateOne(
      { email: session.user.email, "tasks.id": id },
      { $set: {
          "tasks.$.title": rawTitle,
          "tasks.$.day": dayRaw || undefined,
          "tasks.$.date": dateRaw ? new Date(dateRaw) : undefined,
          "tasks.$.startTime": startTimeRaw,
          "tasks.$.endTime": endTimeRaw,
          "tasks.$.checked": checked,
        }
      }
    );

    if (result.modifiedCount === 0) {
      return { success: false, error: 'Failed to edit task' };
    }

    revalidatePath('/board');
    revalidatePath('/calendar');
    return { success: true, task };
  } catch (e) {
    console.error('editTask error:', e);
    return { success: false, error: 'Internal error' };
  }
};

export async function deleteTask(id: string) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
          return { success: false, error: 'Unauthenticated' };
        }

        const { db } = await connectToDb();
        const result = await db.collection<UserDocument>('users').updateOne(
          { email: session.user.email },
          { $pull: { tasks: { id } } }
        );

        if (result.modifiedCount === 0) {
          return { success: false, error: 'Failed to delete task' };
        }

        revalidatePath('/board');
        revalidatePath('/calendar');
        return { success: true };
    } catch (e) {
        console.error('deleteTask error:', e);
        return { success: false, error: 'Internal error' };
    }
}