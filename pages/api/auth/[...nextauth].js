import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import User from "../../../models/User";
import { verifyPassword } from "../../../utils/auth";
import connectDB from "../../../utils/connectDB";
export const authOptions = {
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        await connectDB();
        const { email, password } = credentials;

        try {
          await connectDB();
        } catch (error) {
          throw new Error("Error in connecting to DB!");
        }

        if (!email || !password) {
          throw new Error("Invalid Data!");
        }

        const user = await User.findOne({ email: email });
        if (!user) {
          throw new Error("User doesn't exist!");
        }

        const isValid = await verifyPassword(password, user.password);
        if (!isValid) {
          throw new Error("Username or password is incorrect!");
        }

        return { id: user._id.toString(), email: user.email };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
      }
      return session;
    },
  },
  cookies: {
    csrfToken: {
      name: "__Secure-next-auth.csrf-token", // یا `next-auth.csrf-token` برای توسعه
      options: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // استفاده از https در پروڈاکشن
        path: "/",
      },
    },
    sessionToken: {
      name: "__Secure-next-auth.session-token", // یا `next-auth.session-token` برای توسعه
      options: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
      },
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
