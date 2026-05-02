/// <reference types="@auth/core" />
import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { LoginResponse } from "@/modules/auth/types";

export const authConfig: NextAuthConfig = {
	providers: [
		Credentials({
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" }
			},
			authorize: async (credentials) => {
				const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						email: credentials?.email,
						password: credentials?.password
					}),
				});

				const result = await res.json()
				
				if (!res.ok) {
					throw new Error(result.error || "Kredensial salah")
				}

				const data: LoginResponse = result.data;
				if (!data) return null

				return {
					id: data.user.id,
					email: data.user.email,
					name: data.user.name,
					token: data.token,
					adminLevel: data.user.admin_level,
					stores: data.stores || []
				}
			}
		})
	],
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.adminLevel = (user as any).adminLevel;
				token.stores = (user as any).stores;
				token.backendToken = (user as any).token;
			}
			return token;
		},
		async session({ session, token }) {
			if (session.user) {
				(session.user as any).adminLevel = token.adminLevel;
				(session.user as any).stores = token.stores;
				(session as any).backendToken = token.backendToken;
			}
			return session;
		},
	},
	cookies: {
		sessionToken: {
			name: `next-auth.session-token`,
			options: {
				httpOnly: true,
				sameSite: "lax",
				path: "/",
				domain: ".tbapp.test",
				secure: process.env.NODE_ENV === "production",
			},
		},
	},
	pages: {
		signIn: "/login"
	}
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
