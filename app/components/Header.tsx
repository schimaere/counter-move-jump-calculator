"use client"

import { signIn, signOut, useSession } from "next-auth/react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"

export default function Header() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  const handleSignIn = () => {
    router.push("/auth/signin")
  }

  return (
    <header className="w-full max-w-5xl mb-4 md:mb-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 md:gap-4">
        <div className="flex items-center gap-2 md:gap-4 flex-wrap">
          <Link
            href="/"
            className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Calculator
          </Link>
          {session?.user?.email && (
            <>
              <Link
                href="/view-data"
                className={`text-sm font-medium transition-colors ${
                  pathname === "/view-data"
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                Measurements
              </Link>
              <Link
                href="/settings"
                className={`text-sm font-medium transition-colors ${
                  pathname === "/settings"
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                Settings
              </Link>
            </>
          )}
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          {status === "loading" ? (
            <span className="text-xs md:text-sm text-gray-500 dark:text-gray-400">Loading...</span>
          ) : session?.user?.email ? (
            <>
              <span className="text-xs md:text-sm text-gray-600 dark:text-gray-400 truncate max-w-[120px] md:max-w-none">
                {session.user.email}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors whitespace-nowrap"
              >
                Sign Out
              </button>
            </>
          ) : (
            <button
              onClick={handleSignIn}
              className="px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors whitespace-nowrap"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  )
}

