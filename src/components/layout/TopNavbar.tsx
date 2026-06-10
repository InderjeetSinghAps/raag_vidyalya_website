"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useState, useRef, useEffect } from "react"
import { Menu, X, User, BookOpen, LogOut } from "lucide-react"
import { useAppSelector, useAppDispatch } from "@/store/hooks"
import { logout } from "@/store/authSlice"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { AuthLinks } from "./AuthLinks"
import { ThemeToggle } from "@/components/theme-toggle"

const navLinks = [
  { label: "Home", href: "/home" },
  { label: "Courses", href: "/courses" },
  { label: "Gurmat Sangeet", href: "/gurmat-sangeet" },
  { label: "Gurbani", href: "/gurbani" },
  { label: "Our Store", href: "/store" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
]

export function TopNavbar() {
  const pathname = usePathname()
  const { user, isAuthenticated } = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const mobileRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
      if (mobileRef.current && !mobileRef.current.contains(e.target as Node)) {
        setMobileOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  const isActive = (href: string) => {
    if (href === "/home") return pathname === "/home"
    return pathname.startsWith(href)
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: 'linear-gradient(180deg, #081527 0%, #071220 100%)',
        boxShadow: '0 8px 32px rgba(0,0,0,.25)',
      }}
    >
      <div className="mx-auto flex h-[72px] max-w-[1400px] items-center justify-between px-8">
        <Link href="/home" className="flex items-center gap-3">
          <Image src="/logo.jpeg" width={48} height={48} className="h-12 w-12 rounded-full object-cover" alt="Raag Vidyalaya" />
          <span className="hidden text-xl font-semibold text-white sm:inline">Raag Vidyalaya</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-all duration-300 ${
                isActive(link.href)
                  ? "text-primary"
                  : "text-[#F8FAFC] hover:text-primary"
              }`}
            >
              {link.label}
              {isActive(link.href) && (
                <div className="mx-auto mt-0.5 h-0.5 w-4 rounded-full bg-primary" />
              )}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          {isAuthenticated && user ? (
            <div className="relative hidden md:block" ref={dropdownRef}>
              <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center gap-2 focus:outline-none">
                <Avatar size="sm">
        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
          {(user?.name || user?.userName || '?').charAt(0).toUpperCase()}
        </AvatarFallback>
                </Avatar>
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-lg border border-[#16243a] bg-[#081527] py-1 shadow-lg">
                  <Link
                    href="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-[#94A3B8] transition-colors hover:text-white hover:bg-[#16243a]"
                  >
                    <User size={14} /> Profile
                  </Link>
                  <Link
                    href="/courses/my-courses"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-[#94A3B8] transition-colors hover:text-white hover:bg-[#16243a]"
                  >
                    <BookOpen size={14} /> My Courses
                  </Link>
                  <button
                    onClick={() => {
                      dispatch(logout())
                      setDropdownOpen(false)
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-[#94A3B8] transition-colors hover:text-white hover:bg-[#16243a]"
                  >
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden md:block">
              <AuthLinks />
            </div>
          )}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex items-center justify-center md:hidden"
          >
            {mobileOpen ? (
              <X className="size-5 text-white" />
            ) : (
              <Menu className="size-5 text-white" />
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div
          ref={mobileRef}
          className="border-t border-[#16243a] md:hidden"
          style={{ background: 'linear-gradient(180deg, #081527 0%, #071220 100%)' }}
        >
          <div className="flex flex-col gap-1 px-8 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? "bg-[#16243a] text-primary"
                    : "text-[#F8FAFC] hover:bg-[#16243a] hover:text-primary"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 border-t border-[#16243a] pt-3">
              {isAuthenticated && user ? (
                <div className="space-y-1">
                  <Link
                    href="/profile"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm text-[#94A3B8] transition-colors hover:bg-[#16243a] hover:text-white"
                  >
                    <User size={14} /> Profile
                  </Link>
                  <button
                    onClick={() => {
                      dispatch(logout())
                      setMobileOpen(false)
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-4 py-2.5 text-sm text-[#94A3B8] transition-colors hover:bg-[#16243a] hover:text-white"
                  >
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              ) : (
                <AuthLinks />
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
