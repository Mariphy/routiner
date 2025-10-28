"use server";

import { revalidatePath } from 'next/cache';
import { connectToDb } from '@/app/api/db';
import { auth } from "@/auth";

export async function addImportLink(formData: FormData) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return { success: false, error: 'Unauthenticated' };
    }

    const { db } = await connectToDb();
    const result = await db.collection('users').updateOne(
      { email: session.user.email },
      { $set: { importLink: formData.get('importURL') } }
    );

    if (result.modifiedCount === 0) {
      return { success: false, error: 'Failed to add import link' };
    }

    revalidatePath('/settings');
    return { success: true };
  } catch (error) {
    console.error('addImportLink error:', error);
    return { success: false, error: 'Internal error' };
  }
};
