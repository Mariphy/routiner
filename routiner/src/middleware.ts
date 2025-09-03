import authConfig from "@/auth.config";
import NextAuth from "next-auth";
export const runtime = "nodejs";
export const { auth: middleware } = NextAuth(authConfig);
 
