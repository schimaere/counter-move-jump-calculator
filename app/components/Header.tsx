"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

export default function Header() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuDropdownRef = useRef<HTMLDivElement>(null);

  const handleSignIn = () => {
    router.push("/auth/signin");
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    if (isUserMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isUserMenuOpen]);

  // Adjust dropdown position to prevent overflow
  useEffect(() => {
    if (isUserMenuOpen && menuButtonRef.current && menuDropdownRef.current) {
      // Use requestAnimationFrame to ensure DOM is updated
      requestAnimationFrame(() => {
        if (!menuButtonRef.current || !menuDropdownRef.current) return;

        const buttonRect = menuButtonRef.current.getBoundingClientRect();
        const dropdownWidth = 224; // w-56 = 14rem = 224px
        const viewportWidth = window.innerWidth;
        const padding = 8; // 0.5rem padding from viewport edge

        // Check if dropdown would overflow
        const rightEdge = buttonRect.right;
        const spaceOnRight = viewportWidth - rightEdge;

        if (spaceOnRight < dropdownWidth) {
          // Not enough space on right, align to right edge of viewport with padding
          const leftPosition = viewportWidth - dropdownWidth - padding;
          if (leftPosition < padding) {
            // Still would overflow, use viewport padding on both sides
            menuDropdownRef.current.style.left = `${padding}px`;
            menuDropdownRef.current.style.right = `${padding}px`;
            menuDropdownRef.current.style.width = `${
              viewportWidth - padding * 2
            }px`;
          } else {
            menuDropdownRef.current.style.right = `${padding}px`;
            menuDropdownRef.current.style.left = "auto";
            menuDropdownRef.current.style.width = "";
          }
        } else {
          // Enough space, align to button
          menuDropdownRef.current.style.right = "0";
          menuDropdownRef.current.style.left = "auto";
          menuDropdownRef.current.style.width = "";
        }
      });
    }
  }, [isUserMenuOpen]);

  return (
    <header className="w-full max-w-5xl mb-4 md:mb-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 md:gap-4">
        {/* Mobile: Tab-like navigation */}
        <div className="md:hidden w-full">
          {session?.user?.email ? (
            <div className="flex items-center gap-2">
              <div className="flex flex-1 rounded-lg bg-gray-100 dark:bg-gray-700 p-1">
                <Link
                  href="/"
                  className={`flex-1 text-center py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                    pathname === "/"
                      ? "bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm"
                      : "text-gray-600 dark:text-gray-400"
                  }`}
                >
                  Calculator
                </Link>
                <Link
                  href="/view-data"
                  className={`flex-1 text-center py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                    pathname === "/view-data"
                      ? "bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm"
                      : "text-gray-600 dark:text-gray-400"
                  }`}
                >
                  Measurements
                </Link>
              </div>
              <div className="relative" ref={menuRef}>
                <button
                  ref={menuButtonRef}
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className={`flex items-center justify-center p-2 rounded-md text-sm font-medium transition-colors ${
                    pathname === "/settings"
                      ? "bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                  }`}
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </button>
                {isUserMenuOpen && (
                  <div
                    ref={menuDropdownRef}
                    className="absolute right-0 mt-2 w-56 min-w-[200px] max-w-[calc(100vw-2rem)] bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50"
                  >
                    <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {session.user.email}
                      </p>
                    </div>
                    <Link
                      href="/settings"
                      onClick={() => setIsUserMenuOpen(false)}
                      className={`block px-4 py-2 text-sm transition-colors ${
                        pathname === "/settings"
                          ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        Settings
                      </div>
                    </Link>
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        signOut({ callbackUrl: "/" });
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                        Sign Out
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-sm font-semibold text-gray-900 dark:text-white">
              Calculator
            </div>
          )}
        </div>

        {/* Desktop: Regular navigation */}
        <div className="hidden md:flex items-center gap-2 md:gap-4 md:justify-between w-full">
          <div className="flex items-center gap-2 md:gap-4">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors ${
                pathname === "/"
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              Calculator
            </Link>
            {session?.user?.email && (
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
            )}
          </div>
          {status === "loading" ? (
            <span className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
              Loading...
            </span>
          ) : session?.user?.email ? (
            <div className="relative flex justify-end" ref={menuRef}>
              <button
                ref={menuButtonRef}
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
              >
                <svg
                  className="h-5 w-5 md:h-4 md:w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span className="hidden sm:inline truncate max-w-[120px] md:max-w-[150px]">
                  {session.user.email}
                </span>
                <svg
                  className={`h-4 w-4 transition-transform ${
                    isUserMenuOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {isUserMenuOpen && (
                <div
                  ref={menuDropdownRef}
                  className="absolute mt-2 w-56 min-w-[200px] max-w-[calc(100vw-2rem)] bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50"
                >
                  <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {session.user.email}
                    </p>
                  </div>
                  <Link
                    href="/settings"
                    onClick={() => setIsUserMenuOpen(false)}
                    className={`block px-4 py-2 text-sm transition-colors ${
                      pathname === "/settings"
                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      Settings
                    </div>
                  </Link>
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      signOut({ callbackUrl: "/" });
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      Sign Out
                    </div>
                  </button>
                </div>
              )}
            </div>
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
  );
}
