import NextAuth from "next-auth";
import { authOptions } from "@/app/auth";

// Named exports for GET and POST
export async function GET(req: Request, res: Response) {
  return NextAuth(authOptions)(req, res); // Pass both req and res to the NextAuth handler
}

export async function POST(req: Request, res: Response) {
  return NextAuth(authOptions)(req, res); // Same here for POST
}