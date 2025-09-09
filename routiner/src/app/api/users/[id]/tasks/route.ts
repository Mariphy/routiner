import { auth } from "@/auth";
import { connectToDb } from "@/app/api/db";
import { generateUniqueId } from "@/app/utils/helpers";
import type { Task } from '@/app/types';

interface UserDocument {
  _id: string;
  name: string;
  email: string;
  password: string;
  routines: string[];
  events: string[];
  tasks: Task[];
}

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user?.email) {
          return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
          });
        }
    
        const { db } = await connectToDb();
        const user = await db.collection("users").findOne({ email: session.user.email });
    
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
};

export async function POST(req: Request) {
    try {
        const session = await auth();
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

        const taskWithId = {
          ...task,
          id: generateUniqueId(),
          date: task.date ? new Date(task.date) : undefined,
        };
    
        const result = await db.collection("users").updateOne(
          { email: session.user.email },
          { $push: { tasks: taskWithId } }
        );
    
        if (result.modifiedCount === 0) {
          return new Response(JSON.stringify({ error: "Failed to add task" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
    
        return new Response(JSON.stringify({ task: taskWithId }), {
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
};

export async function PUT(req: Request) {
    try {
        const session = await auth();
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

        const updatedTask = {
          ...task,
          date: task.date ? new Date(task.date) : undefined,
        };
    
        const result = await db.collection("users").updateOne(
          { email: session.user.email, "tasks.id": task.id },
          { $set: { "tasks.$": updatedTask } }
        );
    
        if (result.modifiedCount === 0) {
          return new Response(JSON.stringify({ error: "Failed to update task" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
    
        return new Response(JSON.stringify({ task: updatedTask }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error updating task:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
};
export async function DELETE(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
          return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
          });
        }
    
        const { db } = await connectToDb();
        const { id } = await req.json();
    
        if (!id) {
          return new Response(JSON.stringify({ error: "Task is required" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }
    
        const result = await db.collection<UserDocument>("users").updateOne(
          { email: session.user.email, "tasks.id": id },
          { $pull: { tasks: { id: id } } }
        );
    
        if (result.modifiedCount === 0) {
          return new Response(JSON.stringify({ error: "Failed to delete task" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
    
        return new Response(JSON.stringify({ message: "Task deleted successfully" }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error deleting task:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}