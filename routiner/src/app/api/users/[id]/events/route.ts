import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { connectToDb } from "@/app/api/db";
import { generateUniqueId } from "@/app/utils/helpers";

interface Event {
    title: string;
    id: string;
    day?: string;
    description?: string;
    location?: string;
    url?: string;
    date?: Date;
    startTime?: string;
    endTime?: string;
    repeat?: string;
}

interface UserDocument {
_id: string;
name: string;
email: string;
password: string;
routines: string[];
events: Event[];
tasks: string[];
}

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
    
        return new Response(JSON.stringify({ events: user.events || [] }), {
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
        const session = await getServerSession(options);
        if (!session?.user?.email) {
          return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
          });
        }
    
        const { db } = await connectToDb();
        const { event } = await req.json();
    
        if (!event) {
          return new Response(JSON.stringify({ error: "Event is required" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }

        const eventWithId = {
          ...event,
          id: generateUniqueId(),
          date: event.date ? new Date(event.date) : undefined,
        };
    
        const result = await db.collection("Users").updateOne(
          { email: session.user.email },
          { $push: { events: eventWithId } }
        );
    
        if (result.modifiedCount === 0) {
          return new Response(JSON.stringify({ error: "Failed to add event" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
    
        return new Response(JSON.stringify({ event: eventWithId }), {
          status: 201,
          headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error adding event:", error);
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
        const session = await getServerSession(options);
        if (!session?.user?.email) {
          return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
          });
        }
    
        const { db } = await connectToDb();
        const { event } = await req.json();
    
        if (!event) {
          return new Response(JSON.stringify({ error: "Event is required" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }
    
        const result = await db.collection("Users").updateOne(
          { email: session.user.email, "events.id": event.id },
          { $set: { "events.$": event } }
        );
    
        if (result.modifiedCount === 0) {
          return new Response(JSON.stringify({ error: "Failed to update event" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
    
        return new Response(JSON.stringify({ message: "Event updated successfully" }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error updating event:", error);
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
        const session = await getServerSession(options);
        if (!session?.user?.email) {
          return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
          });
        }
    
        const { db } = await connectToDb();
        const { event } = await req.json();
    
        if (!event) {
          return new Response(JSON.stringify({ error: "Event is required" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }
    
        const result = await db.collection<UserDocument>("Users").updateOne(
          { email: session.user.email, "events.id": event.id },
          { $pull: { events: { id: event.id } } }
        );
    
        if (result.modifiedCount === 0) {
          return new Response(JSON.stringify({ error: "Failed to delete event" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
    
        return new Response(JSON.stringify({ message: "Event deleted successfully" }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error deleting event:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}