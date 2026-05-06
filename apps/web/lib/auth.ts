/// <reference types="@auth/core" />
import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { LoginResponse } from "@/modules/auth/types";
import { User } from "@auth/core/types";
import { jwtDecode } from "jwt-decode";
import Google from "next-auth/providers/google";

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
					stores: data.stores
				}
			}
		}),
		Google({
			clientId: process.env.AUTH_CLIENT_ID!,
			clientSecret: process.env.AUTH_CLIENT_SECRET!,
		})
	],
	callbacks: {
		async signIn({ account, profile }) {
			if (account?.provider === "google") {
				const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/google/register`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						idToken: account.userId
					})
				})
				return res.ok
			}
			return true
		},
		async jwt({ token, user, trigger, session }) {
			if (user) {
				const u = user as any
				token.user = {
					id: u.id,
					email: u.email,
					name: u.name,
					adminLevel: u.adminLevel,
				}
				token.stores = user.stores
				token.backendToken = user.token
			}
			if (trigger === "update" && session?.tenantToken) {
				token.backendToken = session.tenantToken
				try {
					const decoded: any = jwtDecode(session.tenantToken)
					if (token.user) {
						token.user = {
							...token.user,
							role: decoded.user.role,
							permissions: decoded.user.permissions
						}
					}
					token.storeContext = {
						id: decoded.store.store_id,
						name: decoded.store.name,
						slug: decoded.store.store_slug,
						schemaName: decoded.store.schema_name
					}
				} catch (error) {
					console.error("Failed to decode tenant token", error)
				}
			}
			return token;
		},
		async session({ session, token }) {
			if (session.user && token.user) {
				session.user = {
					...session.user,
					id: token.user.id,
					role: token.user.role,
					permissions: token.user.permissions,
					adminLevel: token.user.adminLevel as 'SUPERADMIN' | 'ADMIN' | undefined
				};
				(session as any).stores = token.stores;
				(session as any).backendToken = token.backendToken;

				if (token.storeContext) {
					(session as any).store = token.storeContext;
				}

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
