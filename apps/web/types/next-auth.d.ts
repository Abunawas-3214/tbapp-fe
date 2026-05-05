import { DefaultSession } from "next-auth";
import { StoreAccessDTO } from "@/modules/auth/types";

declare module "@auth/core/types" {
  interface User {
    adminLevel?: 'SUPERADMIN' | 'ADMIN';
    stores?: StoreAccessDTO[];
    token?: string;
  }

  interface Session {
    stores?: StoreAccessDTO[];
    store?: {
      id: string;
      name: string;
      slug: string;
      schemaName: string;
    };
    backendToken?: string;
    user: {
      id: string;
      role?: string;
      permissions?: any;
      adminLevel?: 'SUPERADMIN' | 'ADMIN';
    } & DefaultSession["user"];
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    backendToken?: string;
    stores?: StoreAccessDTO[];
    storeContext?: {
      id: string;
      name: string;
      slug: string;
      schemaName: string;
    };
    user?: {
      id: string;
      name?: string | null;
      email?: string | null;
      adminLevel?: 'SUPERADMIN' | 'ADMIN';
      role?: string;
      permissions?: any;
    };
  }
}