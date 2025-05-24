import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { connectToDb } from "@/app/api/db";
import { parseISO, startOfDay, endOfDay } from "date-fns";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(options);
    if (!session?.user?.email) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const url = new URL(req.url);
    const date = url.searchParams.get("date");
    const start = url.searchParams.get("start");
    const end = url.searchParams.get("end");
    const title = url.searchParams.get("title");

    const { db } = await connectToDb();
    const user = await db.collection("Users").findOne({ email: session.user.email });

    if (!user) {
          return new Response(JSON.stringify({ error: "User not found" }), {
            status: 404,
            headers: { "Content-Type": "application/json" },
          });
    }

    // Build dynamic match conditions
    const matchConditions: Record<string, unknown> = {};

    if (date) {
        const parsedDate = new Date(date); // instead of parseISO
        matchConditions["events.date"] = {
            $gte: startOfDay(parsedDate),
            $lte: endOfDay(parsedDate),
        };
    } else if (start && end) {
      matchConditions["events.date"] = {
        $gte: parseISO(start),
        $lte: parseISO(end),
      };
    }

    if (title) {
      matchConditions["events.title"] = { $regex: new RegExp(title, "i") };
    }
    console.log("matchConditions:", matchConditions);
    // Aggregate pipeline to extract only matching events
    const events = await db.collection("Users").aggregate([
      { $match: { email: session.user.email } },
      { $unwind: "$events" },
      { $match: matchConditions },
      { $replaceRoot: { newRoot: "$events" } },
    ]).toArray();
    console.log("events found:", events);
    return new Response(JSON.stringify({ events }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("Error searching events:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}

