"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function SettingsForm() {
  const { data: session } = useSession();
  const [framesPerSecond, setFramesPerSecond] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/settings");
      const data = await response.json();

      if (response.ok && data.settings) {
        if (data.settings.framesPerSecond !== null) {
          setFramesPerSecond(data.settings.framesPerSecond.toString());
        } else {
          setFramesPerSecond("");
        }
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          framesPerSecond: framesPerSecond.trim() === "" ? null : framesPerSecond,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save settings");
      }

      setMessage({
        type: "success",
        text: data.message || "Settings saved successfully!",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "Failed to save settings. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 md:p-6 lg:p-8">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading settings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 md:p-6 lg:p-8">
        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          <div>
            <label
              htmlFor="framesPerSecond"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Default Frames per Second
            </label>
            <input
              id="framesPerSecond"
              name="framesPerSecond"
              type="number"
              step="0.01"
              value={framesPerSecond}
              onChange={(e) => setFramesPerSecond(e.target.value)}
              min="0.01"
              className="w-full px-4 py-3 md:py-2 text-base md:text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="e.g., 30, 60, 120"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              This value will be pre-filled in the calculator. Leave empty to disable.
            </p>
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
            disabled={isSaving}
            className="w-full px-4 py-3 md:py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-base md:text-sm"
          >
            {isSaving ? "Saving..." : "Save Settings"}
          </button>
        </form>
      </div>
    </div>
  );
}

