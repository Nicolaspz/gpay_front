'use client'
import { FiEye, FiCheckCircle, FiAlertTriangle, FiDollarSign, FiX, FiUploadCloud, FiFilter, FiCreditCard } from "react-icons/fi";
import { useContext, useState, useMemo } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import axios from "axios";
import { toast } from 'react-toastify';
import { CardStat } from "@/components/dashboard/CardStat";
import { Card } from "@/components/ui/card";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function AdminStripeDashboard() {
  const queryClient = useQueryClient();
  const { user } = useContext(AuthContext);
  const isAdmin = user?.user_type === "admin";
  const tenantId = user?.tenant_id || user?.tenant?.tenant_id;
  
  const stripeBaseUrl = "https://stripe-server-ztck.onrender.com/api/v1";
  const stripeToken = 'Bearer GPayment_Secret_Default_2024';

  // Filtros
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 1. Query para os resumos (Dashboard superior) - Apenas para Users (Admin agrega do allTransactions)
  const { data: summaries = [], isLoading: loadingSummaries } = useQuery({
    queryKey: ['stripe-summaries', isAdmin, tenantId],
    queryFn: async () => {
      if (!user || isAdmin) return [];
      const endpoint = `/transactions/user/${tenantId}/summaries`;
      const res = await axios.get(`${stripeBaseUrl}${endpoint}`, {
        headers: { Authorization: stripeToken }
      });
      return res.data;
    },
    enabled: !!user && !isAdmin,
  });

  // 2. Query para todas as transações (Tabela principal)
  const { data: allTransactions = [], isLoading: loadingTx } = useQuery({
    queryKey: ['stripe-transactions', isAdmin, tenantId],
    queryFn: async () => {
      if (!user) return [];
      const endpoint = isAdmin ? "/transactions/admin/clients" : `/transactions/user/${tenantId}`;
      const res = await axios.get(`${stripeBaseUrl}${endpoint}`, {
        headers: { Authorization: stripeToken }
      });
      return res.data;
    },
    enabled: !!user,
  });

  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [liquidationModal, setLiquidationModal] = useState<{ userId: string, currency: string } | null>(null);
  const [receiptUrl, setReceiptUrl] = useState("");

  const liquidateMutation = useMutation({
    mutationFn: async (data: { userId: string, currency: string, receiptUrl: string }) => {
      await axios.post(
        `${stripeBaseUrl}/transactions/admin/liquidate/${data.userId}`,
        { currency: data.currency, receiptUrl: data.receiptUrl },
        { headers: { Authorization: stripeToken } }
      );
    },
    onSuccess: (_, variables) => {
      toast.success("Liquidação concluída com sucesso!");
      setLiquidationModal(null);
      setReceiptUrl("");
      queryClient.invalidateQueries({ queryKey: ['stripe-summaries'] });
      queryClient.invalidateQueries({ queryKey: ['stripe-transactions'] });
    },
    onError: () => {
      toast.error("Erro ao processar liquidação");
    }
  });

  async function handleLiquidate(e: React.FormEvent) {
    e.preventDefault();
    if (!liquidationModal) return;
    liquidateMutation.mutate({
      userId: liquidationModal.userId,
      currency: liquidationModal.currency,
      receiptUrl
    });
  }

  // Lógica de Filtragem e Paginação
  const filteredTransactions = useMemo(() => {
    return allTransactions.filter((tx: any) => {
      if (!startDate && !endDate) return true;
      const txDate = new Date(tx.createdAt).getTime();
      const start = startDate ? new Date(startDate).getTime() : 0;
      const end = endDate ? new Date(endDate).getTime() + 86400000 : Infinity;
      return txDate >= start && txDate <= end;
    });
  }, [allTransactions, startDate, endDate]);

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Estatísticas Gerais (Agregadas de Summaries ou Transactions)
  const stats = useMemo(() => {
    let totalGross = 0;
    let totalNet = 0;
    let totalPending = 0;
    let totalPaid = 0;

    if (isAdmin) {
      // Para Admin, allTransactions é a fonte de dados (flat list)
      allTransactions.forEach((tx: any) => {
        if (tx.status === 'COMPLETED') {
          totalGross += tx.grossAmount || 0;
          totalNet += tx.netAmount || 0;
          if (tx.isPaidOut) {
            totalPaid += tx.netAmount || 0;
          } else {
            totalPending += tx.netAmount || 0;
          }
        }
      });
    } else {
      // Para User, usamos os summaries que vêm agrupados por moeda do backend
      summaries.forEach((s: any) => {
        totalGross += s.totalGrossAmount || 0;
        totalNet += s.totalNetAmount || 0;
        totalPending += s.totalPendingPayoutAmount || 0;
        totalPaid += s.totalPaidOutAmount || 0;
      });
    }

    return { totalGross, totalNet, totalPending, totalPaid, count: filteredTransactions.length };
  }, [summaries, allTransactions, isAdmin, filteredTransactions.length]);

  // Agrupamento para a tabela de Liquidação (Apenas Admin)
  const liquidationBalances = useMemo(() => {
    if (!isAdmin) return [];
    
    const groups: Record<string, any> = {};
    allTransactions.forEach((tx: any) => {
      if (tx.status === 'COMPLETED' && !tx.isPaidOut) {
        const key = `${tx.userId}-${tx.currency}`;
        if (!groups[key]) {
          groups[key] = {
            userId: tx.userId,
            currency: tx.currency,
            totalPendingPayoutAmount: 0
          };
        }
        groups[key].totalPendingPayoutAmount += tx.netAmount || 0;
      }
    });
    return Object.values(groups).filter(g => g.totalPendingPayoutAmount > 0);
  }, [allTransactions, isAdmin]);

  if ((!isAdmin && loadingSummaries) || (loadingTx && allTransactions.length === 0)) {
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
          Pagamentos Internacionais (Stripe)
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          {isAdmin 
            ? "Gestão global de transações e liquidações internacionais." 
            : "Visualize o histórico de suas vendas e recebimentos internacionais."}
        </p>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <CardStat title="Total Transações" amount={stats.count.toString()} change="" icon={<FiCreditCard />} />
        <CardStat 
          title="Bruto Processado" 
          amount={stats.totalGross.toLocaleString("en-US", { style: "currency", currency: "USD" })} 
          change="" 
          icon={<FiDollarSign className="text-blue-500" />} 
        />
        <CardStat 
          title="Líquido Total" 
          amount={stats.totalNet.toLocaleString("en-US", { style: "currency", currency: "USD" })} 
          change="" 
          icon={<FiCheckCircle className="text-green-500" />} 
        />
        <CardStat 
          title="Pendente Payout" 
          amount={stats.totalPending.toLocaleString("en-US", { style: "currency", currency: "USD" })} 
          change="" 
          icon={<FiAlertTriangle className="text-orange-500" />} 
        />
        <CardStat 
          title="Total Liquidado" 
          amount={stats.totalPaid.toLocaleString("en-US", { style: "currency", currency: "USD" })} 
          change="" 
          icon={<FiDollarSign className="text-purple-500" />} 
        />
      </div>

      {/* Filtros */}
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl flex flex-wrap items-end gap-4 border border-gray-100 dark:border-gray-700">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Início</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md px-3 py-2 text-sm outline-none" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Fim</label>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md px-3 py-2 text-sm outline-none" />
        </div>
        <button onClick={() => { setStartDate(""); setEndDate(""); }} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs">
          Limpar Filtros
        </button>
      </div>

      {/* Tabela Principal de Transações */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700">
        <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Todas as Transações</h2>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <FiFilter /> {filteredTransactions.length} resultados encontrados
          </div>
        </div>
        <div className="overflow-x-auto relative">
          {loadingTx && (
            <div className="absolute inset-0 bg-white/50 dark:bg-gray-800/50 flex items-center justify-center z-10">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                <th className="p-4 font-medium text-gray-500 dark:text-gray-400 text-xs">Referência/Sessão</th>
                {isAdmin && <th className="p-4 font-medium text-gray-500 dark:text-gray-400 text-xs">Cliente</th>}
                <th className="p-4 font-medium text-gray-500 dark:text-gray-400 text-xs">Data</th>
                <th className="p-4 font-medium text-gray-500 dark:text-gray-400 text-xs">Bruto</th>
                <th className="p-4 font-medium text-gray-500 dark:text-gray-400 text-xs">Líquido</th>
                <th className="p-4 font-medium text-gray-500 dark:text-gray-400 text-xs">Estado</th>
                <th className="p-4 font-medium text-gray-500 dark:text-gray-400 text-xs">Payout</th>
                <th className="p-4 font-medium text-gray-500 dark:text-gray-400 text-xs">Recibo</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTransactions.map((tx: any) => (
                <tr key={tx.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                  <td className="p-4 text-xs font-mono text-gray-800 dark:text-gray-300" title={tx.stripeSessionId}>
                    {tx.stripeSessionId?.substring(0, 12)}...
                  </td>
                  {isAdmin && (
                    <td className="p-4 text-xs text-gray-600 dark:text-gray-400">
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-900 dark:text-white">{tx.fullname || "N/A"}</span>
                        <span className="text-[10px] text-gray-500 font-mono">{tx.userId}</span>
                      </div>
                    </td>
                  )}
                  <td className="p-4 text-xs text-gray-600 dark:text-gray-400">{new Date(tx.createdAt).toLocaleString()}</td>
                  <td className="p-4 text-xs font-medium text-gray-900 dark:text-white">
                    {(tx.grossAmount || 0).toLocaleString("en-US", { style: "currency", currency: tx.currency || "USD" })}
                  </td>
                  <td className="p-4 text-xs font-semibold text-green-600">
                    {(tx.netAmount || 0).toLocaleString("en-US", { style: "currency", currency: tx.currency || "USD" })}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 text-[10px] rounded-full font-bold ${tx.status === 'COMPLETED' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="p-4">
                    {tx.isPaidOut ? (
                      <span className="flex items-center gap-1 text-[10px] text-blue-600 dark:text-blue-400 font-bold">
                        <FiCheckCircle /> Pago
                      </span>
                    ) : (
                      <span className="text-[10px] text-orange-500 font-bold">Pendente</span>
                    )}
                  </td>
                  <td className="p-4">
                    {tx.receiptUrl ? (
                      <a href={tx.receiptUrl} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline text-xs flex items-center gap-1">
                        <FiEye /> Link
                      </a>
                    ) : "-"}
                  </td>
                </tr>
              ))}
              {paginatedTransactions.length === 0 && (
                <tr><td colSpan={isAdmin ? 8 : 7} className="p-6 text-center text-gray-500 dark:text-gray-400">Nenhuma transação encontrada.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginação */}
        <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-900/50 p-4 border-t border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-500">
            A mostrar <strong>{paginatedTransactions.length}</strong> de <strong>{filteredTransactions.length}</strong>
          </p>
          <div className="flex gap-2">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded text-xs disabled:opacity-50"
            >
              Anterior
            </button>
            <div className="px-3 py-1 text-xs font-medium dark:text-white">
              {currentPage} / {totalPages || 1}
            </div>
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-3 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded text-xs disabled:opacity-50"
            >
              Próximo
            </button>
          </div>
        </div>
      </div>

      {/* Lista de Saldos dos Clientes (Apenas Admin) - Útil para Liquidação */}
      {isAdmin && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mt-8 overflow-hidden border border-gray-100 dark:border-gray-700">
          <div className="p-5 border-b border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Saldos Disponíveis para Liquidação</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                  <th className="p-4 font-medium text-gray-500 dark:text-gray-400 text-sm">ID do Cliente</th>
                  <th className="p-4 font-medium text-gray-500 dark:text-gray-400 text-sm">Moeda</th>
                  <th className="p-4 font-medium text-gray-500 dark:text-gray-400 text-sm">Líquido Pendente</th>
                  <th className="p-4 font-medium text-gray-500 dark:text-gray-400 text-sm">Ações</th>
                </tr>
              </thead>
              <tbody>
                {liquidationBalances.map((s: any, idx: number) => (
                  <tr key={`${s.userId}-${s.currency}-${idx}`} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                    <td className="p-4 text-sm font-mono text-gray-800 dark:text-gray-300">{s.userId}</td>
                    <td className="p-4 text-sm font-bold text-gray-700 dark:text-gray-300">{s.currency}</td>
                    <td className="p-4 text-sm font-bold text-orange-500">{(s.totalPendingPayoutAmount || 0).toLocaleString("pt-PT", { style: "currency", currency: s.currency })}</td>
                    <td className="p-4">
                      <button onClick={() => setLiquidationModal({ userId: s.userId, currency: s.currency })} className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 flex items-center gap-1">
                        <FiDollarSign /> Liquidar
                      </button>
                    </td>
                  </tr>
                ))}
                {liquidationBalances.length === 0 && (
                  <tr><td colSpan={4} className="p-6 text-center text-gray-500 dark:text-gray-400">Nenhum saldo pendente para liquidação.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal de Liquidação */}
      {liquidationModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Liquidar Valores ({liquidationModal.currency})</h3>
              <button onClick={() => setLiquidationModal(null)} className="text-gray-400 hover:text-gray-600">
                <FiX className="text-xl" />
              </button>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Ao liquidar, irá marcar todas as transações COMPLETED pendentes do cliente `<span className="font-mono">{liquidationModal.userId}</span>` nesta moeda como PAGAS. Tem a certeza que já transferiu o dinheiro?
            </p>

            <form onSubmit={handleLiquidate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Link do Comprovativo de Transferência (Opcional)
                </label>
                <div className="flex items-center gap-2">
                  <FiUploadCloud className="text-gray-400 text-xl" />
                  <input
                    type="url"
                    placeholder="https://drive.google.com/... ou URL da imagem"
                    value={receiptUrl}
                    onChange={(e) => setReceiptUrl(e.target.value)}
                    className="w-full flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-transparent dark:text-white sm:text-sm outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setLiquidationModal(null)} className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                  Cancelar
                </button>
                <button type="submit" disabled={liquidateMutation.isPending} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center gap-2">
                  {liquidateMutation.isPending ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <FiCheckCircle />}
                  Confirmar Liquidação
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
