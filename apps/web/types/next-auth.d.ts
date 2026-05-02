import { DefaultSession } from "next-auth"
import { StoreAccessDTO } from "@/modules/auth/types"

declare module "next-auth" {
  interface User {
    adminLevel?: 'SUPERADMIN' | 'ADMIN'
    stores?: StoreAccessDTO[]
    token?: string
  }

  interface Session {
    user: {
      adminLevel?: 'SUPERADMIN' | 'ADMIN'
      stores?: StoreAccessDTO[]
    } & DefaultSession["user"]
    backendToken?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    adminLevel?: 'SUPERADMIN' | 'ADMIN'
    stores?: StoreAccessDTO[]
    backendToken?: string
  }
}
