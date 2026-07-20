'use client'

import { useState } from "react";
import { CardStat } from "@/components/dashboard/CardStat";
import { Card } from "@/components/ui/card";
import { FiCreditCard, FiEye } from 'react-icons/fi';
import { useAuth } from "@/hooks/useAuth";
import { useApiKeys } from "@/hooks/useApiKeys";
import { useTransactions } from "@/hooks/useTransactions";
import { useTransactionFilters } from "@/hooks/useTransactionFilters";
import type { Transaction } from "@/types/global";
import { formatCurrency } from "@/utils/dashboard";
import { TransactionDetailsModal } from "@/components/transactions/TransactionDetailsModal";
import { NewReferenceModal } from "@/components/transactions/NewReferenceModal";

export default function TransactionsDashboard() {
  const { user } = useAuth();
  const tenantId = user?.tenant_id || user?.tenant?.tenant_id;
  const isAdmin = user?.user_type === "admin";

  const [showNewReferenceModal, setShowNewReferenceModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const { data: transactions = [], isLoading: loading } = useTransactions();
  useApiKeys({ enabledWhenStoreEmpty: true, syncStore: true });

  const {
    sortConfig,
    setSortConfig,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    currentPage,
    setCurrentPage,
    groupByTenant,
    setGroupByTenant,
    paginatedTransactions,
    groupedData,
    totalPages,
    stats,
    clearFilters,
  } = useTransactionFilters(transactions);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-[var(--background)] min-h-screen">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Transações Nacionais</h1>
          <p className="text-sm text-[var(--muted-foreground)]">
            {isAdmin ? "Visão Administrativa - Sistema Completo" : "Gerencie seus pagamentos"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <CardStat title="Total" amount={stats.total.toString()} change="" icon={<FiCreditCard />} />
        <CardStat title="Pendentes" amount={stats.pendentes.toString()} change="" icon="Kz" />
        <CardStat title="Falhas" amount={stats.falha.toString()} change="" icon="Kz" />
        <CardStat title="Concluídas" amount={stats.concluidas.toString()} change="" icon="Kz" />
        <CardStat
          title="Total Recebido"
          amount={stats.totalRecebido.toLocaleString("pt-BR", { style: "currency", currency: "AOA" })}
          change=""
          icon="Kz"
        />
      </div>

      <div className="bg-[var(--muted)] p-4 rounded-xl flex flex-wrap items-end gap-4 border border-[var(--border)]">
        <div>
          <label className="block text-xs font-medium text-[var(--muted-foreground)] mb-1">Início</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="bg-[var(--card)] border border-[var(--border)] rounded-md px-3 py-2 text-sm outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-[var(--muted-foreground)] mb-1">Fim</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="bg-[var(--card)] border border-[var(--border)] rounded-md px-3 py-2 text-sm outline-none"
          />
        </div>
        {isAdmin && (
          <div className="flex items-center gap-2 pb-2 ml-4">
            <input
              type="checkbox"
              id="groupCheck"
              checked={groupByTenant}
              onChange={(e) => setGroupByTenant(e.target.checked)}
              className="w-4 h-4 text-[var(--accent-primary)] rounded"
            />
            <label htmlFor="groupCheck" className="text-sm text-[var(--foreground)] cursor-pointer">
              Agrupar por Empresa
            </label>
          </div>
        )}
        <button
          onClick={clearFilters}
          className="bg-[var(--muted)] text-[var(--foreground)] text-xs px-3 py-2 rounded-md font-medium"
        >
          Limpar
        </button>
      </div>

      <Card className="p-6 bg-[var(--card)] border-0 rounded-xl shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">Transações Recentes</h2>
          <button
            onClick={() => setShowNewReferenceModal(true)}
            className="bg-[var(--accent-primary)] hover:opacity-90 text-white px-4 py-2 rounded-md font-medium flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nova Referência
          </button>
        </div>

        <div className="overflow-x-auto">
                   {groupedData ? (
            Object.entries(groupedData).map(([name, txs]) => (
              <div key={name} className="mb-6 last:mb-0">
                <div className="bg-[var(--accent-primary-subtle)] px-4 py-2 rounded-t-lg border-x border-t border-blue-100 dark:border-blue-800 flex justify-between items-center font-bold text-blue-700 dark:text-blue-300">
                  {name} <span>{txs.length} itens</span>
                </div>
                <table className="w-full border border-[var(--border)] rounded-b-lg text-sm">
                  <tbody className="divide-y divide-[var(--border)]">
                    {txs.map((tx) => (
                      <tr key={tx.id} className="hover:bg-[var(--muted)]">
                        <td className="py-3 px-4 w-1/4">{tx.customer_name}</td>
                        <td className="py-3 px-4 w-1/6">{tx.payment_method}</td>
                        <td className="py-3 px-4 font-bold w-1/6">{formatCurrency(tx.amount)}</td>
                        <td className="py-3 px-4 w-1/6">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] ${tx.status === 'success' ? 'bg-[var(--success-subtle)] text-[var(--success)]' : 'bg-[var(--warning-subtle)] text-[var(--warning)]'}`}>
                            {tx.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-[11px] text-[var(--muted-foreground)]">{new Date(tx.created_at).toLocaleDateString()}</td>
                        <td className="py-3 px-4 text-right">
                          <button onClick={() => { setSelectedTransaction(tx); setShowDetailsModal(true); }} className="text-[var(--accent-primary)] hover:underline">Ver</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))
          ) : (
            <table className="w-full">
              <thead className="text-left text-sm text-[var(--muted-foreground)] border-b border-[var(--border)]">
                <tr>
                  <th className="pb-3 px-4">Cliente</th>
                  {isAdmin && <th className="pb-3 px-4">Empresa</th>}
                  <th className="pb-3 px-4">Método</th>
                  <th className="pb-3 px-4">
                    <button
                      onClick={() =>
                        setSortConfig((prev) =>
                          prev?.key === "amount" && prev.direction === "asc"
                            ? { key: "amount", direction: "desc" }
                            : { key: "amount", direction: "asc" }
                        )
                      }
                      className="flex items-center gap-1"
                    >
                      Valor
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                      </svg>
                    </button>
                  </th>
                  <th className="pb-3 px-4">Status</th>
                  <th className="pb-3 px-4">
                    <button
                      onClick={() =>
                        setSortConfig((prev) =>
                          prev?.key === "created_at" && prev.direction === "asc"
                            ? { key: "created_at", direction: "desc" }
                            : { key: "created_at", direction: "asc" }
                        )
                      }
                      className="flex items-center gap-1"
                    >
                      Data
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                      </svg>
                    </button>
                  </th>
                  <th className="pb-3 px-4">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {paginatedTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-[var(--muted)]">
                    <td className="py-4 px-4 text-[var(--foreground)] font-medium">{tx.customer_name}</td>
                    {isAdmin && <td className="py-4 px-4 text-sm text-[var(--muted-foreground)]">{tx.tenant?.legal_name || "N/A"}</td>}
                    <td className="py-4 px-4 text-[var(--muted-foreground)]">{tx.payment_method}</td>
                    <td className="py-4 px-4 font-bold">{formatCurrency(tx.amount)}</td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${tx.status === 'success' ? 'bg-[var(--success-subtle)] text-[var(--success)]' : 'bg-[var(--warning-subtle)] text-[var(--warning)]'}`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-[var(--muted-foreground)] text-sm">{new Date(tx.created_at).toLocaleDateString()}</td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => { setSelectedTransaction(tx); setShowDetailsModal(true); }}
                        className="text-[var(--accent-primary)] hover:underline text-sm font-medium flex items-center gap-1"
                      >
                        <FiEye /> Detalhes
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>

      <div className="flex justify-between items-center bg-[var(--muted)] p-4 rounded-xl border border-[var(--border)]">
        <p className="text-sm text-[var(--muted-foreground)]">
          Mostrando <strong>{paginatedTransactions.length}</strong> de <strong>{stats.total}</strong> transações
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-[var(--card)] border border-[var(--border)] rounded-lg text-sm disabled:opacity-50"
          >
            Anterior
          </button>
          <div className="flex items-center px-4 text-sm font-medium">
            Página {currentPage} de {totalPages}
          </div>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-[var(--card)] border border-[var(--border)] rounded-lg text-sm disabled:opacity-50"
          >
            Próximo
          </button>
        </div>
      </div>

      {showDetailsModal && selectedTransaction && (
        <TransactionDetailsModal
          transaction={selectedTransaction}
          onClose={() => { setShowDetailsModal(false); setSelectedTransaction(null); }}
        />
      )}

      {showNewReferenceModal && (
        <NewReferenceModal
          tenantId={tenantId}
          userToken={user?.token}
          onClose={() => setShowNewReferenceModal(false)}
        />
      )}
    </div>
  );
}
