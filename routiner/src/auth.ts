import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { getUserByEmail } from "@/app/lib/actions/user"
import { verifyPassword } from "@/app/lib/bcrypt"

export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "email" },
                password: { label: "Password", type: "password", placeholder: "password" },
            },
            async authorize(credentials) {
                const creds = credentials as { email: string; password: string }

                if (!creds?.email || !creds.password) return null

                const user = await getUserByEmail(creds.email)
                if (!user) return null

                const isValid = await verifyPassword(creds.password, user.password)
                if (!isValid) return null

                return { id: user.id, email: user.email, name: user.name }
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.name = user.name
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string
                session.user.name = token.name as string
            }
            return session
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: true,
})
