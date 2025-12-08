import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { db } from './db'

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // In production, use database lookup with password hashing
        const users = [
          {
            id: '1',
            email: 'resident@example.com',
            password: 'password123',
            name: 'John Resident',
            role: 'resident',
            unit: 'A-101',
          },
          {
            id: '2',
            email: 'admin@example.com',
            password: 'admin123',
            name: 'Admin User',
            role: 'admin',
            unit: 'Admin Office',
          },
          {
            id: '3',
            email: 'security@example.com',
            password: 'security123',
            name: 'Security Guard',
            role: 'security',
            unit: 'Gate 1',
          },
        ]

        const user = users.find(
          (u) => u.email === credentials.email && u.password === credentials.password
        )

        if (!user) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          unit: user.unit,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.unit = user.unit
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role
        session.user.unit = token.unit
        session.user.id = token.sub
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
}

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions)