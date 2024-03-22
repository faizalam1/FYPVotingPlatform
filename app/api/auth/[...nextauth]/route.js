import User from "@/models/user";
import { connectToDatabase } from "@/utils/database";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export const authOptions = {
  session: {
    jwt: true,
  },
  pages: {
    signIn: "/auth",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user?.email) {
        return { ...token, ...user };
      }

      if (token?.accessTokenExpires) {
        if (Date.now() / 1000 < token?.accessTokenExpires) {
          return { ...token, ...user };
        }
      } else if (token?.refreshToken) {
        return refreshAccessToken(token);
      }

      return { ...token, ...user };
    },
    async session({ session, token }) {
      if (
        Date.now() / 1000 > token?.accessTokenExpires &&
        token?.refreshTokenExpires &&
        Date.now() / 1000 > token?.refreshTokenExpires
      ) {
        return {
          error: new Error(
            "Refresh token has expired. Please log in again to get a new refresh token."
          ),
        };
      }
      session.user = token.user;
      return session;
    },
    providers: [
      CredentialsProvider({
        credentials: {
          email: {},
          password: {},
        },
        async authorize(credentials, req) {
          const { email, password } = credentials;
          try {
            await connectToDatabase();
          } catch (err) {
            console.error("Error connecting to database: ", err);
            return NextResponse.json(
              { error: "Internal Server Error!" },
              { status: 500 }
            );
          }
          const user = await User.findOne({ email });
          if (user && (await bcrypt.compare(password, user.password))) {
            return {
              id: user._id,
              email: user.email,
              name: user.firstName + " " + user.lastName,
            };
          } else {
            console.error("Invalid credentials!", email, password);
            return NextResponse.json(
              { error: "Invalid credentials!" },
              { status: 401 }
            );
          }
        },
      }),
    ],
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
