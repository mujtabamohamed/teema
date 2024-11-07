import { connectMongoDB } from "@/lib/monogodb";
import User from "@/models/user";
import NextAuth, { User as NextAuthUser, Session } from "next-auth";

// Import credentials provider for email/password authentication
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { JWT } from "next-auth/jwt";

interface CustomUser extends NextAuthUser {
  id: string;
}

export const authOptions = {
  
  // Configure authentication providers
  providers: [
    CredentialsProvider({
      name: "credentials",  // Provider name
      credentials: {},
      
      // Authorization function that validates user credentials
      async authorize(credentials) {
        
        // Extract email and password from credentials
        const { email, password } = credentials as { email: string; password: string };

        try {
          await connectMongoDB();

          // Find user by email
          const user = await User.findOne({ email });

          if (!user) {
            return null;
          }

          const passwordMatch = await bcrypt.compare(password, user.password);

          if (!passwordMatch) {
            return null;
          }

          // Return user object if authentication succeeds
          return {
            id: user._id,
            email: user.email,
            name: user.name,
            username: user.username
          };
        } catch (error) {
          console.log("Error: ", error);
          return null;
        }
      },
    }),
  ],

  // Configure session handling to use JWT
  session: {
    strategy: "jwt" as const,
  },

  // Define callbacks for JWT and session handling
  callbacks: {

    // JWT callback to add user ID to token
    async jwt({ token, user }: { token: JWT; user?: CustomUser }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },

    // Session callback to add user ID to session
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,

  // Configure sign-in page
  pages: {
    signIn: "/",
  },
};

// Initialize NextAuth with the configured options
const handler = NextAuth(authOptions);

// Export GET and POST handlers for authentication
export { handler as GET, handler as POST };
