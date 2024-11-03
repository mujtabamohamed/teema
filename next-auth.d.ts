// types/next-auth.d.ts

import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string; // Add custom property
      name?: string | null;
      email?: string | null;
      username?: string | null;
    };
  }

  interface User {
    id: string; 
    name?: string | null;
    email?: string | null;
    username?: string | null;
  }
}
