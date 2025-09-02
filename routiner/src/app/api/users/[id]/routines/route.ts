import { auth } from "@/auth";
import { connectToDb } from "@/app/api/db";
import { generateUniqueId } from "@/app/utils/helpers";
import type { Routine } from "@/app/types.ts";

  interface UserDocument {
    _id: string;
    name: string;
    email: string;
    password: string;
    routines: Routine[];
    events: string[];
    tasks: string[];
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
        const user = await db.collection("Users").findOne({ email: session.user.email });
    
        if (!user) {
          return new Response(JSON.stringify({ error: "User not found" }), {
            status: 404,
            headers: { "Content-Type": "application/json" },
          });
        }
    
        return new Response(JSON.stringify({ routines: user.routines || [] }), {
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
        const { routine } = await req.json();
    
        if (!routine) {
          return new Response(JSON.stringify({ error: "Routine is required" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }

        const routineWithId = {
          ...routine,
          id: generateUniqueId(),
        };
    
        const result = await db.collection("Users").updateOne(
          { email: session.user.email },
          { $push: { routines: routineWithId } }
        );
    
        if (result.modifiedCount === 0) {
          return new Response(JSON.stringify({ error: "Failed to add routine" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
    
        return new Response(JSON.stringify({ routine: routineWithId }), {
          status: 201,
          headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error adding routine:", error);
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
        const { routine } = await req.json();
    
        if (!routine) {
          return new Response(JSON.stringify({ error: "Routine is required" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }

        const updatedRoutine = {
          ...routine,
        };
    
        const result = await db.collection("Users").updateOne(
          { email: session.user.email, "routines.id": routine.id },
          { $set: { "routines.$": updatedRoutine } }
        );
    
        if (result.modifiedCount === 0) {
          return new Response(JSON.stringify({ error: "Failed to update routine" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
    
        return new Response(JSON.stringify({ updatedRoutine }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error updating routine:", error);
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
        const { routine } = await req.json();
    
        if (!routine) {
          return new Response(JSON.stringify({ error: "Routine is required" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }
    
        const result = await db.collection<UserDocument>("Users").updateOne(
          { email: session.user.email, "routines.id": routine.id },
          { $pull: { routines: { id: routine.id } } }
        );
    
        if (result.modifiedCount === 0) {
          return new Response(JSON.stringify({ error: "Failed to delete routine" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
    
        return new Response(JSON.stringify({ message: "Routine deleted successfully" }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error deleting routine:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}