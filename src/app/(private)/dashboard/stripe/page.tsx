'use client'
import { FiCheckCircle, FiDollarSign, FiFilter, FiCreditCard, FiSearch, FiX } from "react-icons/fi";
import { useState, useMemo } from "react";
import { CardStat } from "@/components/dashboard/CardStat";
import { useStripeData } from "@/hooks/useStripeData";
import type { StripeTransaction } from "@/types/stripe";

const statusOptions = ["COMPLETED", "PENDING", "FAILED", "CANCELLED", "REFUNDED"] as const;
const currencyOptions = ["USD", "AOA"] as const;

export default function AdminStripeDashboard() {
  const { newTransactions, stats, isAdmin, isLoading } = useStripeData();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currencyFilter, setCurrencyFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 dark:text-gray-300">A carregar transações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col mb-2">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">
          Pagamentos Internacionais
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-sm">
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
          icon={<FiDollarSign className="text-blue-500" />}
        />
        <CardStat
          title="AOA Processado"
          amount={stats.totalGrossAOA.toLocaleString("pt-AO", { style: "currency", currency: "AOA" })}
          change=""
          icon={<FiDollarSign className="text-yellow-500" />}
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
          icon={<FiCheckCircle className="text-green-500" />}
        />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-[200px] flex-1 max-w-xs">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Pesquisar por nome, ID, transação..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 text-gray-900 dark:text-gray-100 placeholder-gray-400"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="px-3 py-2 text-sm bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 text-gray-700 dark:text-gray-300"
            >
              <option value="">Todos os estados</option>
              {statusOptions.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            <select
              value={currencyFilter}
              onChange={(e) => { setCurrencyFilter(e.target.value); setPage(1); }}
              className="px-3 py-2 text-sm bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 text-gray-700 dark:text-gray-300"
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
                className="px-3 py-2 text-sm bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 text-gray-700 dark:text-gray-300"
              />
              <span className="text-gray-400 text-xs">—</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => { setEndDate(e.target.value); setPage(1); }}
                className="px-3 py-2 text-sm bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 text-gray-700 dark:text-gray-300"
              />
            </div>

            {hasFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <FiX className="h-4 w-4" />
                Limpar
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/30">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
            {isAdmin ? "Todas as Transações" : "Minhas Transações"}
          </h2>
          <div className="flex items-center gap-2 text-xs text-gray-500">
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
              <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                <th className="p-4 font-medium text-gray-500 dark:text-gray-400 text-xs">ID</th>
                <th className="p-4 font-medium text-gray-500 dark:text-gray-400 text-xs">Transação Interna</th>
                {isAdmin && <th className="p-4 font-medium text-gray-500 dark:text-gray-400 text-xs">User ID</th>}
                {isAdmin && <th className="p-4 font-medium text-gray-500 dark:text-gray-400 text-xs">Nome</th>}
                <th className="p-4 font-medium text-gray-500 dark:text-gray-400 text-xs">Montante</th>
                <th className="p-4 font-medium text-gray-500 dark:text-gray-400 text-xs">Bruto</th>
                <th className="p-4 font-medium text-gray-500 dark:text-gray-400 text-xs">Taxa</th>
                <th className="p-4 font-medium text-gray-500 dark:text-gray-400 text-xs">Líquido</th>
                <th className="p-4 font-medium text-gray-500 dark:text-gray-400 text-xs">Moeda</th>
                <th className="p-4 font-medium text-gray-500 dark:text-gray-400 text-xs">Estado</th>
                <th className="p-4 font-medium text-gray-500 dark:text-gray-400 text-xs">Data</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTx.map((tx: StripeTransaction) => (
                <tr key={tx.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                  <td className="p-4 text-xs font-mono text-gray-800 dark:text-gray-300">{tx.id}</td>
                  <td className="p-4 text-xs font-mono text-gray-600 dark:text-gray-400">{tx.internalTransactionId}</td>
                  {isAdmin && (
                    <td className="p-4 text-xs text-gray-600 dark:text-gray-400 font-mono">{tx.userId?.slice(0, 8)}...</td>
                  )}
                  {isAdmin && (
                    <td className="p-4 text-xs text-gray-800 dark:text-gray-200 font-medium">{tx.fullname || "—"}</td>
                  )}
                  <td className="p-4 text-xs font-medium text-gray-900 dark:text-white">
                    {(tx.amount || 0).toLocaleString("en-US", { style: "currency", currency: tx.currency || "USD" })}
                  </td>
                  <td className="p-4 text-xs text-gray-700 dark:text-gray-300">
                    {(tx.grossAmount || 0).toLocaleString("en-US", { style: "currency", currency: tx.currency || "USD" })}
                  </td>
                  <td className="p-4 text-xs text-red-500">
                    {(tx.feeAmount || 0).toLocaleString("en-US", { style: "currency", currency: tx.currency || "USD" })}
                  </td>
                  <td className="p-4 text-xs font-semibold text-green-600">
                    {(tx.netAmount || 0).toLocaleString("en-US", { style: "currency", currency: tx.currency || "USD" })}
                  </td>
                  <td className="p-4 text-xs font-bold">{tx.currency || "—"}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 text-[10px] rounded-full font-bold ${tx.status === 'COMPLETED' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="p-4 text-xs text-gray-500">
                    {tx.createdAt ? new Date(tx.createdAt).toLocaleString() : "—"}
                  </td>
                </tr>
              ))}
              {paginatedTx.length === 0 && (
                <tr><td colSpan={isAdmin ? 11 : 9} className="p-6 text-center text-gray-500 dark:text-gray-400">Nenhuma transação encontrada.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-900/50 p-4 border-t border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-500">
            A mostrar <strong>{paginatedTx.length}</strong> de <strong>{filtered.length}</strong>
            {hasFilters && <span> (filtrados de {newTransactions.length})</span>}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(prev => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="px-3 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded text-xs disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Anterior
            </button>
            <div className="px-3 py-1 text-xs font-medium dark:text-white">
              {page} / {totalPages || 1}
            </div>
            <button
              onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages || totalPages === 0}
              className="px-3 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded text-xs disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Próximo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
