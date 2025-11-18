"use client"

import { signIn, signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function Header() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const handleSignIn = () => {
    router.push("/auth/signin")
  }

  return (
    <header className="w-full max-w-5xl mb-8 flex justify-between items-center">
      <div className="flex-1"></div>
      <div className="flex items-center gap-4">
        {status === "loading" ? (
          <span className="text-sm text-gray-500 dark:text-gray-400">Loading...</span>
        ) : session?.user?.email ? (
          <>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {session.user.email}
            </span>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
            >
              Sign Out
            </button>
          </>
        ) : (
          <button
            onClick={handleSignIn}
            className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
          >
            Sign In
          </button>
        )}
      </div>
    </header>
  )
}

