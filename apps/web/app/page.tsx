import { Button } from "@workspace/ui/components/button"
import Link from "next/link"
import { auth, signOut } from "@/lib/auth"

export default async function Page() {
  const session = await auth()
  console.log(session)
  return (
    <div className="flex min-h-svh p-6">
      <div className="flex max-w-md min-w-0 flex-col gap-4 text-sm leading-loose">
        <div>
          <h1 className="font-medium">Project ready!</h1>
          <p>You may now add components and start building.</p>
          <p>We&apos;ve already added the button component for you.</p>
          <div className="flex mt-2 space-x-4">
            {session ? (
              <form
                action={async () => {
                  "use server"
                  await signOut()
                }}
              >
                <Button type="submit" className="bg-red-500 hover:bg-red-400">Logout</Button>
              </form>
            ) : (
              <Link href={"/login"}>
                <Button >Login</Button>
              </Link>
            )}
            {session?.stores && (
              (!session.store) ?
                <Link href={"/pilih-toko"}>
                  <Button>Pilih Toko</Button>
                </Link> :
                <Link href={"https://app.tbapp.dev"}>
                  <Button>Masuk ruang kerja toko: {session.store?.name} </Button>
                </Link>
            )}
            {session?.user.adminLevel && (
              <Link href={"https://admin.tbapp.dev"}>
                <Button>Masuk ruang kerja admin</Button>
              </Link>
            )}
          </div>
        </div>
        <div className="text-muted-foreground font-mono text-xs">
          (Press <kbd>d</kbd> to toggle dark mode)
        </div>
      </div>
    </div>
  )
}
