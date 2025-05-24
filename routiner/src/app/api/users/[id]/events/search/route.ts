import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { connectToDb } from "@/app/api/db";
import { parseISO, startOfDay, endOfDay } from "date-fns";

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

export async function GET(req: Request, { params }: { params: { userId: string } }) {
  try {
    const session = await getServerSession(options);
    if (!session?.user?.email || session.user.email !== params.userId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const url = new URL(req.url);
    const date = url.searchParams.get("date");
    const start = url.searchParams.get("start");
    const end = url.searchParams.get("end");
    const title = url.searchParams.get("title");

    const { db } = await connectToDb();

    // Build filter logic
    const match: Record<string, unknown> = {};
    if (date) {
      const parsedDate = parseISO(date);
      match["events.date"] = {
        $gte: startOfDay(parsedDate),
        $lte: endOfDay(parsedDate),
      };
    } else if (start && end) {
      match["events.date"] = {
        $gte: parseISO(start),
        $lte: parseISO(end),
      };
    }

    if (title) {
      match["events.title"] = { $regex: new RegExp(title, "i") };
    }

    const user = await db.collection("Users").findOne(
      { email: session.user.email },
      { projection: { events: 1 } }
    );

    const filteredEvents = (user?.events || []).filter((event: Event) => {
      const eventDate = event.date ? new Date(event.date) : null;

      const matchDate =
        date && eventDate
          ? eventDate >= startOfDay(parseISO(date)) && eventDate <= endOfDay(parseISO(date))
          : start && end && eventDate
          ? eventDate >= parseISO(start) && eventDate <= parseISO(end)
          : true;

      const matchTitle = title
        ? event.title.toLowerCase().includes(title.toLowerCase())
        : true;

      return matchDate && matchTitle;
    });

    return new Response(JSON.stringify({ events: filteredEvents }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("Error searching events:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
