'use server'

import { revalidatePath } from 'next/cache';
import { connectToDb } from '@/app/api/db';
import type { Routine, UserDocument } from '@/app/types';
import { generateUniqueId } from '@/app/lib/helpers';
import { auth } from "@/auth";

export async function addRoutine(formData: FormData) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            console.error("User not authenticated");
            return { success: false, error: "User not authenticated" };
        }

        const rawTitle = (formData.get('title') ?? '').toString().trim();
        if (!rawTitle) {
            return { success: false, error: 'Task title is required' };
        }

        const routine: Routine = {
            id: generateUniqueId(),
            title: rawTitle,
            daily: formData.get("daily") === "on",
            repeat: formData.get("repeat") ? (formData.get("repeat") as string).split(",") : [],
            startTime: formData.get("startTime") as string,
            endTime: formData.get("endTime") as string,
        };

        const { db } = await connectToDb();
        const result = await db.collection<UserDocument>('users').updateOne(
            { email: session.user.email },
            { $push: { routines: routine } }
        );

        if (result.modifiedCount === 0) {
            return { success: false, error: "Failed to add routine" };
        }
        revalidatePath('/board');
        revalidatePath('/calendar');
        return { success: true, routine };
    } catch (error) {
        console.error('addRoutine error:', error);
        return { success: false, error: 'Internal error' };
    }
};

export async function editRoutine(formData: FormData, id: string) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return { success: false, error: 'Unauthenticated' };
    }

    const updateFields: Record<string, string | boolean | string[] | Record<string, boolean> | number | undefined> = {};
    
    const titleEntry = formData.get('title');
    if (titleEntry !== null) {
      const rawTitle = titleEntry.toString().trim();
      if (!rawTitle) {
        return { success: false, error: 'Routine title is required' };
      }
      updateFields["routines.$.title"] = rawTitle;
    }

    if (formData.has('daily')) {
      updateFields["routines.$.daily"] = formData.get("daily") === "on";
    }
    if (formData.has('repeat')) {
      updateFields["routines.$.repeat"] = formData.get("repeat") ? (formData.get("repeat") as string).split(",") : [];
    }
    if (formData.has('startTime')) {
      updateFields["routines.$.startTime"] = formData.get("startTime") as string;
    }
    if (formData.has('endTime')) {
      updateFields["routines.$.endTime"] = formData.get("endTime") as string;
    }
    if (formData.has('checkedDays')) {
      const checkedDaysStr = formData.get("checkedDays") as string;
      try {
        const checkedDays = JSON.parse(checkedDaysStr);
        updateFields["routines.$.checkedDays"] = checkedDays;
      } catch (e) {
        console.error('Failed to parse checkedDays:', e);
      }
    }
    if (formData.has('completionCount')) {
      const completionCountStr = formData.get("completionCount") as string;
      updateFields["routines.$.completionCount"] = parseInt(completionCountStr, 10);
    }

    if (!Object.keys(updateFields).length) {
      return { success: false, error: 'No fields to update' };
    }

    const { db } = await connectToDb();
    const result = await db.collection<UserDocument>('users').updateOne(
      { email: session.user.email, "routines.id": id },
      { $set: updateFields }
    );

    if (result.modifiedCount === 0) {
      return { success: false, error: 'Failed to edit routine' };
    }

    revalidatePath('/board');
    revalidatePath('/calendar');
    return { success: true };
  } catch (e) {
    console.error('editRoutine error:', e);
    return { success: false, error: 'Internal error' };
  }
};

export async function deleteRoutine(id: string) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
          return { success: false, error: 'Unauthenticated' };
        }

        const { db } = await connectToDb();
        const result = await db.collection<UserDocument>('users').updateOne(
          { email: session.user.email },
          { $pull: { routines: { id } } }
        );

        if (result.modifiedCount === 0) {
          return { success: false, error: 'Failed to delete routine' };
        }

        revalidatePath('/board');
        revalidatePath('/calendar');
        return { success: true };
    } catch (e) {
        console.error('deleteRoutine error:', e);
        return { success: false, error: 'Internal error' };
    }
}