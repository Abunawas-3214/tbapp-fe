import { auth } from "@/lib/auth"
import StoreCard from "@/modules/auth/components/store-card"
import { redirect } from "next/navigation"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowLeft02Icon } from "@hugeicons/core-free-icons"
import { StoreAccessDTO } from "@/modules/auth/types"

export default async function PilihTokoPage() {
	const session = await auth()

	if (!session) {
		redirect("/login")
	}

	const stores = session.user.stores || []
	console.log(session)

	return (
		<div className="flex flex-col items-center justify-center min-h-svh p-8 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background">
			<div className="max-w-2xl w-full text-center space-y-6 mb-16 animate-in fade-in slide-in-from-top-4 duration-1000">
				<h1 className="text-3xl font-black tracking-tight sm:text-5xl text-foreground">
					Pilih Toko
				</h1>
				<p className="text-lg text-muted-foreground/80 font-medium">
					Pilih salah satu toko di bawah ini untuk mulai mengelola operasional Anda.
				</p>
			</div>

			<div className="flex flex-wrap gap-10 justify-center items-center max-w-6xl animate-in fade-in zoom-in-95 duration-1000 delay-200">
				{stores.length === 0 ? (
					<StoreCard
						name="Toko Demo"
						description="Anda belum memiliki toko. Hubungi admin untuk ditambahkan ke toko."
					/>
				) : (
					stores.map((store: StoreAccessDTO, index: number) => (
						<StoreCard
							key={store.id || index}
							name={store.name}
							role={store.role}
						/>
					))
				)}
			</div>

			<div className="mt-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
				<Link
					href="/"
					className="group flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
				>
					<HugeiconsIcon
						icon={ArrowLeft02Icon}
						size={18}
						className="transition-transform group-hover:-translate-x-1"
					/>
					Kembali ke Beranda
				</Link>
			</div>
		</div>
	)
}
