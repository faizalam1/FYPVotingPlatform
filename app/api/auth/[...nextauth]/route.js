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
    signIn: "/app/auth",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token = { ...token, user };
      }
      if (token?.exp) {
        if (Date.now() / 1000 < token?.exp) {
          return { ...token };
        }
      } else if (token?.refreshToken) {
        return refreshAccessToken(token);
      }

      return { ...token };
    },
    async session({ session, token }) {
      if (
        Date.now() / 1000 > token?.exp
      ) {
        return {
          error: new Error(
            "Token has expired. Please log in again to get a new token."
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
          const isPasswordCorrect = await bcrypt.compare(
            password,
            user?.password
          );
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
          user.loginAttempts = 0;
          await user.save();
          return {
            id: user._id,
            email: user.email,
            name: user.firstName + " " + user.lastName,
            username: user.username,
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
