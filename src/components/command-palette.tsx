"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import {
  LayoutDashboard,
  ArrowLeftRight,
  Globe,
  Settings,
  KeyRound,
  Webhook,
  Users,
  Wallet,
  BarChart3,
  FileText,
  User,
  Activity,
  Building2,
  CreditCard,
} from "lucide-react"

interface CommandItem {
  label: string
  href: string
  icon: React.ReactNode
  group: string
}

const pages: CommandItem[] = [
  { label: "Visão Geral", href: "/dashboard", icon: <LayoutDashboard className="h-4 w-4" />, group: "Principal" },
  { label: "Perfil", href: "/dashboard/profile", icon: <User className="h-4 w-4" />, group: "Principal" },
  { label: "Minha Conta", href: "/dashboard/account", icon: <Wallet className="h-4 w-4" />, group: "Financeiro" },
  { label: "Saldos", href: "/dashboard/balances", icon: <CreditCard className="h-4 w-4" />, group: "Financeiro" },
  { label: "Transações Nacionais", href: "/dashboard/transactions", icon: <ArrowLeftRight className="h-4 w-4" />, group: "Financeiro" },
  { label: "Pagamentos Internacionais", href: "/dashboard/stripe", icon: <Globe className="h-4 w-4" />, group: "Financeiro" },
  { label: "PayPay Fundo", href: "/dashboard/paypay", icon: <Wallet className="h-4 w-4" />, group: "Financeiro" },
  { label: "Comercial", href: "/dashboard/comercial", icon: <Building2 className="h-4 w-4" />, group: "Comercial" },
  { label: "Relatórios", href: "/dashboard/relatory", icon: <BarChart3 className="h-4 w-4" />, group: "Comercial" },
  { label: "Definições", href: "/dashboard/settings", icon: <Settings className="h-4 w-4" />, group: "Sistema" },
  { label: "Chaves API", href: "/dashboard/api_key", icon: <KeyRound className="h-4 w-4" />, group: "Sistema" },
  { label: "Webhooks", href: "/dashboard/webhooks", icon: <Webhook className="h-4 w-4" />, group: "Sistema" },
  { label: "Simular Webhook", href: "/dashboard/webhook-test", icon: <Webhook className="h-4 w-4" />, group: "Sistema" },
  { label: "Clientes", href: "/dashboard/clients", icon: <Users className="h-4 w-4" />, group: "Sistema" },
  { label: "Membros", href: "/dashboard/members", icon: <Users className="h-4 w-4" />, group: "Sistema" },
  { label: "Logs do Sistema", href: "/dashboard/logs", icon: <Activity className="h-4 w-4" />, group: "Sistema" },
]

const groups = [...new Set(pages.map((p) => p.group))]

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const handleSelect = useCallback(
    (href: string) => {
      setOpen(false)
      router.push(href)
    },
    [router],
  )

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Pesquisar páginas..." />
      <CommandList>
        <CommandEmpty>Nenhuma página encontrada.</CommandEmpty>
        {groups.map((group) => (
          <CommandGroup key={group} heading={group}>
            {pages
              .filter((p) => p.group === group)
              .map((page) => (
                <CommandItem
                  key={page.href}
                  value={page.label}
                  onSelect={() => handleSelect(page.href)}
                  className="cursor-pointer"
                >
                  {page.icon}
                  <span className="ml-2">{page.label}</span>
                </CommandItem>
              ))}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  )
}
