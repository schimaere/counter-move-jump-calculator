"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"

export default function AuthError() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case "AccessDenied":
        return "Your email address is not authorized to access this application."
      case "Configuration":
        return "There is a problem with the server configuration."
      case "Verification":
        return "The verification token has expired or has already been used."
      default:
        return "An error occurred during authentication."
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-2 text-gray-900 dark:text-white">
            Authentication Error
          </h1>
          <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
            <p className="text-sm text-red-800 dark:text-red-200">
              {getErrorMessage(error)}
            </p>
          </div>
          <Link
            href="/auth/signin"
            className="mt-6 block w-full text-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          >
            Try Again
          </Link>
        </div>
      </div>
    </div>
  )
}

