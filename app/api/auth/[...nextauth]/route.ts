import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { findLeadByEmail, addLead } from "@/lib/airtable"
import bcrypt from "bcryptjs"

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Email and Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials")
        }

        const user = await findLeadByEmail(credentials.email)
        
        if (!user || !user.Password) {
          throw new Error("Invalid email or password")
        }

        const isValid = await bcrypt.compare(credentials.password, user.Password)
        if (!isValid) {
          throw new Error("Invalid email or password")
        }

        return {
          id: user.id,
          name: user.Name,
          email: user.Email,
        }
      }
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          if (user.email) {
            const existingLead = await findLeadByEmail(user.email)
            if (!existingLead) {
              await addLead({
                name: user.name || "Google User",
                email: user.email,
                status: "New Client"
              })
            }
          }
        } catch (err) {
          console.error("Airtable sync failed during Google Login:", err)
          // Still allow login even if Airtable fails
        }
      }
      return true
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        // Attach Airtable record ID or custom ID to session
        (session.user as any).id = token.sub
      }
      return session
    }
  },
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: '/download', // Since our modal is on the download page
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback_secret_for_development",
  debug: true,
})

export { handler as GET, handler as POST }
