import {
  Home,
  Book,
  Folder,
  LineChart,
  FileSearch,
  Smile,
  Mail,
  Settings,
  Key,
  ActivityIcon,
  CreditCard,
  Users
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useContext } from "react"
import { AuthContext } from "@/contexts/AuthContext"

const menuItems = [
  { icon: Home, label: "Dashboard", href: "/dashboard", enabled: true },
  { icon: Book, label: "Transações Nacionais", href: "/dashboard/transactions", enabled: true },
  { icon: CreditCard, label: "Transações Internacionais", href: "/dashboard/stripe", enabled: true },
  { icon: FileSearch, label: "Comercial", href: "/dashboard/comercial", enabled: true },
  { icon: LineChart, label: "Definições", href: "/dashboard/settings", enabled: true },
  { icon: Key, label: "Chaves de API", href: "/dashboard/api_key", enabled: true },
  { icon: ActivityIcon, label: "WebHooks", href: "/dashboard/webhooks", enabled: true },
  { icon: Users, label: "Clientes", href: "/dashboard/clients", enabled: true, adminOnly: true },
]

const footerIcons = [Settings]

export default function Sidebar({ closeSidebar }: { closeSidebar?: () => void }) {
  const pathname = usePathname()
  const { user } = useContext(AuthContext)
  const isAdmin = user?.user_type === "admin"

  return (
    <aside className="h-screen w-64 bg-[var(--sidebar)] text-[var(--sidebar-foreground)] flex flex-col justify-between py-6 border-r border-[var(--sidebar-border)]">
      {/* Fechar em mobile */}
      {closeSidebar && (
        <div className="flex justify-end px-4 cursor-pointer">
          <button onClick={closeSidebar} className="text-[var(--sidebar-foreground)] text-xl">×</button>
        </div>
      )}

      {/* Top section */}
      <div>
        <div className="flex flex-col items-center justify-center gap-2 mb-5  w-15 h-15 mx-auto">
          <Link href="/" onClick={closeSidebar} className="flex items-center justify-center w-full h-full">
            <img
              src="/assets/images/logo2.png"
              alt="GPay"
              className="w-auto h-auto max-w-full max-h-full object-contain"
            />
          </Link>
        </div>

        {/* Menu */}
        <nav className="space-y-2 px-6">
          {menuItems.map(({ icon: Icon, label, href, enabled, adminOnly }: any) => {
            const isActive = pathname === href

            if (adminOnly && !isAdmin) return null

            if (enabled) {
              // Item habilitado - clicável
              return (
                <Button
                  key={label}
                  variant="ghost"
                  asChild
                  className={cn(
                    "w-full justify-start gap-3 text-[var(--muted-foreground)] hover:text-[var(--sidebar-accent-foreground)] hover:bg-[var(--sidebar-accent)]",
                    isActive && "bg-[var(--sidebar-accent)] text-[var(--sidebar-accent-foreground)]"
                  )}
                  onClick={closeSidebar}
                >
                  <Link href={href}>
                    <Icon className="w-5 h-5" />
                    {label}
                  </Link>
                </Button>
              )
            } else {
              // Item desabilitado - não clicável
              return (
                <div
                  key={label}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-2 text-[var(--muted-foreground)] opacity-50 cursor-not-allowed rounded-md",
                    isActive && "bg-[var(--sidebar-accent)] text-[var(--sidebar-accent-foreground)]"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {label}
                </div>
              )
            }
          })}
        </nav>
      </div>

      {/* Footer icons */}
      <div className="flex items-center justify-evenly border-t border-[var(--sidebar-border)] pt-4 px-4">
        {footerIcons.map((Icon, i) => (
          <Button
            key={i}
            variant="ghost"
            size="icon"
            className="text-[var(--muted-foreground)] hover:text-[var(--sidebar-accent-foreground)]"
            onClick={closeSidebar}
          >
            <Icon className="w-5 h-5" />
          </Button>
        ))}
      </div>
    </aside>
  )
}