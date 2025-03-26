import { connectToDb } from "../db";
import { ObjectId } from "mongodb";

export async function GET() {
    try {
        const { db } = await connectToDb();
        const user = await db.collection("Users").findOne({
            _id: new ObjectId("678d355afa0c718c79b59091")
        });

        if (!user) {
            console.error("User not found");
            return new Response(JSON.stringify({ error: "User not found" }), {
                status: 404,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

        return new Response(JSON.stringify({ tasks: user.tasks }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error("Error fetching user:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}

export async function POST(req: Request) {
    try {
        const { db } = await connectToDb();
        const { task } = await req.json();

        if (!task) {
            return new Response(JSON.stringify({ error: "Task is required" }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

        const result = await db.collection("Users").updateOne(
            { _id: new ObjectId("678d355afa0c718c79b59091") },
            { $push: { tasks: task } }
        );

        if (result.modifiedCount === 0) {
            return new Response(JSON.stringify({ error: "Failed to add task" }), {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

        return new Response(JSON.stringify({ message: "Task added successfully" }), {
            status: 201,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error("Error adding task:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}