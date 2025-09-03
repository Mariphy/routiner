import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { verifyPassword } from "@/app/lib/bcrypt"
import { getUserByEmail } from "@/app/lib/actions/user"

export default {
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
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
    secret: process.env.AUTH_SECRET,
    session: {
        strategy: "jwt",
    },
} satisfies NextAuthConfig