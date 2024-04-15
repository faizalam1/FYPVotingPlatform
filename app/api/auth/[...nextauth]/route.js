import User from "@/models/user";
import { connectToDatabase } from "@/utils/database";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

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
  },
  providers: [
    CredentialsProvider({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials, req) {
        const { email, password } = credentials;
        const emailRegex = new RegExp(/^[\w\\.\\+]+@([\w-]+\.)+[\w-]{2,}$/);
        if (!emailRegex.test(email)) {
          console.error("Invalid email!", email);
          throw new Error("Email invalid!");
        }
        try {
          await connectToDatabase();
        } catch (err) {
          console.error("Error connecting to database: ", err);
          throw new Error("Internal Server Error!");
        }
        const user = await User.findOne({ email });
        if (user) {
          if (user.isLocked) {
            console.error("User is locked!", email);
            throw new Error("User is locked!");
          }
          const isPasswordCorrect = await bcrypt.compare(password, user?.password);
          if (!isPasswordCorrect) {
            user.loginAttempts += 1;
            if (user.loginAttempts >= 5) {
              user.isLocked = true;
            }
            await user.save();
            console.error("Invalid password!", email);
            throw new Error("Invalid password!");
          }
          if (!user.isVerified) {
            console.error("User not verified!", email);
            throw new Error("User not verified!");
          }
          return {
            id: user._id,
            email: user.email,
            name: user.firstName + " " + user.lastName,
          };
        } else {
          console.error("Invalid credentials!", email, password);
          throw new Error("Invalid credentials!");
        }
      },
    }),
  ],
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
