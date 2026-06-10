"use client"

import { useRouter } from "next/navigation"
import { User, BookOpen, Download, Trophy, Settings, Info, ChevronRight, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { logout } from "@/store/authSlice"

const menuItems = [
  { label: "My Courses", icon: BookOpen, href: "/courses/my-courses" },
  { label: "My Downloads", icon: Download, href: "#" },
  { label: "Contest History", icon: Trophy, href: "#" },
  { label: "Settings", icon: Settings, href: "#" },
  { label: "About", icon: Info, href: "#" },
]

export default function ProfilePage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((s) => s.auth)

  const handleLogout = () => {
    dispatch(logout())
    localStorage.clear()
    router.push("/home")
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col items-center text-center">
        <Avatar size="lg" className="mb-4 size-20">
          <AvatarFallback className="bg-cyan-500 text-2xl font-bold text-black">
            {user?.name ? user.name.charAt(0).toUpperCase() : <User className="size-8" />}
          </AvatarFallback>
        </Avatar>
        <h1 className="text-xl font-bold text-white">{user?.name || "User"}</h1>
        <p className="mt-0.5 text-sm text-[#64748B]">{user?.email || ""}</p>
      </div>

      <div className="rounded-xl border border-[#1E293B] bg-[#0B1220] overflow-hidden">
        {menuItems.map((item, index) => (
          <div key={item.label}>
            <button
              onClick={() => item.href !== "#" && router.push(item.href)}
              className="flex w-full items-center gap-3 px-4 py-3.5 text-sm text-[#94A3B8] transition-colors hover:bg-white/[0.02] hover:text-white"
            >
              <item.icon className="size-4 text-[#64748B]" />
              <span className="flex-1 text-left">{item.label}</span>
              <ChevronRight className="size-4 text-[#64748B]" />
            </button>
            {index < menuItems.length - 1 && <Separator className="bg-[#1E293B]" />}
          </div>
        ))}
      </div>

      <Button
        variant="destructive"
        className="mt-6 w-full"
        onClick={handleLogout}
      >
        <LogOut className="size-4" />
        Sign Out
      </Button>
    </div>
  )
}
