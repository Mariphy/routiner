import NextAuth, { Session } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import { getUserByEmail } from "./lib/user";
import { verifyPassword } from "./lib/bcrypt";

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

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
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
    strategy: "jwt", 
  },
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub ?? "";
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});