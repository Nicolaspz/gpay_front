'use client'

import { useEffect, useState, useContext } from "react";
import { CardStat } from "@/components/dashboard/CardStat";
import { Card } from "@/components/ui/card";
import { FiCreditCard, FiDollarSign, FiEye, FiPlus } from 'react-icons/fi';
import { AuthContext } from "@/contexts/AuthContext";
import { api } from "@/services/apiClients";
import { ArrowUpDown } from "lucide-react";
import { parseCookies } from "nookies";
import { toast } from "react-toastify";
import axios from "axios";

const API_URL = process.env.BASE_APIPAY_URL;
// Componente de Botão (se você não tiver um componente Button próprio)
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

type Transaction = {
  id: string;
  amount: number;
  status: string;
  payment_method: string;
  tenant_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shop_name: string;
  created_at: string;
  metadata: string;// se existe e se é diferente de vazio
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
  const { user } = useContext(AuthContext);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState<SortConfig>(null);

  // Estados para os modais
  const [showNewReferenceModal, setShowNewReferenceModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [referenceResult, setReferenceResult] = useState<ReferenceResult>(null);
  // Estados para nova referência
  const [newReferenceData, setNewReferenceData] = useState<NewReferenceData>({
    amount: 0,
    customer_name: "",
    customer_phone: "",
    customer_email: "",
    description: "",
    payment_method: "multicaixa",
    transaction_id: ""
  });

  const [generatingReference, setGeneratingReference] = useState(false);

  useEffect(() => {
    if (user === null) return;
    fetchTransactions();
  }, [user]);

  const fetchTransactions = async () => {
    const tenantId = user?.tenant_id || user?.tenant?.tenant_id;
    if (!tenantId) {
      setLoading(false);
      return;
    }

    const { '@gCorporate.token': token } = parseCookies();

    try {
      setLoading(true);
      const response = await api.get(`/transactions/tenant/${tenantId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setTransactions(response.data);
      console.log("transactions", response.data)
    } catch (error) {
      console.error("Erro ao buscar transações:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReference = async () => {
    if (!user?.tenant_id) {
      alert("Usuário não autenticado");
      return;
    }

    if (newReferenceData.amount <= 0) {
      alert("Por favor, insira um montante válido maior que zero");
      return;
    }

    if (!newReferenceData.customer_name.trim()) {
      alert("Por favor, insira o nome do cliente");
      return;
    }

    const { '@gCorporate.token': token } = parseCookies();

    // Generate a unique transaction_id if not provided
    const txId = newReferenceData.transaction_id || `TXN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    try {
      setGeneratingReference(true);
      const response = await axios.post(`${API_URL}/api/pay`, {
        amount: newReferenceData.amount,
        redirect_url: "my-app",
        customer: {
          name: newReferenceData.customer_name,
          phone: newReferenceData.customer_phone || "000000000",
          email: newReferenceData.customer_email || "cliente@exemplo.com"
        },
        description: newReferenceData.description || `Referência gerada via Dashboard - ${new Date().toLocaleDateString()}`,
        payment_method: newReferenceData.payment_method,
        transaction_type: "payment",
        transaction_id: txId
      }, {
        headers: {
          'gpay-x-api': `Bearer ${token}`
        },
        timeout: 10000,
      });


      if (response.data) {
        console.log("API Response Body:", response.data);

        // A estrutura real baseada no seu log:
        // response.data (corpo do axios) -> data (objeto da API) -> responseStatus -> reference
        const apiData = response.data.data;
        const responseStatus = apiData?.responseStatus;
        const reference = responseStatus?.reference;

        console.log("Reference Object found:", reference);

        if (reference) {
          setReferenceResult({
            entity: reference.entity || "Entidade indisponível",
            referenceNumber: reference.referenceNumber || "Referência indisponível"
          });
        } else {
          console.error("Referência não encontrada no caminho: response.data.data.responseStatus.reference");
          toast.error("Erro: Dados de referência não encontrados na resposta");
        }

        console.log("Referência gerada com sucesso!");
        // setShowNewReferenceModal(false);
        setNewReferenceData({
          amount: 0,
          customer_name: "",
          customer_phone: "",
          customer_email: "",
          description: "",
          payment_method: "multicaixa",
          transaction_id: ""
        });
        fetchTransactions();
      }
    } catch (error: any) {
      console.log("Tenant id", user.tenant_id)
      console.error("Erro ao gerar referência:", error);
      const errorMessage = error.response?.data?.message || "Erro ao gerar referência";
      console.log(errorMessage);
      toast.error(errorMessage);
    } finally {
      setGeneratingReference(false);
    }
  };

  const handleViewDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowDetailsModal(true);
  };

  const total = transactions.length;
  const pendentes = transactions.filter(t => t.status === "pending").length;
  const concluidas = transactions.filter(t => t.status === "success").length;
  const falha = transactions.filter(t => t.status === "failed").length;

  const totalRecebido = transactions
    .filter(t => t.status === "success")
    .reduce((acc, t) => acc + t.amount, 0);

  const handleSort = (key: keyof Transaction) => {
    setSortConfig((prev) => {
      if (prev?.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  const sortedTransactions = [...transactions].sort((a, b) => {
    if (!sortConfig) return 0;

    const { key, direction } = sortConfig;
    let comparison = 0;

    if (key === "created_at") {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      comparison = dateA < dateB ? -1 : dateA > dateB ? 1 : 0;
    } else {
      if (a[key] < b[key]) comparison = -1;
      if (a[key] > b[key]) comparison = 1;
    }

    return direction === "asc" ? comparison : -comparison;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-[#111827]">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 dark:text-gray-300">Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-white dark:bg-[#111827] min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Transações</h1>
        {transactions.length === 0 && !loading && (
          <p className="text-gray-600 dark:text-gray-300">Nenhuma transação encontrada</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <CardStat title="Total de Transações" amount={total.toString()} change="+12.5%" icon={<FiCreditCard />} />
        <CardStat title="Pendentes" amount={pendentes.toString()} change="+3.2%" icon="Kz" />
        <CardStat title="Falhas" amount={falha.toString()} change="+8.7%" icon="Kz" />
        <CardStat title="Concluídas" amount={concluidas.toString()} change="+8.7%" icon="Kz" />
        <CardStat
          title="Total Recebido"
          amount={(totalRecebido).toLocaleString("pt-BR", { style: "currency", currency: "AOA" })}
          change="+5.1%"
          icon="Kz"
        />
      </div>

      <Card className="p-6 bg-[#F9FAFB] dark:bg-[#1F2937] border-0 rounded-xl shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Transações Recentes</h2>
          <Button
            onClick={() => {
              setShowNewReferenceModal(true);
              setReferenceResult(null);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 cursor-pointer"
          >
            <FiPlus size={18} />
            Nova Referência
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm font-medium text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                <th className="pb-3 px-4">Cliente</th>
                <th className="pb-3 px-4">Método</th>
                <th className="pb-3 px-4 cursor-pointer" onClick={() => handleSort("amount")}>
                  <div className="flex items-center gap-1">
                    Valor
                    <ArrowUpDown
                      size={14}
                      className={`${sortConfig?.key === "amount" ? "opacity-100" : "opacity-40"}`}
                    />
                  </div>
                </th>
                <th className="pb-3 px-4">Status</th>
                <th className="pb-3 px-4 cursor-pointer" onClick={() => handleSort("created_at")}>
                  <div className="flex items-center gap-1">
                    Data
                    <ArrowUpDown
                      size={14}
                      className={`${sortConfig?.key === "created_at" ? "opacity-100" : "opacity-40"}`}
                    />
                  </div>
                </th>
                <th className="pb-3 px-4">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {sortedTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="py-4 px-4 text-gray-900 dark:text-white">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                        <FiCreditCard className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                      </div>
                      {transaction.customer_name}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-700 dark:text-gray-300">{transaction.payment_method}</td>
                  <td className="py-4 px-4 font-medium text-gray-900 dark:text-white">
                    {(transaction.amount).toLocaleString("pt-BR", { style: "currency", currency: "AOA" })}
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${transaction.status === 'success'
                      ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                      : transaction.status === 'pending'
                        ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                        : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                      }`}>
                      {transaction.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-500 dark:text-gray-400">
                    {new Date(transaction.created_at).toLocaleString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })}
                  </td>
                  <td className="py-4 px-4">
                    <Button
                      onClick={() => handleViewDetails(transaction)}
                      className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 flex items-center gap-2"
                      size="sm"
                    >
                      <FiEye size={14} />
                      Detalhes
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal Nova Referência */}
      {showNewReferenceModal && (
        <div className="fixed inset-0 bg-black/30 dark:bg-black/40 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#1F2937] rounded-xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {referenceResult ? "Referência Criada" : "Nova Referência"}
            </h3>

            {!referenceResult ? (
              // Formulário para criar referência
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nome do Cliente *
                  </label>
                  <input
                    type="text"
                    value={newReferenceData.customer_name}
                    onChange={(e) => setNewReferenceData({
                      ...newReferenceData,
                      customer_name: e.target.value
                    })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Digite o nome do cliente"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Telefone
                  </label>
                  <input
                    type="text"
                    value={newReferenceData.customer_phone}
                    onChange={(e) => setNewReferenceData({ ...newReferenceData, customer_phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Ex: 943558106"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    E-mail
                  </label>
                  <input
                    type="email"
                    value={newReferenceData.customer_email}
                    onChange={(e) => setNewReferenceData({ ...newReferenceData, customer_email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Ex: cliente@email.com"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Método de Pagamento *
                    </label>
                    <select
                      value={newReferenceData.payment_method}
                      onChange={(e) => setNewReferenceData({ ...newReferenceData, payment_method: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value="multicaixa">Multicaixa</option>
                      <option value="reference">Referência (Reference)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Montante (AOA) *
                    </label>
                    <input
                      type="number"
                      value={newReferenceData.amount || ""}
                      onChange={(e) => setNewReferenceData({
                        ...newReferenceData,
                        amount: parseFloat(e.target.value) || 0
                      })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Valor"
                      min="1"
                      step="0.01"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Transaction ID
                    </label>
                    <input
                      type="text"
                      value={newReferenceData.transaction_id}
                      onChange={(e) => setNewReferenceData({ ...newReferenceData, transaction_id: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Ex: MC7F4A1B9"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Descrição
                    </label>
                    <input
                      type="text"
                      value={newReferenceData.description}
                      onChange={(e) => setNewReferenceData({ ...newReferenceData, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Descrição da compra"
                    />
                  </div>
                </div>
                <div className="pt-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    * Campos obrigatórios
                  </p>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    onClick={() => {
                      setShowNewReferenceModal(false);
                      setNewReferenceData({ amount: 0, customer_name: "", customer_phone: "", customer_email: "", description: "", payment_method: "multicaixa", transaction_id: "" });
                    }}
                    className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-colors cursor-pointer"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleGenerateReference}
                    disabled={generatingReference || newReferenceData.amount <= 0 || !newReferenceData.customer_name.trim()}
                    className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    {generatingReference ? "Gerando..." : "Gerar Referência"}
                  </Button>
                </div>
              </div>
            ) : (
              // Resultado da referência criada
              <div className="space-y-6">
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <div className="flex items-center justify-center mb-3">
                    <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                      <svg className="h-5 w-5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-center text-green-800 dark:text-green-300 font-medium">
                    Referência gerada com sucesso!
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Entidade</p>
                        <p className="text-gray-900 dark:text-white font-bold text-lg">
                          {referenceResult.entity}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Referência</p>
                        <p className="text-gray-900 dark:text-white font-bold text-lg font-mono">
                          {referenceResult.referenceNumber}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/*
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
                Como pagar:
              </h4>
              <ol className="text-xs text-blue-700 dark:text-blue-400 space-y-1 pl-4">
                <li>1. Vá a uma ATM ou agência bancária</li>
                <li>2. Selecione "Pagamento de Serviços"</li>
                <li>3. Digite a entidade: <span className="font-bold">{referenceResult.entity}</span></li>
                <li>4. Digite a referência: <span className="font-bold">{referenceResult.reference}</span></li>
                <li>5. Confirme o valor: <span className="font-bold">{newReferenceData.amount.toLocaleString("pt-BR", { style: "currency", currency: "AOA" })}</span></li>
              </ol>
            </div> 
            
            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={() => {
                  // Copiar referência para área de transferência
                  const textToCopy = `Entidade: ${referenceResult.entity}\nReferência: ${referenceResult.reference}\nValor: ${newReferenceData.amount.toLocaleString("pt-BR", { style: "currency", currency: "AOA" })}`;
                  navigator.clipboard.writeText(textToCopy);
                  alert("Referência copiada para a área de transferência!");
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copiar Referência
              </button>
              
              <button
                onClick={() => {
                  // Gerar PDF ou imagem da referência
                  alert("Funcionalidade de impressão/PDF em desenvolvimento");
                }}
                className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Imprimir/PDF
              </button>
            </div>*/}
                </div>

                <div className="flex justify-end pt-4">
                  <Button
                    onClick={() => {
                      setShowNewReferenceModal(false);
                      setNewReferenceData({ amount: 0, customer_name: "", customer_phone: "", customer_email: "", description: "", payment_method: "multicaixa", transaction_id: "" });
                      setReferenceResult(null);
                      toast.success("Referencia criada com sucesso");
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer"
                  >
                    Fechar
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal Detalhes da Transação */}
      {showDetailsModal && selectedTransaction && (
        <div className="fixed inset-0 bg-black/30 dark:bg-black/40 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#1F2937] rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Detalhes da Transação</h3>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="bg-gray-50 dark:bg-gray-800/50 p-5 rounded-xl border border-gray-200 dark:border-gray-700">
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Informações do Cliente</h4>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Nome</p>
                      <p className="text-gray-900 dark:text-white font-medium">{selectedTransaction.customer_name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Email</p>
                      <p className="text-gray-900 dark:text-white">{selectedTransaction.customer_email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Telefone</p>
                      <p className="text-gray-900 dark:text-white">{selectedTransaction.customer_phone}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800/50 p-5 rounded-xl border border-gray-200 dark:border-gray-700">
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Informações da Loja</h4>
                  <p className="text-gray-900 dark:text-white font-medium">{selectedTransaction.shop_name}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-50 dark:bg-gray-800/50 p-5 rounded-xl border border-gray-200 dark:border-gray-700">
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Detalhes da Transação</h4>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">ID</p>
                      <p className="text-gray-900 dark:text-white font-mono text-sm bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-md">
                        {selectedTransaction.id}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Método de Pagamento</p>
                      <p className="text-gray-900 dark:text-white font-medium">{selectedTransaction.payment_method}</p>
                      {selectedTransaction.metadata && selectedTransaction.metadata.trim() !== "" && (
                        <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded-md">
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Referência:</p>
                          <p className="text-gray-900 dark:text-white text-sm font-mono break-words">
                            {selectedTransaction.metadata}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Status</p>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${selectedTransaction.status === 'success'
                          ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                          : selectedTransaction.status === 'pending'
                            ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                            : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                          }`}>
                          {selectedTransaction.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Valor</p>
                        <p className="text-gray-900 dark:text-white text-xl font-bold">
                          {(selectedTransaction.amount).toLocaleString("pt-BR", { style: "currency", currency: "AOA" })}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Data e Hora</p>
                      <p className="text-gray-900 dark:text-white">
                        {new Date(selectedTransaction.created_at).toLocaleString("pt-BR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-6 mt-6 border-t border-gray-200 dark:border-gray-700">
              <Button
                onClick={() => setShowDetailsModal(false)}
                className="bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer"
              >
                Fechar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}