'use client'
import { FiCheckCircle, FiDollarSign, FiFilter, FiCreditCard } from "react-icons/fi";
import { useState } from "react";
import { CardStat } from "@/components/dashboard/CardStat";
import { useStripeData } from "@/hooks/useStripeData";
import type { StripeTransaction } from "@/types/stripe";

export default function AdminStripeDashboard() {
  const { newTransactions, stats, isAdmin, isLoading } = useStripeData();

  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(newTransactions.length / itemsPerPage);
  const paginatedTx = newTransactions.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

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
      <div className="flex flex-col mb-6">
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
        <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {isAdmin ? "Todas as Transações" : "Minhas Transações"}
          </h2>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <FiFilter /> {newTransactions.length} resultados encontrados
          </div>
        </div>
        <div className="overflow-x-auto relative">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                <th className="p-4 font-medium text-gray-500 dark:text-gray-400 text-xs">ID</th>
                <th className="p-4 font-medium text-gray-500 dark:text-gray-400 text-xs">Transação Interna</th>
                {isAdmin && <th className="p-4 font-medium text-gray-500 dark:text-gray-400 text-xs">User ID</th>}
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
                <tr><td colSpan={10} className="p-6 text-center text-gray-500 dark:text-gray-400">Nenhuma transação encontrada.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-900/50 p-4 border-t border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-500">
            A mostrar <strong>{paginatedTx.length}</strong> de <strong>{newTransactions.length}</strong>
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(prev => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="px-3 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded text-xs disabled:opacity-50"
            >
              Anterior
            </button>
            <div className="px-3 py-1 text-xs font-medium dark:text-white">
              {page} / {totalPages || 1}
            </div>
            <button
              onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages || totalPages === 0}
              className="px-3 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded text-xs disabled:opacity-50"
            >
              Próximo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
