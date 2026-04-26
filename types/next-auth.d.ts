import { DefaultSession, DefaultUser } from "next-auth"
import { AdapterUser } from "next-auth/adapters"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      image?: string | null
      role?: string
    } & DefaultSession["user"]
  }

  interface User {
    role?: string
  }
}

declare module "next-auth/adapters" {
  interface AdapterUser extends DefaultUser {
    role?: string
  }
}
