"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, User } from "lucide-react"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // This would normally be handled with a proper auth system
  const toggleLogin = () => {
    setIsLoggedIn(!isLoggedIn)
  }

  return (
    <header className="bg-purple-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            Taskly
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            <Link href="/tasks" className="hover:text-purple-200">
              Tasks
            </Link>
            <Link href="/courses" className="hover:text-purple-200">
              Courses
            </Link>
            {isLoggedIn && (
              <>
                <Link href="/my-courses" className="hover:text-purple-200">
                  My Courses
                </Link>
                {/* Add admin link if user is admin */}
                <Link href="/admin" className="hover:text-purple-200">
                  Admin
                </Link>
                <Link href="/dashboard" className="hover:text-purple-200">
                  Dashboard
                </Link>
                <Link href="/publish" className="hover:text-purple-200">
                  Publish Course
                </Link>
              </>
            )}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <Link href="/profile" className="flex items-center hover:text-purple-200">
                  <User className="mr-1 h-5 w-5" />
                  Profile
                </Link>
                <button
                  onClick={toggleLogin}
                  className="bg-white text-purple-600 px-4 py-2 rounded hover:bg-purple-100"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-x-2">
                <Link href="/login" className="bg-purple-700 px-4 py-2 rounded hover:bg-purple-800">
                  Login
                </Link>
                <Link href="/register" className="bg-white text-purple-600 px-4 py-2 rounded hover:bg-purple-100">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-4">
            <Link href="/tasks" className="block hover:text-purple-200" onClick={() => setIsMenuOpen(false)}>
              Tasks
            </Link>
            <Link href="/courses" className="block hover:text-purple-200" onClick={() => setIsMenuOpen(false)}>
              Courses
            </Link>
            {isLoggedIn ? (
              <>
                <Link href="/my-courses" className="block hover:text-purple-200" onClick={() => setIsMenuOpen(false)}>
                  My Courses
                </Link>
                {/* Add admin link if user is admin */}
                <Link href="/admin" className="block hover:text-purple-200" onClick={() => setIsMenuOpen(false)}>
                  Admin
                </Link>
                <Link href="/dashboard" className="block hover:text-purple-200" onClick={() => setIsMenuOpen(false)}>
                  Dashboard
                </Link>
                <Link href="/publish" className="block hover:text-purple-200" onClick={() => setIsMenuOpen(false)}>
                  Publish Course
                </Link>
                <Link href="/profile" className="block hover:text-purple-200" onClick={() => setIsMenuOpen(false)}>
                  Profile
                </Link>
                <button
                  onClick={() => {
                    toggleLogin()
                    setIsMenuOpen(false)
                  }}
                  className="block w-full text-left hover:text-purple-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="space-y-2">
                <Link
                  href="/login"
                  className="block bg-purple-700 px-4 py-2 rounded hover:bg-purple-800 text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="block bg-white text-purple-600 px-4 py-2 rounded hover:bg-purple-100 text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
