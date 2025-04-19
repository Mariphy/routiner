import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { connectToDb } from "../db";

export async function GET() {
    try {
        const session = await getServerSession(options);
        if (!session?.user?.email) {
          return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
          });
        }
    
        const { db } = await connectToDb();
        const user = await db.collection("Users").findOne({ email: session.user.email });
    
        if (!user) {
          return new Response(JSON.stringify({ error: "User not found" }), {
            status: 404,
            headers: { "Content-Type": "application/json" },
          });
        }
    
        return new Response(JSON.stringify({ tasks: user.tasks || [] }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
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
        const session = await getServerSession(options);
        if (!session?.user?.email) {
          return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
          });
        }
    
        const { db } = await connectToDb();
        const { task } = await req.json();
    
        if (!task) {
          return new Response(JSON.stringify({ error: "Task is required" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }
    
        const result = await db.collection("Users").updateOne(
          { email: session.user.email },
          { $push: { tasks: task } }
        );
    
        if (result.modifiedCount === 0) {
          return new Response(JSON.stringify({ error: "Failed to add task" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
    
        return new Response(JSON.stringify({ message: "Task added successfully" }), {
          status: 201,
          headers: { "Content-Type": "application/json" },
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