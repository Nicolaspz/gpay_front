"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChevronDown, LogOut, Menu } from "lucide-react"
import ThemeSwitcher from "@/components/theme-switcher"
import { NotificationDropdown } from "@/components/notifications/NotificationDropdown"
import { useAuth } from "@/hooks/useAuth"
import { toast } from "react-toastify"

export default function Header({ toggleSidebar }: { toggleSidebar: () => void }) {
  const router = useRouter()
  const { signOut, user } = useAuth()

  const handleLogout = () => {
    signOut()
    toast.success("Logout realizado com sucesso")
    router.push("/")
  }

  const getInitials = (name?: string) => {
    if (!name) return "AD"
    return name
      .split(" ")
      .slice(0, 2)
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-[var(--sidebar)] text-[var(--sidebar-foreground)] border-b border-[var(--sidebar-border)]">
      <div className="flex items-center gap-4 min-w-[150px]">
        <button onClick={toggleSidebar} className="lg:hidden">
          <Menu className="w-6 h-6 text-[var(--sidebar-foreground)] cursor-pointer" />
        </button>
        <div>
          <h1 className="text-lg font-semibold">Dashboard</h1>
          <p className="text-sm text-[var(--muted-foreground)]">Payment Updates</p>
        </div>
      </div>

      <div className="flex items-center gap-4 min-w-[150px] justify-end">
        <ThemeSwitcher />
        <NotificationDropdown />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="p-0 flex items-center gap-2 hover:bg-transparent">
              <Avatar className="w-8 h-8 bg-gradient-to-r from-[#5b68eb] to-[#28e1fd] border-2 border-[var(--border)]">
                <AvatarImage src={user?.photo_url} alt={user?.fullname} />
                <AvatarFallback className="text-white font-semibold text-[var(--popover-foreground)]">
                  {getInitials(user?.fullname)}
                </AvatarFallback>
              </Avatar>
              <ChevronDown className="w-4 h-4 text-[var(--muted-foreground)]" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-[var(--popover)] text-[var(--popover-foreground)] border border-[var(--border)] w-58">
            <div className="px-3 py-2 border-b border-[var(--border)]">
              <p className="text-sm font-semibold text-[var(--popover-foreground)]">{user?.fullname || "Usuário"}</p>
              <p className="text-xs text-[var(--muted-foreground)]">Email: {user?.email || "email@example.com"}</p>
              {user?.tenant_id && (
                <p className="text-xs text-[var(--muted-foreground)] mt-1">
                  ID: {user.tenant_id}
                </p>
              )}
            </div>

            <DropdownMenuItem
              onClick={handleLogout}
              className="flex items-center gap-2 cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
