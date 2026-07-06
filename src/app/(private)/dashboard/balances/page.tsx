'use client'

import { useState } from "react";
import { useClientBalances } from "@/hooks/useClientBalances";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FiSearch, FiRefreshCw, FiRotateCcw } from "react-icons/fi";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function BalancesPage() {
  const router = useRouter();
  const { user } = useAuth();
  const isAdmin = user?.user_type === "admin";

  const {
    allBalances,
    isLoadingBalances,
    rebuild,
    isRebuilding,
    rebuildResult,
  } = useClientBalances();

  const [search, setSearch] = useState("");
  const [currencyFilter, setCurrencyFilter] = useState("");

  const filtered = allBalances.filter((b) => {
    const q = search.toLowerCase();
    if (q && !b.userId?.toLowerCase().includes(q) && !b.currency?.toLowerCase().includes(q)) return false;
    if (currencyFilter && b.currency !== currencyFilter) return false;
    return true;
  });

  if (!isAdmin) {
    router.replace("/dashboard");
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Saldos dos Clientes
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Visualize todos os saldos das contas dos clientes
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => rebuild()}
            disabled={isRebuilding}
            className="flex items-center gap-2"
          >
            <FiRotateCcw className={`h-4 w-4 ${isRebuilding ? "animate-spin" : ""}`} />
            {isRebuilding ? "A reconstruir..." : "Reconstruir Saldos"}
          </Button>
        </div>
      </div>

      {rebuildResult && (
        <div className="p-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg text-sm">
          {rebuildResult.message} — {rebuildResult.transactions_processed} transações processadas.
        </div>
      )}

      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="relative min-w-[200px] flex-1 max-w-xs">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Pesquisar por userId, moeda..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 text-gray-900 dark:text-gray-100 placeholder-gray-400"
            />
          </div>
          <select
            value={currencyFilter}
            onChange={(e) => setCurrencyFilter(e.target.value)}
            className="px-3 py-2 text-sm bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 text-gray-700 dark:text-gray-300"
          >
            <option value="">Todas as moedas</option>
            <option value="usd">USD</option>
            <option value="aoa">AOA</option>
          </select>
        </div>

        {isLoadingBalances ? (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-gray-500 py-8">Nenhum saldo encontrado.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                  <th className="p-3 font-medium text-gray-500 dark:text-gray-400 text-xs">ID</th>
                  <th className="p-3 font-medium text-gray-500 dark:text-gray-400 text-xs">User ID</th>
                  <th className="p-3 font-medium text-gray-500 dark:text-gray-400 text-xs">Saldo</th>
                  <th className="p-3 font-medium text-gray-500 dark:text-gray-400 text-xs">Moeda</th>
                  <th className="p-3 font-medium text-gray-500 dark:text-gray-400 text-xs">Atualizado em</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((b, idx) => (
                  <tr key={b.id || idx} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                    <td className="p-3 text-xs font-mono text-gray-800 dark:text-gray-300">{b.id || idx + 1}</td>
                    <td className="p-3 text-xs font-mono text-gray-600 dark:text-gray-400">{b.userId || "—"}</td>
                    <td className="p-3 text-xs font-semibold text-gray-900 dark:text-white">
                      {(b.balance || 0).toLocaleString("pt-AO", { style: "currency", currency: b.currency || "USD" })}
                    </td>
                    <td className="p-3 text-xs font-bold">{b.currency || "—"}</td>
                    <td className="p-3 text-xs text-gray-500">
                      {b.updatedAt ? new Date(b.updatedAt).toLocaleString() : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
