import { connectToDb } from "../db";

export async function GET() {
    const { db } = await connectToDb();
    const routines = await db.collection('routines').find({}).toArray();

    return new Response(JSON.stringify(routines), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}