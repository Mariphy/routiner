import NextAuth, { Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from "next-auth/providers/credentials";
import { getUserByEmail } from "@/app/lib/user";
import { verifyPassword } from "@/app/lib/bcrypt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

export const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholeder: "email" },
        password: { label: "Password", type: "password", placeholder: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null; // Ensure email is defined
        const user = await getUserByEmail(credentials.email); // Fetch user from DB
        if (!user) return null;

        const isValid = await verifyPassword(credentials!.password, user.password); // Verify password
        if (!isValid) return null;

        return { id: user.id, email: user.email }; // Return user object
      },
    }),
  ], 
  session: {
    strategy: "jwt" as const, 
  },
  callbacks: {
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token && session.user) {
        session.user.id = token.sub ?? "";
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
};