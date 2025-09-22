import { generateUniqueId } from "@/app/utils/helpers";
import type { Event } from "@/app/types.ts";
import { withAuth, AuthContext } from "@/app/lib/authMiddleware";
import { AppError, ValidationError } from "@/app/lib/errors";

interface UserDocument {
_id: string;
name: string;
email: string;
password: string;
routines: string[];
events: Event[];
tasks: string[];
}

async function getEvents(req: Request, context: AuthContext) {
    return new Response(JSON.stringify({ events: context.user.events || [] }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}
export const GET = withAuth(getEvents);

async function createEvent(req: Request, context: AuthContext) {
    if (context.user.id !== context.params.id) {
        throw new UnauthorizedError("You are not authorized to create events for this user");
    }

    const { event } = await req.json();

    if (!event) {
        throw new ValidationError("Event is required");
    }

    const eventWithId = {
        ...event,
        id: generateUniqueId(),
        date: event.date ? new Date(event.date) : undefined,
    };

    const result = await context.db.collection("users").updateOne(
        { email: context.user.email },
        { $push: { events: eventWithId } }
    );

    if (result.modifiedCount === 0) {
        throw new AppError("Failed to add event");
    }

    return eventWithId;
}
export const POST = withAuth(createEvent);

async function updateEvent(req: Request, context: AuthContext) {
    const { event } = await req.json();

    if (!event) {
        throw new ValidationError("Event is required");
    }

    const result = await context.db.collection("users").updateOne(
        { email: context.user.email, "events.id": event.id },
        { $set: { "events.$": event } }
    );

    if (result.modifiedCount === 0) {
        throw new AppError("Failed to update event");
    }

    return event;
}

export const PUT = withAuth(updateEvent);
async function deleteEvent(req: Request, context: AuthContext) {
    const { event } = await req.json();

    if (!event) {
        return new Response(JSON.stringify({ error: "Event is required" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }

    const result = await context.db.collection("users").updateOne(
        { email: context.user.email, "events.id": event.id },
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
}

export const DELETE = withAuth(deleteEvent);