"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"

export default function DataEntryForm() {
  const { data: session } = useSession()
  const [formData, setFormData] = useState({
    name: "",
    legLength: "",
    height90Degree: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage(null)

    try {
      const response = await fetch("/api/measurements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          legLength: formData.legLength,
          height90Degree: formData.height90Degree,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to save data")
      }

      setMessage({
        type: "success",
        text: data.message || "Data saved successfully!",
      })
      setFormData({ name: "", legLength: "", height90Degree: "" })
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Failed to save data. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        {session?.user?.email && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            Logged in as: <span className="font-semibold">{session.user.email}</span>
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Enter name"
            />
          </div>

          <div>
            <label
              htmlFor="legLength"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Leg Length (cm)
            </label>
            <input
              id="legLength"
              name="legLength"
              type="number"
              step="0.1"
              value={formData.legLength}
              onChange={handleChange}
              required
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="e.g., 80, 90, 100"
            />
          </div>

          <div>
            <label
              htmlFor="height90Degree"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Height with 90 Degree (cm)
            </label>
            <input
              id="height90Degree"
              name="height90Degree"
              type="number"
              step="0.1"
              value={formData.height90Degree}
              onChange={handleChange}
              required
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="e.g., 150, 180, 200"
            />
          </div>

          {message && (
            <div
              className={`p-4 rounded-md ${
                message.type === "success"
                  ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                  : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
              }`}
            >
              <p
                className={`text-sm ${
                  message.type === "success"
                    ? "text-green-800 dark:text-green-200"
                    : "text-red-800 dark:text-red-200"
                }`}
              >
                {message.text}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Saving..." : "Save Data"}
          </button>
        </form>
      </div>
    </div>
  )
}

