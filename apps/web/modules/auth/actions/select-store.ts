"use server";

import { auth } from "@/lib/auth";

export async function selectStoreAction(storeId: string) {
	const session = await auth();

	if (!session || !(session as any).backendToken) {
		return { error: "Sesi tidak valid. Silakan login kembali." };
	}

	try {
		const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/select-store`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${(session as any).backendToken}`,
			},
			body: JSON.stringify({ store_id: storeId }),
		});

		const result = await res.json();

		if (!res.ok) {
			return { error: result.message || "Gagal masuk ke ruang kerja toko." };
		}

		return {
			success: true,
			token: result.data.token,
			message: result.data.message
		};

	} catch (error) {
		console.error("Select Store Error:", error);
		return { error: "Terjadi kesalahan saat menghubungi server." };
	}
}