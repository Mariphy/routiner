import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDb } from "./api/db";
import { verifyPassword } from "./utils/bcrypt";

async function getUserByEmail(email: string) {
  const { db } = await connectToDb();
  return db.collection("Users").findOne({ email });
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
  secret: process.env.NEXTAUTH_SECRET,
});