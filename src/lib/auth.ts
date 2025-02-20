import { type NextAuthOptions } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { compare } from 'bcryptjs';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        const admin = await prisma.admin.findUnique({
          where: {
            username: credentials.username,
          },
        });

        if (!admin) {
          return null;
        }

        const isPasswordValid = await compare(credentials.password, admin.password);

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: admin.id.toString(),
          name: admin.name,
          username: admin.username,
        };
      },
    }),
  ],
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.username = user.username;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (token) {
        session.user.id = token.id;
        session.user.username = token.username;
      }
      return session;
    },
  },
}; 