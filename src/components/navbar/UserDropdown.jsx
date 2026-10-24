"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { signOut } from "next-auth/react"

export default function UserDropdown({ user }) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)
  const timeoutRef = useRef(null)

  const handleMouseEnter = () => {
    if (window.matchMedia("(pointer: fine)").matches) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      setIsOpen(true)
    }
  }

  const handleMouseLeave = () => {
    if (window.matchMedia("(pointer: fine)").matches) {
      timeoutRef.current = setTimeout(() => {
        setIsOpen(false)
      }, 200)
    }
  }

  const handleButtonClick = (e) => {
    if (!window.matchMedia("(pointer: fine)").matches) {
      e.stopPropagation() 
      setIsOpen((prev) => !prev)
    }
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div 
      className="relative inline-block text-left pb-2 -mb-2" 
      ref={dropdownRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        type="button"
        onClick={handleButtonClick} // FIXED: Added tap handler for mobile screens
        className="flex items-center gap-2 p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-all ease-in-out duration-300"
        aria-expanded={isOpen}
      >
        {user?.image ? (
          <Image
            src={user.image}
            alt={user.name || "User Avatar"}
            width={36}
            height={36}
            className="rounded-full object-cover"
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-slate-300 flex items-center justify-center font-bold text-slate-700">
            {user?.name?.charAt(0) || "U"}
          </div>
        )}
        <span className="text-sm font-medium pr-1 hidden sm:inline-block">
          {user?.name}
        </span>
        
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-xl z-50 p-4 transition-all animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center gap-3 pb-3 border-b border-gray-100 dark:border-gray-800">
            {user?.image ? (
              <Image
                src={user.image}
                alt={user.name || "Avatar"}
                width={40}
                height={40}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-slate-300 flex items-center justify-center font-bold text-slate-700">
                {user?.name?.charAt(0) || "U"}
              </div>
            )}
            <div className="overflow-hidden">
              <p className="font-semibold text-sm text-gray-900 dark:text-gray-100 truncate">
                {user?.name}
              </p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>

          <div className="flex flex-col border-b border-gray-100 dark:border-gray-800">
            <Link
              href="users/dashboard"
              onClick={() => setIsOpen(false)}
              className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              Dashboard
            </Link>
          </div>

          <div className="mt-2">
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="w-full text-left px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
