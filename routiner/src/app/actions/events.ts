"use server";

import { revalidatePath } from 'next/cache';
import { connectToDb } from '@/app/api/db';
import type { Event, UserDocument } from '@/app/types';
import { generateUniqueId } from '@/app/utils/helpers';
import { auth } from "@/auth";

export async function addEvent(formData: FormData) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return { success: false, error: 'Unauthenticated' };
    }

    const rawTitle = (formData.get('title') ?? '').toString().trim();
    if (!rawTitle) {
      return { success: false, error: 'Task title is required' };
    }
    const dateRaw = (formData.get('date') ?? '').toString();
    if (!dateRaw) {
      return { success: false, error: 'Event date is required' };
    }
    const startTimeRaw = (formData.get('startTime') ?? '').toString();
    if (!startTimeRaw) {
      return { success: false, error: 'Start time is required' };
    }
    const dateTimeString = `${dateRaw}T${startTimeRaw}:00`;
    const date = new Date(dateTimeString);

    const event: Event = {
      id: generateUniqueId(),
      title: rawTitle,
      date: date,
      startTime: startTimeRaw,
      endTime: formData.get('endTime') as string,
    };

    const { db } = await connectToDb();
    const result = await db.collection<UserDocument>('users').updateOne(
      { email: session.user.email },
      { $push: { events: event } }
    );

    if (result.modifiedCount === 0) {
      return { success: false, error: 'Failed to add event' };
    }

    revalidatePath('/board');
    revalidatePath('/calendar');
    return { success: true, event };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Internal error' };
  }
};

export async function editEvent(formData: FormData) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return { success: false, error: 'Unauthenticated' };
    }
    const rawTitle = (formData.get('title') ?? '').toString().trim();
    if (!rawTitle) {
      return { success: false, error: 'Task title is required' };
    }
    const dateRaw = (formData.get('date') ?? '').toString();
    if (!dateRaw) {
      return { success: false, error: 'Event date is required' };
    }
    const startTimeRaw = (formData.get('startTime') ?? '').toString();
    if (!startTimeRaw) {
      return { success: false, error: 'Start time is required' };
    }
    const dateTimeString = `${dateRaw}T${startTimeRaw}:00`;
    const date = new Date(dateTimeString);

    const event: Event = {
      id: (formData.get('id') ?? '').toString(),
      title: rawTitle,
      date: date,
      startTime: startTimeRaw,
      endTime: formData.get('endTime') as string,
    };

    const { db } = await connectToDb();
    const result = await db.collection<UserDocument>('users').updateOne(
      { email: session.user.email, "events.id": event.id },
      {
        $set: {
          "events.$.title": event.title,
          "events.$.date": event.date,
          "events.$.startTime": event.startTime,
          "events.$.endTime": event.endTime,
        }
      }
    );
    if (result.modifiedCount === 0) {
      return { success: false, error: 'Failed to edit event' };
    }
    revalidatePath('/board');
    revalidatePath('/calendar');
    return { success: true, event };
  } catch (error) {
    console.error('editEvent error:', error);
    return { success: false, error: 'Internal error' };
  }
};

export async function deleteEvent(id: string) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return { success: false, error: 'Unauthenticated' };
    }

    const { db } = await connectToDb();
    const result = await db.collection<UserDocument>('users').updateOne(
      { email: session.user.email, "events.id": id },
      { $pull: { events: { id } } }
    );

    if (result.modifiedCount === 0) {
      return { success: false, error: 'Failed to delete event' };
    }

    revalidatePath('/board');
    revalidatePath('/calendar');
    return { success: true };
  } catch (error) {
    console.error('deleteEvent error:', error);
    return { success: false, error: 'Internal error' };
  }
};
