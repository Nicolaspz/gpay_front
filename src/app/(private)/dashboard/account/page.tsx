'use client'

import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CardStat } from "@/components/dashboard/CardStat"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog"
import { FiDollarSign, FiArrowUp, FiCheckCircle, FiFilter, FiX } from "react-icons/fi"
import { Wallet, Plus, Loader2 } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { useStripeData } from "@/hooks/useStripeData"
import { useWithdrawalValidation } from "@/hooks/useWithdrawalValidation"
import { useClientBalanceByCurrency } from "@/hooks/useClientBalanceByCurrency"

type ActivityType = "saque" | "deposito" | "recebimento" | "taxa"

type Activity = {
  id: string
  type: ActivityType
  description: string
  amount: number
  currency: string
  status: "concluido" | "pendente" | "falhou"
  createdAt: string
}

const mockActivities: Activity[] = [
  { id: "1", type: "recebimento", description: "Pagamento recebido - Cliente João Silva", amount: 150000, currency: "AOA", status: "concluido", createdAt: "2026-06-15T14:30:00" },
  { id: "2", type: "saque", description: "Saque para conta bancária - BIC", amount: 50000, currency: "AOA", status: "concluido", createdAt: "2026-06-14T09:15:00" },
  { id: "3", type: "recebimento", description: "Pagamento recebido - Cliente Maria Santos", amount: 25000, currency: "AOA", status: "concluido", createdAt: "2026-06-13T16:45:00" },
  { id: "4", type: "taxa", description: "Taxa de processamento - Ref: TX-2026-001", amount: 1250, currency: "AOA", status: "concluido", createdAt: "2026-06-13T16:45:00" },
  { id: "5", type: "saque", description: "Saque para conta bancária - BFA", amount: 100000, currency: "AOA", status: "pendente", createdAt: "2026-06-12T11:20:00" },
  { id: "6", type: "recebimento", description: "Pagamento recebido - Cliente Pedro Alves", amount: 75000, currency: "AOA", status: "concluido", createdAt: "2026-06-11T10:00:00" },
  { id: "7", type: "saque", description: "Saque para conta bancária - BAI", amount: 30000, currency: "AOA", status: "falhou", createdAt: "2026-06-10T08:30:00" },
  { id: "8", type: "deposito", description: "Depósito de crédito - Recarga", amount: 200000, currency: "AOA", status: "concluido", createdAt: "2026-06-09T15:10:00" },
  { id: "9", type: "recebimento", description: "Pagamento recebido - Cliente Ana Costa", amount: 50000, currency: "AOA", status: "concluido", createdAt: "2026-06-08T12:25:00" },
  { id: "10", type: "taxa", description: "Taxa mensal de manutenção", amount: 5000, currency: "AOA", status: "concluido", createdAt: "2026-06-01T00:00:00" },
  { id: "11", type: "saque", description: "Saque para conta bancária - BIC", amount: 25000, currency: "AOA", status: "concluido", createdAt: "2026-05-28T14:00:00" },
  { id: "12", type: "recebimento", description: "Pagamento recebido - Cliente Carlos Mendes", amount: 120000, currency: "AOA", status: "concluido", createdAt: "2026-05-25T09:30:00" },
]

const typeLabels: Record<ActivityType, string> = {
  saque: "Saque",
  deposito: "Depósito",
  recebimento: "Recebimento",
  taxa: "Taxa",
}

const typeColors: Record<ActivityType, string> = {
  saque: "text-[var(--danger)]",
  deposito: "text-[var(--accent-primary)]",
  recebimento: "text-[var(--success)]",
  taxa: "text-[var(--warning)]",
}

const statusLabels: Record<string, string> = {
  concluido: "Concluído",
  pendente: "Pendente",
  falhou: "Falhou",
}

export default function AccountPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoadingUser } = useAuth()
  const isAdmin = user?.user_type === "admin"
  const { clientBalances: balances, isLoadingBalance: loadingBalance } = useStripeData()

  useEffect(() => {
    if (!isLoadingUser && isAuthenticated && isAdmin) {
      router.replace("/dashboard")
    }
  }, [isLoadingUser, isAuthenticated, isAdmin, router])

  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [typeFilter, setTypeFilter] = useState<ActivityType | "todas">("todas")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  const saldo = balances.length > 0 ? balances[0].balance : 0
  const totalSaque = 205000
  const totalRecebido = 420000

  const filteredActivities = useMemo(() => {
    return mockActivities.filter((a) => {
      if (typeFilter !== "todas" && a.type !== typeFilter) return false
      if (!startDate && !endDate) return true
      const date = new Date(a.createdAt).getTime()
      const start = startDate ? new Date(startDate).getTime() : 0
      const end = endDate ? new Date(endDate).getTime() + 86400000 : Infinity
      return date >= start && date <= end
    })
  }, [typeFilter, startDate, endDate])

  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage)
  const paginatedActivities = filteredActivities.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const formatKz = (v: number) =>
    v.toLocaleString("pt-AO", { style: "currency", currency: "AOA" })

  const [selectedCurrency, setSelectedCurrency] = useState("usd")
  const { balance: currencyBalance, isLoading: loadingCurrencyBalance } = useClientBalanceByCurrency(user?.id || "", selectedCurrency)

  const [withdrawOpen, setWithdrawOpen] = useState(false)
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [withdrawCurrency, setWithdrawCurrency] = useState("usd")
  const { validate, isValidating, validationResult, validationError, reset } = useWithdrawalValidation(user?.id || "")

  const handleWithdrawValidation = () => {
    if (!withdrawAmount) return
    validate({ amount: Number(withdrawAmount), currency: withdrawCurrency })
  }

  if (isLoadingUser || isAdmin) {
    return null
  }

  const balanceCurrency = balances.length > 0 ? balances[0].currency : "AOA"
  const formatBalance = (v: number) => {
    // Verifica se v é undefined, null ou não é um número
    if (v === undefined || v === null || isNaN(v)) {
      return `0,00 ${balanceCurrency === 'AOA' ? 'Kz' : balanceCurrency}`
    }
    return v.toLocaleString("pt-AO", { style: "currency", currency: balanceCurrency })
  }
  return (
    <div className="p-6 space-y-6 bg-[var(--background)] min-h-screen">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Minha Conta</h1>
        <p className="text-sm text-[var(--muted-foreground)]">
          Gerencie seu saldo, saques e consulte o histórico de atividades
        </p>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm text-[var(--muted-foreground)]">Consultar saldo por moeda:</label>
        <select
          value={selectedCurrency}
          onChange={(e) => setSelectedCurrency(e.target.value)}
          className="px-3 py-1.5 text-sm bg-[var(--muted)] border border-[var(--border)] rounded-lg outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/40 focus:border-[var(--accent-primary)] text-[var(--foreground)]"
        >
          <option value="usd">USD</option>
          <option value="aoa">AOA</option>
          <option value="eur">EUR</option>
        </select>
        {loadingCurrencyBalance && <Loader2 className="w-4 h-4 text-[var(--accent-primary)] animate-spin" />}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <CardStat
          title="Meu Saldo"
          amount={loadingBalance ? "0,00 Kz" : formatBalance(saldo)}
          change=""
          icon={loadingBalance ? <Loader2 className="w-5 h-5 text-[var(--accent-primary)] animate-spin" /> : <Wallet className="w-5 h-5 text-[var(--accent-primary)]" />}
        />
        <CardStat
          title={`Saldo (${selectedCurrency.toUpperCase()})`}
          amount={loadingCurrencyBalance ? "..." : currencyBalance ? `${currencyBalance.balance.toLocaleString("pt-AO")} ${selectedCurrency.toUpperCase()}` : "—"}
          change=""
          icon={<FiDollarSign className="text-[var(--info)]" />}
        />
        <CardStat
          title="Total de Saques"
          amount={formatKz(totalSaque)}
          change=""
          icon={<FiArrowUp className="text-[var(--danger)]" />}
        />
        <CardStat
          title="Total Recebido"
          amount={formatKz(totalRecebido)}
          change=""
          icon={<FiCheckCircle className="text-[var(--success)]" />}
        />
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <Dialog open={withdrawOpen} onOpenChange={(open) => { setWithdrawOpen(open); if (!open) reset() }}>
          <DialogTrigger asChild>
            <button className="px-4 py-2 bg-[var(--accent-primary)] hover:opacity-90 text-white rounded-lg text-sm font-medium flex items-center gap-2">
              <FiDollarSign /> Fazer Saque
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Validar Saque</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <label className="text-sm font-medium text-[var(--foreground)]">Montante</label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="10.00"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-[var(--foreground)]">Moeda</label>
                <select
                  value={withdrawCurrency}
                  onChange={(e) => setWithdrawCurrency(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-[var(--muted)] border border-[var(--border)] rounded-lg outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/40 focus:border-[var(--accent-primary)] text-[var(--foreground)]"
                >
                  <option value="usd">USD</option>
                  <option value="aoa">AOA</option>
                </select>
              </div>
              <Button
                onClick={handleWithdrawValidation}
                disabled={isValidating || !withdrawAmount}
                className="w-full"
              >
                {isValidating ? "A validar..." : "Validar Saque"}
              </Button>

              {validationResult && (
                <div className={`p-3 rounded-lg text-sm ${validationResult.valid ? "bg-[var(--success-subtle)] text-[var(--success)]" : "bg-[var(--danger-subtle)] text-[var(--danger)]"}`}>
                  {validationResult.valid ? (
                    <div className="flex items-center gap-2">
                      <FiCheckCircle className="h-4 w-4" />
                      <span>Saldo suficiente! Pode prosseguir com o saque.</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <FiX className="h-4 w-4" />
                      <span>{validationResult.message || "Saldo insuficiente para este saque."}</span>
                    </div>
                  )}
                  <div className="mt-2 text-xs text-[var(--muted-foreground)]">
                    Saldo atual: {formatKz(validationResult.current_balance)} &bull; Solicitado: {formatKz(validationResult.requested_amount)}
                  </div>
                </div>
              )}

              {validationError && (
                <p className="text-sm text-[var(--danger)] text-center">Erro ao validar saque. Tente novamente.</p>
              )}
            </div>
          </DialogContent>
        </Dialog>

        <button className="px-4 py-2 bg-[var(--muted)] text-[var(--foreground)] rounded-lg text-sm font-medium flex items-center gap-2">
          <Plus /> Solicitar Aumento de Limite
        </button>
      </div>

      <Card className="p-5 bg-[var(--card)] border-0 rounded-xl shadow-sm">
        <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">Histórico de Atividades</h2>

        <div className="bg-[var(--muted)] p-4 rounded-xl flex flex-wrap items-end gap-4 border border-[var(--border)] mb-4">
          <div>
            <label className="block text-xs font-medium text-[var(--muted-foreground)] mb-1">Início</label>
            <input type="date" value={startDate} onChange={(e) => { setStartDate(e.target.value); setCurrentPage(1) }} className="bg-[var(--card)] border border-[var(--border)] rounded-md px-3 py-2 text-sm outline-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--muted-foreground)] mb-1">Fim</label>
            <input type="date" value={endDate} onChange={(e) => { setEndDate(e.target.value); setCurrentPage(1) }} className="bg-[var(--card)] border border-[var(--border)] rounded-md px-3 py-2 text-sm outline-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--muted-foreground)] mb-1">Tipo</label>
            <select value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value as ActivityType | "todas"); setCurrentPage(1) }} className="bg-[var(--card)] border border-[var(--border)] rounded-md px-3 py-2 text-sm outline-none">
              <option value="todas">Todas</option>
              <option value="recebimento">Recebimentos</option>
              <option value="saque">Saques</option>
              <option value="deposito">Depósitos</option>
              <option value="taxa">Taxas</option>
            </select>
          </div>
          <button onClick={() => { setStartDate(""); setEndDate(""); setTypeFilter("todas"); setCurrentPage(1) }} className="px-4 py-2 bg-[var(--muted)] text-[var(--foreground)] rounded-lg text-xs font-medium">
            <FiFilter className="inline mr-1" /> Limpar
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="text-left text-sm text-[var(--muted-foreground)] border-b border-[var(--border)]">
              <tr>
                <th className="pb-3 px-4">Tipo</th>
                <th className="pb-3 px-4">Descrição</th>
                <th className="pb-3 px-4">Valor</th>
                <th className="pb-3 px-4">Estado</th>
                <th className="pb-3 px-4">Data</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {paginatedActivities.map((a) => (
                <tr key={a.id} className="hover:bg-[var(--muted)]">
                  <td className="py-4 px-4">
                    <span className={`text-sm font-medium ${typeColors[a.type]}`}>
                      {typeLabels[a.type]}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm text-[var(--foreground)] max-w-xs truncate">
                    {a.description}
                  </td>
                  <td className="py-4 px-4 text-sm font-semibold">
                    {formatKz(a.amount)}
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-0.5 text-[10px] rounded-full font-bold ${
                      a.status === "concluido" ? "bg-[var(--success-subtle)] text-[var(--success)]" :
                      a.status === "pendente" ? "bg-[var(--warning-subtle)] text-[var(--warning)]" :
                      "bg-[var(--danger-subtle)] text-[var(--danger)]"
                    }`}>
                      {statusLabels[a.status]}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm text-[var(--muted-foreground)]">
                    {new Date(a.createdAt).toLocaleString("pt-PT")}
                  </td>
                </tr>
              ))}
              {paginatedActivities.length === 0 && (
                <tr><td colSpan={5} className="py-10 text-center text-[var(--muted-foreground)]">Nenhuma atividade encontrada.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center bg-[var(--muted)] p-4 rounded-xl border border-[var(--border)] mt-4">
          <p className="text-sm text-[var(--muted-foreground)]">
            Mostrando <strong>{paginatedActivities.length}</strong> de <strong>{filteredActivities.length}</strong> atividades
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-[var(--card)] border border-[var(--border)] rounded-lg text-sm disabled:opacity-50"
            >
              Anterior
            </button>
            <div className="flex items-center px-4 text-sm font-medium">
              Página {currentPage} de {totalPages || 1}
            </div>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-4 py-2 bg-[var(--card)] border border-[var(--border)] rounded-lg text-sm disabled:opacity-50"
            >
              Próximo
            </button>
          </div>
        </div>
      </Card>
    </div>
  )
}
