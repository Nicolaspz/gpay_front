"use client"

import {
  Home,
  Book,
  LineChart,
  FileSearch,
  Settings,
  Key,
  ActivityIcon,
  CreditCard,
  Users,
  ScrollText,
  User,
  Wallet,
  PiggyBank,
  Webhook,
  Circle
} from "lucide-react"

import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import type { MenuItem } from "@/types/global"
import Image from "next/image"

const mainItems: MenuItem[] = [
  { icon: Home, label: "Visão Geral", href: "/dashboard", enabled: true },
  { icon: User, label: "Perfil", href: "/dashboard/profile", enabled: true },
]

const financeItems: MenuItem[] = [
  { icon: Book, label: "Transações Nacionais", href: "/dashboard/transactions", enabled: true },
  { icon: CreditCard, label: "Transações Internacionais", href: "/dashboard/stripe", enabled: true },
]

const commercialItems: MenuItem[] = [
  { icon: FileSearch, label: "Comercial", href: "/dashboard/comercial", enabled: true },
]

const settingsItems: MenuItem[] = [
  { icon: LineChart, label: "Definições", href: "/dashboard/settings", enabled: true },
  { icon: Key, label: "Chaves API", href: "/dashboard/api_key", enabled: true },
  { icon: ActivityIcon, label: "WebHooks", href: "/dashboard/webhooks", enabled: true },
  { icon: Users, label: "Clientes", href: "/dashboard/clients", enabled: true, adminOnly: true },
  { icon: Wallet, label: "Fundo PayPay", href: "/dashboard/paypay", enabled: true, adminOnly: true },
  { icon: PiggyBank, label: "Saldos", href: "/dashboard/balances", enabled: true, adminOnly: true },
  { icon: Webhook, label: "Simular Webhook", href: "/dashboard/webhook-test", enabled: true, adminOnly: true },
  { icon: ScrollText, label: "Logs", href: "/dashboard/logs", enabled: true, adminOnly: true },
]

function SidebarSection({ label }: { label: string }) {
  return (
    <div className="px-3 pt-4 pb-1">
      <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--muted-foreground)]">
        {label}
      </span>
    </div>
  )
}

function SidebarItem({
  icon: Icon,
  label,
  href,
  isActive,
  onClick,
  adminOnly,
  isAdmin,
}: {
  icon: React.ElementType
  label: string
  href: string
  isActive: boolean
  onClick?: () => void
  adminOnly?: boolean
  isAdmin?: boolean
}) {
  if (adminOnly && !isAdmin) return null

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-2.5 px-3 py-2 mx-2 rounded-[var(--radius-md)] text-[13px] font-medium transition-all duration-150",
        isActive
          ? "bg-[var(--accent-primary-subtle)] text-[var(--accent-primary)]"
          : "text-[var(--muted-foreground)] hover:bg-[var(--secondary)] hover:text-[var(--foreground)]"
      )}
    >
      <Icon className={cn("w-[18px] h-[18px] shrink-0", isActive && "text-[var(--accent-primary)]")} />
      {label}
    </Link>
  )
}

export default function Sidebar({ closeSidebar }: { closeSidebar?: () => void }) {
  const pathname = usePathname()
  const { user } = useAuth()
  const isAdmin = user?.user_type === "admin"

  return (
    <aside className="h-screen w-60 bg-[var(--sidebar)] text-[var(--sidebar-foreground)] flex flex-col justify-between border-r border-[var(--border)]">
      {/* Close on mobile */}
      {closeSidebar && (
        <div className="flex justify-end px-3 pt-3 cursor-pointer lg:hidden">
          <button onClick={closeSidebar} className="text-[var(--muted-foreground)] text-xl leading-none">&times;</button>
        </div>
      )}

      {/* Top section */}
      <div className="flex-1 overflow-y-auto">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 pb-4 pt-8">
          <Link href="/" onClick={closeSidebar} className="flex">
            <Image src="/assets/images/gpa.png" alt="Logo" width={100} height={100} className="w-full" />
          </Link>
        </div>

        {/* Main navigation */}
        <nav className="mt-1">
          <SidebarSection label="Principal" />
          {mainItems.map((item) => (
            <SidebarItem
              key={item.href}
              {...item}
              isActive={pathname === item.href}
              onClick={closeSidebar}
              isAdmin={isAdmin}
            />
          ))}

          <SidebarSection label="Financeiro" />
          {financeItems.map((item) => (
            <SidebarItem
              key={item.href}
              {...item}
              isActive={pathname === item.href}
              onClick={closeSidebar}
              isAdmin={isAdmin}
            />
          ))}

          <SidebarSection label="Comercial" />
          {commercialItems.map((item) => (
            <SidebarItem
              key={item.href}
              {...item}
              isActive={pathname === item.href}
              onClick={closeSidebar}
              isAdmin={isAdmin}
            />
          ))}

          <SidebarSection label="Sistema" />
          {settingsItems.map((item) => (
            <SidebarItem
              key={item.href}
              {...item}
              isActive={pathname === item.href}
              onClick={closeSidebar}
              isAdmin={isAdmin}
            />
          ))}
        </nav>
      </div>

      {/* Footer — System status */}
      <div className="border-t border-[var(--border)] px-4 py-3">
        <div className="flex items-center gap-2">
          <Circle className="w-2 h-2 fill-[var(--success)] text-[var(--success)] animate-pulse-dot" />
          <span className="text-[11px] text-[var(--muted-foreground)]">Sistema operacional</span>
        </div>
      </div>
    </aside>
  )
}
