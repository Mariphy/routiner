import { auth } from "@/auth";
import { connectToDb } from "@/app/api/db";
import { parseISO, startOfDay, endOfDay } from "date-fns";


export async function GET(req: Request) {
    const url = new URL(req.url);
    const date = url.searchParams.get("date");
    const start = url.searchParams.get("start");
    const end = url.searchParams.get("end");
    const title = url.searchParams.get("title");

    const { db } = await connectToDb();
    const user = await db.collection("users").findOne({ email: session.user.email });

    if (!user) {
          throw new NotFoundError("User not found");
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
    
    // Aggregate pipeline to extract only matching events
    const events = await db.collection("users").aggregate([
      { $match: { email: session.user.email } },
      { $unwind: "$events" },
      { $match: matchConditions },
      { $replaceRoot: { newRoot: "$events" } },
    ]).toArray();
  
    return new Response(JSON.stringify({ events }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

}

