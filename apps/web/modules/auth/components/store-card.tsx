"use client"

import { useTransition } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { selectStoreAction } from "../actions/select-store"

import { HugeiconsIcon } from "@hugeicons/react"
import { Building03Icon } from "@hugeicons/core-free-icons"
import {
	Card,
	CardContent,
} from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"

interface StoreCardProps {
	storeId: string
	name?: string
	role?: string
	className?: string
}

export default function StoreCard({
	storeId,
	name = "Nama Toko",
	role,
	className
}: StoreCardProps) {
	const { update } = useSession()
	const router = useRouter()
	const [isPending, startTransition] = useTransition()

	const handleSelectStore = () => {
		if (isPending) return

		startTransition(async () => {
			try {
				const result = await selectStoreAction(storeId)

				if (result.error) {
					toast.error(result.error)
					return
				}

				if (result.success && result.token) {
					toast.success(result.message || "Berhasil masuk ke toko")
					await update({ tenantToken: result.token })
					router.push("/")
					router.refresh()
				}
			} catch (error) {
				toast.error("Terjadi kesalahan sistem")
			}
		})
	}

	return (
		<Card 
			onClick={handleSelectStore}
			className={cn(
				"w-64 cursor-pointer transition-all duration-500 ease-out",
				"hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] hover:-translate-y-2",
				"group border-2 hover:border-primary/40 overflow-hidden",
				isPending && "opacity-70 pointer-events-none animate-pulse",
				className
			)}
		>
			<CardContent className="flex flex-col items-center justify-center p-4 gap-4">
				<div className="relative">
					<div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-0 group-hover:scale-150 transition-transform duration-700 ease-out opacity-0 group-hover:opacity-100" />
					<div className="relative p-5 rounded-3xl bg-muted/50 group-hover:bg-primary/10 transition-colors duration-500">
						<HugeiconsIcon
							icon={Building03Icon}
							size={80}
							strokeWidth={1.5}
							className="text-muted-foreground/60 group-hover:text-primary transition-all duration-500 transform group-hover:scale-110"
						/>
					</div>
				</div>
				<div className="text-center space-y-4 flex flex-col items-center">
					<h3 className="font-bold text-2xl tracking-tight group-hover:text-primary transition-colors duration-300">
						{name}
					</h3>
					{role && (
						<span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary transition-colors">
							{role}
						</span>
					)}
				</div>
			</CardContent>
		</Card>
	)
}
