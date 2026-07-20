'use client'
import { FiCheckCircle, FiDollarSign, FiFilter, FiCreditCard, FiSearch, FiX, FiUsers } from "react-icons/fi";
import { useState, useMemo } from "react";
import { CardStat } from "@/components/dashboard/CardStat";
import { Card } from "@/components/ui/card";
import { useStripeData } from "@/hooks/useStripeData";
import { useTransactionSummary } from "@/hooks/useTransactionSummary";
import type { StripeTransaction } from "@/types/stripe";

const statusOptions = ["COMPLETED", "PENDING", "FAILED", "CANCELLED", "REFUNDED"] as const;
const currencyOptions = ["USD", "AOA"] as const;

export default function AdminStripeDashboard() {
  const { newTransactions, stats, isAdmin, isLoading } = useStripeData();
  const { adminClients, isLoadingAdminClients, userSummary, isLoadingUserSummary } = useTransactionSummary();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currencyFilter, setCurrencyFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);
  const [clientsPage, setClientsPage] = useState(1);
  const itemsPerPage = 10;
  const clientsPerPage = 12;

  const filtered = useMemo(() => {
    return newTransactions.filter((tx) => {
      if (search) {
        const q = search.toLowerCase();
        const matchId = String(tx.id).includes(q);
        const matchInternal = tx.internalTransactionId?.toLowerCase().includes(q);
        const matchUserId = tx.userId?.toLowerCase().includes(q);
        const matchName = tx.fullname?.toLowerCase().includes(q);
        if (!matchId && !matchInternal && !matchUserId && !matchName) return false;
      }
      if (statusFilter && tx.status !== statusFilter) return false;
      if (currencyFilter && tx.currency !== currencyFilter) return false;
      if (startDate && tx.createdAt) {
        const txDate = new Date(tx.createdAt);
        const start = new Date(startDate);
        if (txDate < start) return false;
      }
      if (endDate && tx.createdAt) {
        const txDate = new Date(tx.createdAt);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        if (txDate > end) return false;
      }
      return true;
    });
  }, [newTransactions, search, statusFilter, currencyFilter, startDate, endDate]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedTx = filtered.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("");
    setCurrencyFilter("");
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  const hasFilters = search || statusFilter || currencyFilter || startDate || endDate;

  const clientsTotalPages = Math.ceil(adminClients.length / clientsPerPage);
  const paginatedClients = adminClients.slice(
    (clientsPage - 1) * clientsPerPage,
    clientsPage * clientsPerPage
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[var(--muted-foreground)]">A carregar transações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col mb-2">
        <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)] mb-2">
          Pagamentos Internacionais
        </h1>
        <p className="text-[var(--muted-foreground)] text-sm">
          {isAdmin
            ? "Gestão global de transações e liquidações internacionais."
            : "Visualize o histórico de suas vendas e recebimentos internacionais."}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <CardStat title="Total Transações" amount={stats.count.toString()} change="" icon={<FiCreditCard />} />
        <CardStat
          title="USD Processado"
          amount={stats.totalGrossUSD.toLocaleString("en-US", { style: "currency", currency: "USD" })}
          change=""
          icon={<FiDollarSign className="text-[var(--accent-primary)]" />}
        />
        <CardStat
          title="AOA Processado"
          amount={stats.totalGrossAOA.toLocaleString("pt-AO", { style: "currency", currency: "AOA" })}
          change=""
          icon={<FiDollarSign className="text-[var(--warning)]" />}
        />
        <CardStat
          title="Bruto Processado"
          amount={stats.totalGross.toLocaleString("en-US", { style: "currency", currency: "USD" })}
          change=""
          icon={<FiCreditCard />}
        />
        <CardStat
          title="Líquido Total"
          amount={stats.totalNet.toLocaleString("en-US", { style: "currency", currency: "USD" })}
          change=""
          icon={<FiCheckCircle className="text-[var(--success)]" />}
        />
      </div>

      {isAdmin && (
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <FiUsers className="h-5 w-5 text-[var(--accent-primary)]" />
            <h2 className="text-lg font-semibold text-[var(--foreground)]">Resumo de Clientes</h2>
          </div>
          {isLoadingAdminClients ? (
            <div className="flex justify-center py-4">
              <div className="w-6 h-6 border-4 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : adminClients.length === 0 ? (
            <p className="text-sm text-[var(--muted-foreground)] text-center py-4">Nenhum cliente encontrado.</p>
          ) : (
            <div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[var(--muted)] border-b border-[var(--border)]">
                      <th className="p-3 font-medium text-[var(--muted-foreground)] text-xs">Cliente</th>
                      <th className="p-3 font-medium text-[var(--muted-foreground)] text-xs">Email</th>
                      <th className="p-3 font-medium text-[var(--muted-foreground)] text-xs">Transações</th>
                      <th className="p-3 font-medium text-[var(--muted-foreground)] text-xs">Bruto Total</th>
                      <th className="p-3 font-medium text-[var(--muted-foreground)] text-xs">Líquido Total</th>
                      <th className="p-3 font-medium text-[var(--muted-foreground)] text-xs">Moeda</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedClients.map((c, idx) => (
                      <tr key={c.userId || idx} className="border-b border-[var(--border)] hover:bg-[var(--muted)] transition">
                        <td className="p-3 text-xs font-medium text-[var(--foreground)]">{c.fullname || c.userId?.slice(0, 12) || "—"}</td>
                        <td className="p-3 text-xs text-[var(--muted-foreground)]">{c.email || "—"}</td>
                        <td className="p-3 text-xs text-[var(--foreground)]">{c.totalTransactions}</td>
                        <td className="p-3 text-xs text-[var(--foreground)]">
                          {(c.totalGrossAmount || 0).toLocaleString("en-US", { style: "currency", currency: c.currency || "USD" })}
                        </td>
                        <td className="p-3 text-xs font-semibold text-[var(--success)]">
                          {(c.totalNetAmount || 0).toLocaleString("en-US", { style: "currency", currency: c.currency || "USD" })}
                        </td>
                        <td className="p-3 text-xs font-bold">{c.currency || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {clientsTotalPages > 1 && (
                <div className="flex items-center justify-between px-3 py-3 border-t border-[var(--border)]">
                  <p className="text-xs text-[var(--muted-foreground)]">
                    A mostrar <strong>{paginatedClients.length}</strong> de <strong>{adminClients.length}</strong> clientes
                  </p>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setClientsPage(1)}
                      disabled={clientsPage === 1}
                      className="px-2 py-1 text-xs border border-[var(--border)] rounded disabled:opacity-40 hover:bg-[var(--muted)] transition-colors"
                    >
                      «
                    </button>
                    <button
                      onClick={() => setClientsPage((p) => Math.max(p - 1, 1))}
                      disabled={clientsPage === 1}
                      className="px-2 py-1 text-xs border border-[var(--border)] rounded disabled:opacity-40 hover:bg-[var(--muted)] transition-colors"
                    >
                      ‹
                    </button>
                    {Array.from({ length: clientsTotalPages }, (_, i) => i + 1)
                      .filter((p) => {
                        if (clientsTotalPages <= 7) return true;
                        if (p === 1 || p === clientsTotalPages) return true;
                        if (Math.abs(p - clientsPage) <= 1) return true;
                        return false;
                      })
                      .reduce<(number | "...")[]>((acc, p, i, arr) => {
                        if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("...");
                        acc.push(p);
                        return acc;
                      }, [])
                      .map((p, i) =>
                        p === "..." ? (
                          <span key={`dots-${i}`} className="px-1 text-xs text-[var(--muted-foreground)]">…</span>
                        ) : (
                          <button
                            key={p}
                            onClick={() => setClientsPage(p as number)}
                            className={`px-2.5 py-1 text-xs rounded transition-colors ${
                              clientsPage === p
                                ? "bg-[var(--accent-primary)] text-white font-medium"
                                : "border border-[var(--border)] hover:bg-[var(--muted)]"
                            }`}
                          >
                            {p}
                          </button>
                        )
                      )}
                    <button
                      onClick={() => setClientsPage((p) => Math.min(p + 1, clientsTotalPages))}
                      disabled={clientsPage === clientsTotalPages}
                      className="px-2 py-1 text-xs border border-[var(--border)] rounded disabled:opacity-40 hover:bg-[var(--muted)] transition-colors"
                    >
                      ›
                    </button>
                    <button
                      onClick={() => setClientsPage(clientsTotalPages)}
                      disabled={clientsPage === clientsTotalPages}
                      className="px-2 py-1 text-xs border border-[var(--border)] rounded disabled:opacity-40 hover:bg-[var(--muted)] transition-colors"
                    >
                      »
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </Card>
      )}

      {!isAdmin && userSummary && (
        <Card className="p-5">
          <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">Resumo da Minha Conta</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-[var(--muted-foreground)]">Total Bruto</p>
              <p className="text-lg font-bold text-[var(--foreground)]">
                {(userSummary.totalGrossAmount || 0).toLocaleString("en-US", { style: "currency", currency: userSummary.currency || "USD" })}
              </p>
            </div>
            <div>
              <p className="text-xs text-[var(--muted-foreground)]">Total Líquido</p>
              <p className="text-lg font-bold text-[var(--success)]">
                {(userSummary.totalNetAmount || 0).toLocaleString("en-US", { style: "currency", currency: userSummary.currency || "USD" })}
              </p>
            </div>
            <div>
              <p className="text-xs text-[var(--muted-foreground)]">Pendente de Pagamento</p>
              <p className="text-lg font-bold text-[var(--warning)]">
                {(userSummary.totalPendingPayoutAmount || 0).toLocaleString("en-US", { style: "currency", currency: userSummary.currency || "USD" })}
              </p>
            </div>
            <div>
              <p className="text-xs text-[var(--muted-foreground)]">Total Pago</p>
              <p className="text-lg font-bold text-[var(--accent-primary)]">
                {(userSummary.totalPaidOutAmount || 0).toLocaleString("en-US", { style: "currency", currency: userSummary.currency || "USD" })}
              </p>
            </div>
          </div>
        </Card>
      )}

      <div className="bg-[var(--card)] rounded-lg shadow-sm overflow-hidden border border-[var(--border)]">
        <div className="p-4 border-b border-[var(--border)]">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-[200px] flex-1 max-w-xs">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] h-4 w-4" />
              <input
                type="text"
                placeholder="Pesquisar por nome, ID, transação..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="w-full pl-9 pr-3 py-2 text-sm bg-[var(--muted)] border border-[var(--border)] rounded-lg outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/40 focus:border-[var(--accent-primary)] text-gray-900 dark:text-gray-100 placeholder-gray-400"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="px-3 py-2 text-sm bg-[var(--muted)] border border-[var(--border)] rounded-lg outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/40 focus:border-[var(--accent-primary)] text-[var(--foreground)]"
            >
              <option value="">Todos os estados</option>
              {statusOptions.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            <select
              value={currencyFilter}
              onChange={(e) => { setCurrencyFilter(e.target.value); setPage(1); }}
              className="px-3 py-2 text-sm bg-[var(--muted)] border border-[var(--border)] rounded-lg outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/40 focus:border-[var(--accent-primary)] text-[var(--foreground)]"
            >
              <option value="">Todas as moedas</option>
              {currencyOptions.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <div className="flex items-center gap-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => { setStartDate(e.target.value); setPage(1); }}
                className="px-3 py-2 text-sm bg-[var(--muted)] border border-[var(--border)] rounded-lg outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/40 focus:border-[var(--accent-primary)] text-[var(--foreground)]"
              />
              <span className="text-[var(--muted-foreground)] text-xs">—</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => { setEndDate(e.target.value); setPage(1); }}
                className="px-3 py-2 text-sm bg-[var(--muted)] border border-[var(--border)] rounded-lg outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/40 focus:border-[var(--accent-primary)] text-[var(--foreground)]"
              />
            </div>

            {hasFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1.5 px-3 py-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] bg-[var(--muted)] border border-[var(--border)] rounded-lg hover:bg-[var(--muted)] transition-colors"
              >
                <FiX className="h-4 w-4" />
                Limpar
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--border)] bg-[var(--muted)]">
          <h2 className="text-sm font-semibold text-[var(--foreground)]">
            {isAdmin ? "Todas as Transações" : "Minhas Transações"}
          </h2>
          <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
            <FiFilter className="h-3.5 w-3.5" />
            {hasFilters ? (
              <span><strong>{filtered.length}</strong> de <strong>{newTransactions.length}</strong> resultados</span>
            ) : (
              <span><strong>{newTransactions.length}</strong> resultados</span>
            )}
          </div>
        </div>

        <div className="overflow-x-auto relative">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--muted)] border-b border-[var(--border)]">
                <th className="p-4 font-medium text-[var(--muted-foreground)] text-xs">ID</th>
                <th className="p-4 font-medium text-[var(--muted-foreground)] text-xs">Transação Interna</th>
                {isAdmin && <th className="p-4 font-medium text-[var(--muted-foreground)] text-xs">User ID</th>}
                {isAdmin && <th className="p-4 font-medium text-[var(--muted-foreground)] text-xs">Nome</th>}
                <th className="p-4 font-medium text-[var(--muted-foreground)] text-xs">Montante</th>
                <th className="p-4 font-medium text-[var(--muted-foreground)] text-xs">Bruto</th>
                <th className="p-4 font-medium text-[var(--muted-foreground)] text-xs">Taxa</th>
                <th className="p-4 font-medium text-[var(--muted-foreground)] text-xs">Líquido</th>
                <th className="p-4 font-medium text-[var(--muted-foreground)] text-xs">Moeda</th>
                <th className="p-4 font-medium text-[var(--muted-foreground)] text-xs">Estado</th>
                <th className="p-4 font-medium text-[var(--muted-foreground)] text-xs">Data</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTx.map((tx: StripeTransaction, idx: number) => (
                <tr key={`${tx.id}-${tx.internalTransactionId}-${idx}`} className="border-b border-[var(--border)] hover:bg-[var(--muted)] transition">
                  <td className="p-4 text-xs font-mono text-[var(--foreground)]">{tx.id}</td>
                  <td className="p-4 text-xs font-mono text-[var(--muted-foreground)]">{tx.internalTransactionId}</td>
                  {isAdmin && (
                    <td className="p-4 text-xs text-[var(--muted-foreground)] font-mono">{tx.userId?.slice(0, 8)}...</td>
                  )}
                  {isAdmin && (
                    <td className="p-4 text-xs text-[var(--foreground)] font-medium">{tx.fullname || "—"}</td>
                  )}
                  <td className="p-4 text-xs font-medium text-[var(--foreground)]">
                    {(tx.amount || 0).toLocaleString("en-US", { style: "currency", currency: tx.currency || "USD" })}
                  </td>
                  <td className="p-4 text-xs text-[var(--foreground)]">
                    {(tx.grossAmount || 0).toLocaleString("en-US", { style: "currency", currency: tx.currency || "USD" })}
                  </td>
                  <td className="p-4 text-xs text-[var(--danger)]">
                    {(tx.feeAmount || 0).toLocaleString("en-US", { style: "currency", currency: tx.currency || "USD" })}
                  </td>
                  <td className="p-4 text-xs font-semibold text-[var(--success)]">
                    {(tx.netAmount || 0).toLocaleString("en-US", { style: "currency", currency: tx.currency || "USD" })}
                  </td>
                  <td className="p-4 text-xs font-bold">{tx.currency || "—"}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 text-[10px] rounded-full font-bold ${tx.status === 'COMPLETED' ? 'bg-[var(--success-subtle)] text-[var(--success)]' : 'bg-[var(--warning-subtle)] text-[var(--warning)]'}`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="p-4 text-xs text-[var(--muted-foreground)]">
                    {tx.createdAt ? new Date(tx.createdAt).toLocaleString() : "—"}
                  </td>
                </tr>
              ))}
              {paginatedTx.length === 0 && (
                <tr><td colSpan={isAdmin ? 11 : 9} className="p-6 text-center text-[var(--muted-foreground)]">Nenhuma transação encontrada.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center bg-[var(--muted)] p-4 border-t border-[var(--border)]">
          <p className="text-xs text-[var(--muted-foreground)]">
            A mostrar <strong>{paginatedTx.length}</strong> de <strong>{filtered.length}</strong>
            {hasFilters && <span> (filtrados de {newTransactions.length})</span>}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(prev => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="px-3 py-1 bg-[var(--card)] border border-[var(--border)] rounded text-xs disabled:opacity-50 hover:bg-[var(--muted)] transition-colors"
            >
              Anterior
            </button>
            <div className="px-3 py-1 text-xs font-medium dark:text-white">
              {page} / {totalPages || 1}
            </div>
            <button
              onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages || totalPages === 0}
              className="px-3 py-1 bg-[var(--card)] border border-[var(--border)] rounded text-xs disabled:opacity-50 hover:bg-[var(--muted)] transition-colors"
            >
              Próximo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
