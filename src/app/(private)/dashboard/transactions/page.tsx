'use client'

import { useState } from "react";
import { CardStat } from "@/components/dashboard/CardStat";
import { Card } from "@/components/ui/card";
import { FiCreditCard, FiEye, FiPlus, FiFilter } from 'react-icons/fi';
import { ArrowUpDown } from "lucide-react";
import { toast } from "react-toastify";
import { useApiKeyStore } from "@/store/useApiKeyStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useApiKeys } from "@/hooks/useApiKeys";
import { useTransactions } from "@/hooks/useTransactions";
import { TransactionsService } from "@/services/transactions.service";
import type { Transaction } from "@/types/global";
import { getErrorMessage } from "@/utils/api-error";
import { formatCurrency } from "@/utils/dashboard";

// Componente de Botão
const Button = ({
  children,
  onClick,
  className = "",
  disabled = false,
  size = "md"
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
}) => {
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg"
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${sizeClasses[size]}
        rounded-md font-medium transition-colors
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {children}
    </button>
  );
};

type ReferenceResult = {
  entity: string;
  referenceNumber: string;
} | null;

type SortConfig = {
  key: keyof Transaction;
  direction: "asc" | "desc";
} | null;

type NewReferenceData = {
  amount: number;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  description: string;
  payment_method: string;
  transaction_id: string;
};

export default function TransactionsDashboard() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const tenantId = user?.tenant_id || user?.tenant?.tenant_id;
  const isAdmin = user?.user_type === "admin";

  const [sortConfig, setSortConfig] = useState<SortConfig>(null);
  const [showNewReferenceModal, setShowNewReferenceModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [referenceResult, setReferenceResult] = useState<ReferenceResult>(null);
  
  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filtros
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [groupByTenant, setGroupByTenant] = useState(false);

  const [newReferenceData, setNewReferenceData] = useState<NewReferenceData>({
    amount: 0,
    customer_name: "",
    customer_phone: "",
    customer_email: "",
    description: "",
    payment_method: "multicaixa",
    transaction_id: ""
  });

  const { data: transactions = [], isLoading: loading } = useTransactions();
  const { getFirstKey } = useApiKeyStore();

  useApiKeys({ enabledWhenStoreEmpty: true, syncStore: true });

  const generateReferenceMutation = useMutation({
    mutationFn: async (data: NewReferenceData) => {
      const apiKey = getFirstKey();
      const payload = {
        amount: data.amount,
        redirect_url: "gpay-dashboard",
        customer: {
          name: data.customer_name,
          phone: data.customer_phone || "000000000",
          email: data.customer_email || "cliente@exemplo.com"
        },
        description: data.description || "Pagamento",
        payment_method: data.payment_method || "reference",
        transaction_type: "payment",
        transaction_id: data.transaction_id || Math.random().toString(36).substr(2, 12).toUpperCase()
      } as const;

      return TransactionsService.generateReference(payload, apiKey, user?.token);
    },
    onSuccess: (data) => {
      if (data.data?.responseStatus?.reference?.entity && data.data.responseStatus.reference.referenceNumber) {
        setReferenceResult({
          entity: data.data.responseStatus.reference.entity,
          referenceNumber: data.data.responseStatus.reference.referenceNumber
        });
      } else {
        toast.error("Erro: Dados de referência não encontrados");
      }
      queryClient.invalidateQueries({ queryKey: ['transactions', tenantId] });
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Erro ao gerar referência"));
    }
  });

  const handleGenerateReference = async () => {
    if (!tenantId) return alert("Usuário não autenticado");
    if (newReferenceData.amount <= 0) return alert("Insira um montante válido");
    if (!newReferenceData.customer_name.trim()) return alert("Insira o nome do cliente");

    generateReferenceMutation.mutate(newReferenceData);
  };

  // Filtragem e Ordenação
  const filteredTransactions = transactions.filter(t => {
    if (!startDate && !endDate) return true;
    const txDate = new Date(t.created_at).getTime();
    const start = startDate ? new Date(startDate).getTime() : 0;
    const end = endDate ? new Date(endDate).getTime() + 86400000 : Infinity;
    return txDate >= start && txDate <= end;
  });

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;
    const valA = a[key];
    const valB = b[key];
    if (valA === undefined || valB === undefined || typeof valA === 'object' || typeof valB === 'object') return 0;

    if (key === "created_at") {
      const dateA = new Date(valA as string).getTime();
      const dateB = new Date(valB as string).getTime();
      return direction === "asc" ? dateA - dateB : dateB - dateA;
    }
    if (valA < valB) return direction === "asc" ? -1 : 1;
    if (valA > valB) return direction === "asc" ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedTransactions.length / itemsPerPage);
  const paginatedTransactions = sortedTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const groupedTransactions = isAdmin && groupByTenant ? paginatedTransactions.reduce((acc, tx) => {
    const name = tx.tenant?.legal_name || tx.tenant_id || "Desconhecido";
    if (!acc[name]) acc[name] = [];
    acc[name].push(tx);
    return acc;
  }, {} as Record<string, Transaction[]>) : null;

  // Estatísticas
  const total = filteredTransactions.length;
  const pendentes = filteredTransactions.filter(t => t.status?.toLowerCase() === "pending").length;
  const concluidas = filteredTransactions.filter(t => t.status?.toLowerCase() === "success").length;
  const falha = filteredTransactions.filter(t => t.status?.toLowerCase() === "failed").length;
  const totalRecebido = filteredTransactions.filter(t => t.status?.toLowerCase() === "success").reduce((acc, t) => acc + Number(t.amount || 0), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-white dark:bg-[#111827] min-h-screen">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Transações Nacionais</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {isAdmin ? "Visão Administrativa - Sistema Completo" : "Gerencie seus pagamentos"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <CardStat title="Total" amount={total.toString()} change="" icon={<FiCreditCard />} />
        <CardStat title="Pendentes" amount={pendentes.toString()} change="" icon="Kz" />
        <CardStat title="Falhas" amount={falha.toString()} change="" icon="Kz" />
        <CardStat title="Concluídas" amount={concluidas.toString()} change="" icon="Kz" />
        <CardStat
          title="Total Recebido"
          amount={(totalRecebido).toLocaleString("pt-BR", { style: "currency", currency: "AOA" })}
          change=""
          icon="Kz"
        />
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl flex flex-wrap items-end gap-4 border border-gray-100 dark:border-gray-700">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Início</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md px-3 py-2 text-sm outline-none" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Fim</label>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md px-3 py-2 text-sm outline-none" />
        </div>
        {isAdmin && (
          <div className="flex items-center gap-2 pb-2 ml-4">
            <input type="checkbox" id="groupCheck" checked={groupByTenant} onChange={(e) => setGroupByTenant(e.target.checked)} className="w-4 h-4 text-blue-600 rounded" />
            <label htmlFor="groupCheck" className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer">Agrupar por Empresa</label>
          </div>
        )}
        <Button onClick={() => { setStartDate(""); setEndDate(""); }} className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs px-3 py-2">Limpar</Button>
      </div>

      <Card className="p-6 bg-[#F9FAFB] dark:bg-[#1F2937] border-0 rounded-xl shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Transações Recentes</h2>
          <Button onClick={() => { setShowNewReferenceModal(true); setReferenceResult(null); }} className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
            <FiPlus /> Nova Referência
          </Button>
        </div>

        <div className="overflow-x-auto">
          {groupedTransactions ? (
            Object.entries(groupedTransactions).map(([name, txs]) => (
              <div key={name} className="mb-6 last:mb-0">
                <div className="bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-t-lg border-x border-t border-blue-100 dark:border-blue-800 flex justify-between items-center font-bold text-blue-700 dark:text-blue-300">
                  {name} <span>{txs.length} itens</span>
                </div>
                <table className="w-full border border-gray-100 dark:border-gray-800 rounded-b-lg text-sm">
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {txs.map(tx => (
                      <tr key={tx.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="py-3 px-4 w-1/4">{tx.customer_name}</td>
                        <td className="py-3 px-4 w-1/6">{tx.payment_method}</td>
                        <td className="py-3 px-4 font-bold w-1/6">{formatCurrency(tx.amount)}</td>
                        <td className="py-3 px-4 w-1/6">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] ${tx.status === 'success' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {tx.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-[11px] text-gray-400">{new Date(tx.created_at).toLocaleDateString()}</td>
                        <td className="py-3 px-4 text-right">
                          <button onClick={() => { setSelectedTransaction(tx); setShowDetailsModal(true); }} className="text-blue-600 hover:underline">Ver</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))
          ) : (
            <table className="w-full">
              <thead className="text-left text-sm text-gray-500 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="pb-3 px-4">Cliente</th>
                  {isAdmin && <th className="pb-3 px-4">Empresa</th>}
                  <th className="pb-3 px-4">Método</th>
                  <th className="pb-3 px-4">Valor</th>
                  <th className="pb-3 px-4">Status</th>
                  <th className="pb-3 px-4">Data</th>
                  <th className="pb-3 px-4">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {paginatedTransactions.map(tx => (
                  <tr key={tx.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="py-4 px-4 text-gray-900 dark:text-white font-medium">{tx.customer_name}</td>
                    {isAdmin && <td className="py-4 px-4 text-sm text-gray-500">{tx.tenant?.legal_name || "N/A"}</td>}
                    <td className="py-4 px-4 text-gray-600">{tx.payment_method}</td>
                    <td className="py-4 px-4 font-bold">{formatCurrency(tx.amount)}</td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${tx.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-500 text-sm">{new Date(tx.created_at).toLocaleDateString()}</td>
                    <td className="py-4 px-4">
                      <button onClick={() => { setSelectedTransaction(tx); setShowDetailsModal(true); }} className="text-blue-600 hover:underline text-sm font-medium flex items-center gap-1">
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

      {/* Paginação */}
      <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
        <p className="text-sm text-gray-500">
          Mostrando <strong>{paginatedTransactions.length}</strong> de <strong>{filteredTransactions.length}</strong> transações
        </p>
        <div className="flex gap-2">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm disabled:opacity-50"
          >
            Anterior
          </button>
          <div className="flex items-center px-4 text-sm font-medium">
            Página {currentPage} de {totalPages}
          </div>
          <button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm disabled:opacity-50"
          >
            Próximo
          </button>
        </div>
      </div>

      {/* Modais omitidos aqui para brevidade, mas devem ser mantidos do arquivo original conforme necessário */}
      {showDetailsModal && selectedTransaction && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#1F2937] rounded-xl p-6 w-full max-w-2xl shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Detalhes da Transação</h3>
              <button onClick={() => setShowDetailsModal(false)} className="text-2xl">✕</button>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div><p className="text-xs text-gray-500 uppercase">Cliente</p><p className="font-bold">{selectedTransaction.customer_name}</p></div>
                <div><p className="text-xs text-gray-500 uppercase">Email</p><p>{selectedTransaction.customer_email || "N/A"}</p></div>
                {(() => {
                  try {
                    const meta = typeof selectedTransaction.metadata === 'string' ? JSON.parse(selectedTransaction.metadata || '{}') : (selectedTransaction.metadata || {});
                    const entity = meta.entity || meta.Entity || meta?.reference?.entity;
                    const reference = meta.referenceNumber || meta.reference_number || meta.referencia || meta.Reference || meta?.reference?.referenceNumber;
                    
                    if (selectedTransaction.payment_method === 'reference' && (entity || reference)) {
                      return (
                        <>
                          {entity && <div><p className="text-xs text-gray-500 uppercase">Entidade</p><p className="font-bold font-mono">{entity}</p></div>}
                          {reference && <div><p className="text-xs text-gray-500 uppercase">Referência</p><p className="font-bold font-mono tracking-wider">{reference}</p></div>}
                        </>
                      );
                    }
                  } catch (e) {}
                  return null;
                })()}
              </div>
              <div className="space-y-4">
                <div><p className="text-xs text-gray-500 uppercase">Valor</p><p className="text-xl font-bold text-green-600">{formatCurrency(selectedTransaction.amount)}</p></div>
                <div><p className="text-xs text-gray-500 uppercase">Status</p><p className="font-bold">{selectedTransaction.status.toUpperCase()}</p></div>
                <div><p className="text-xs text-gray-500 uppercase">Método</p><p className="font-bold capitalize">{selectedTransaction.payment_method}</p></div>
                
                {selectedTransaction.status === 'failed' && (() => {
                  try {
                    const meta = typeof selectedTransaction.metadata === 'string' ? JSON.parse(selectedTransaction.metadata || '{}') : (selectedTransaction.metadata || {});
                    const errorMessage = meta.message || meta.error || meta.motivo || meta.reason || meta.descricao || "Falha na transação (motivo não especificado na metadata)";
                    return (
                      <div className="col-span-2 pt-2 border-t border-red-100 dark:border-red-900/30">
                        <p className="text-xs text-red-500 uppercase font-bold flex items-center gap-1">Motivo da Falha</p>
                        <p className="text-sm text-red-600 dark:text-red-400 font-medium">{errorMessage}</p>
                      </div>
                    );
                  } catch (e) {
                    return null;
                  }
                })()}
              </div>
            </div>
            <div className="mt-8 flex justify-end">
              <Button onClick={() => setShowDetailsModal(false)} className="bg-blue-600 text-white">Fechar</Button>
            </div>
          </div>
        </div>
      )}

      {showNewReferenceModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#1F2937] rounded-xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold mb-4">{referenceResult ? "Referência Criada" : "Nova Referência"}</h3>
            {!referenceResult ? (
              <div className="space-y-4">
                <input type="text" placeholder="Nome do Cliente" value={newReferenceData.customer_name} onChange={e => setNewReferenceData({...newReferenceData, customer_name: e.target.value})} className="w-full p-2 border rounded bg-transparent dark:border-gray-700" />
                <input type="email" placeholder="Email do Cliente (opcional)" value={newReferenceData.customer_email} onChange={e => setNewReferenceData({...newReferenceData, customer_email: e.target.value})} className="w-full p-2 border rounded bg-transparent dark:border-gray-700" />
                <input type="text" placeholder="Telefone do Cliente (opcional)" value={newReferenceData.customer_phone} onChange={e => setNewReferenceData({...newReferenceData, customer_phone: e.target.value})} className="w-full p-2 border rounded bg-transparent dark:border-gray-700" />
                <input type="text" placeholder="Descrição (opcional)" value={newReferenceData.description} onChange={e => setNewReferenceData({...newReferenceData, description: e.target.value})} className="w-full p-2 border rounded bg-transparent dark:border-gray-700" />
                <input type="number" placeholder="Montante (AOA)" value={newReferenceData.amount || ""} onChange={e => setNewReferenceData({...newReferenceData, amount: parseFloat(e.target.value) || 0})} className="w-full p-2 border rounded bg-transparent dark:border-gray-700" />
                
                <select 
                  value={newReferenceData.payment_method} 
                  onChange={e => setNewReferenceData({...newReferenceData, payment_method: e.target.value})}
                  className="w-full p-2 border rounded bg-transparent dark:border-gray-700 dark:bg-gray-800"
                >
                  <option value="multicaixa">Multicaixa</option>
                  <option value="reference">Referência</option>
                </select>

                <div className="flex justify-end gap-2 mt-6">
                  <Button onClick={() => setShowNewReferenceModal(false)} className="bg-gray-200 dark:bg-gray-700 dark:text-gray-300">Cancelar</Button>
                  <Button onClick={handleGenerateReference} disabled={generateReferenceMutation.isPending} className="bg-blue-600 text-white flex items-center justify-center min-w-[100px]">
                    {generateReferenceMutation.isPending ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : "Gerar"}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-center">
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded">
                  <p className="text-xs text-gray-500">Entidade: {referenceResult.entity}</p>
                  <p className="text-2xl font-mono font-bold tracking-widest">{referenceResult.referenceNumber}</p>
                </div>
                <Button onClick={() => { setShowNewReferenceModal(false); setReferenceResult(null); }} className="bg-blue-600 text-white w-full">Concluído</Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
