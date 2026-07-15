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
import { ChevronDown, LogOut, Menu, Search } from "lucide-react"
import ThemeSwitcher from "@/components/theme-switcher"
import { NotificationDropdown } from "@/components/notifications/NotificationDropdown"
import { useAuth } from "@/hooks/useAuth"
import { toast } from "sonner"

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
    <header className="flex items-center justify-between px-6 py-3 bg-[var(--background)] text-[var(--foreground)] border-b border-[var(--border)]">
      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar} className="lg:hidden">
          <Menu className="w-5 h-5 text-[var(--muted-foreground)] cursor-pointer" />
        </button>

        {/* Search bar */}
        <div className="hidden md:flex items-center gap-2 h-[34px] px-3 bg-[var(--secondary)] border border-[var(--border)] rounded-[var(--radius-md)] w-[280px] cursor-pointer hover:border-[var(--muted-foreground)] transition-colors">
          <Search className="w-4 h-4 text-[var(--muted-foreground)]" />
          <span className="text-sm text-[var(--muted-foreground)]">Buscar...</span>
          <kbd className="ml-auto text-[10px] text-[var(--muted-foreground)] bg-[var(--background)] border border-[var(--border)] rounded px-1.5 py-0.5 font-mono">Ctrl+K</kbd>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <ThemeSwitcher />
        <NotificationDropdown />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="p-1.5 flex items-center gap-2 hover:bg-[var(--secondary)]">
              <Avatar className="w-8 h-8 border-2 border-[var(--border)]" style={{ background: "linear-gradient(135deg, var(--accent-primary), #28E1FD)" }}>
                <AvatarImage src={user?.photo_url || user?.user_photo} alt={user?.fullname} />
                <AvatarFallback className="text-white font-semibold text-xs">
                  {getInitials(user?.fullname)}
                </AvatarFallback>
              </Avatar>
              <ChevronDown className="w-3.5 h-3.5 text-[var(--muted-foreground)]" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 rounded-[var(--radius-md)] border-[var(--border)]">
            <div className="px-3 py-2 border-b border-[var(--border)]">
              <p className="text-sm font-semibold text-[var(--foreground)]">{user?.fullname || "Usuário"}</p>
              <p className="text-xs text-[var(--muted-foreground)]">{user?.email || "email@example.com"}</p>
            </div>

            <DropdownMenuItem
              onClick={handleLogout}
              className="flex items-center gap-2 cursor-pointer text-[var(--danger)] focus:text-[var(--danger)] focus:bg-[var(--danger-subtle)]"
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
