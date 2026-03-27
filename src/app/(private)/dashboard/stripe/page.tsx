'use client'
import { FiEye, FiCheckCircle, FiAlertTriangle, FiDollarSign, FiX, FiUploadCloud } from "react-icons/fi";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import axios from "axios";
import { toast } from 'react-toastify';

export default function AdminStripeDashboard() {
   const [loading, setLoading] = useState(true);
   const [summaries, setSummaries] = useState<any[]>([]);
   
   // View specific user transactions
   const [selectedUser, setSelectedUser] = useState<string | null>(null);
   const [transactions, setTransactions] = useState<any[]>([]);
   const [loadingTx, setLoadingTx] = useState(false);

   // Liquidation Modal
   const [liquidationModal, setLiquidationModal] = useState<{ userId: string, currency: string } | null>(null);
   const [receiptUrl, setReceiptUrl] = useState("");
   
   const { user } = useContext(AuthContext);

   useEffect(() => {
     if (user === null) return;
     fetchSummaries();
   }, [user]);

   async function fetchSummaries() {
     try {
       setLoading(true);
       const token = 'Bearer GPayment_Secret_Default_2024';
       const res = await axios.get(`https://stripe-server-ztck.onrender.com/api/v1/transactions/admin/clients`, { headers: { Authorization: token } });
       setSummaries(res.data);
     } catch (error) {
       console.error("Erro ao buscar dados da Stripe:", error);
     } finally {
       setLoading(false);
     }
   }

   async function viewClientTransactions(userId: string) {
     setSelectedUser(userId);
     setLoadingTx(true);
     try {
       const token = 'Bearer GPayment_Secret_Default_2024';
       const res = await axios.get(`https://stripe-server-ztck.onrender.com/api/v1/transactions/user/${userId}`, { headers: { Authorization: token } });
       setTransactions(res.data);
     } catch (error) {
       toast.error("Erro ao carregar transações");
     } finally {
       setLoadingTx(false);
     }
   }

   async function handleLiquidate(e: React.FormEvent) {
     e.preventDefault();
     if (!liquidationModal) return;
     try {
       const token = 'Bearer GPayment_Secret_Default_2024';
       await axios.post(
         `https://stripe-server-ztck.onrender.com/api/v1/transactions/admin/liquidate/${liquidationModal.userId}`,
         { currency: liquidationModal.currency, receiptUrl },
         { headers: { Authorization: token } }
       );
       toast.success("Liquidação concluída com sucesso!");
       setLiquidationModal(null);
       setReceiptUrl("");
       fetchSummaries();
       if (selectedUser === liquidationModal.userId) {
          viewClientTransactions(selectedUser);
       }
     } catch (error) {
        toast.error("Erro ao processar liquidação");
     }
   }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 dark:text-gray-300">A carregar clientes da Stripe...</p>
        </div>
      </div>
    );
  }
   
  return (
    <div className="space-y-6">
      <div className="flex flex-col mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">
            Administração Stripe (GPayment)
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Gere todas as contas, transações e liquidações dos clientes processados via Stripe.
          </p>
      </div>

      {/* Lista de Clientes Agrupada por Moeda */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mt-8 overflow-hidden border border-gray-100 dark:border-gray-700">
        <div className="p-5 border-b border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Saldos dos Clientes (Por Moeda)</h2>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
            <thead>
                <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                <th className="p-4 font-medium text-gray-500 dark:text-gray-400 text-sm">ID do Cliente</th>
                <th className="p-4 font-medium text-gray-500 dark:text-gray-400 text-sm">Moeda</th>
                <th className="p-4 font-medium text-gray-500 dark:text-gray-400 text-sm">Bruto Processado</th>
                <th className="p-4 font-medium text-gray-500 dark:text-gray-400 text-sm">Líquido a Pagar (Pendente)</th>
                <th className="p-4 font-medium text-gray-500 dark:text-gray-400 text-sm">Já Pago (Liquidado)</th>
                <th className="p-4 font-medium text-gray-500 dark:text-gray-400 text-sm">Ações</th>
                </tr>
            </thead>
            <tbody>
                {summaries.map((s: any, idx) => (
                <tr key={`${s.userId}-${s.currency}-${idx}`} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                    <td className="p-4 text-sm font-mono text-gray-800 dark:text-gray-300">{s.userId}</td>
                    <td className="p-4 text-sm font-bold text-gray-700 dark:text-gray-300">{s.currency}</td>
                    <td className="p-4 text-sm text-gray-600 dark:text-gray-400">{(s.totalGrossAmount || 0).toLocaleString("pt-PT", { style: "currency", currency: s.currency })}</td>
                    <td className="p-4 text-sm font-bold text-orange-500">{(s.totalPendingPayoutAmount || 0).toLocaleString("pt-PT", { style: "currency", currency: s.currency })}</td>
                    <td className="p-4 text-sm font-semibold text-green-600">{(s.totalPaidOutAmount || 0).toLocaleString("pt-PT", { style: "currency", currency: s.currency })}</td>
                    <td className="p-4 flex gap-2">
                       <button onClick={() => viewClientTransactions(s.userId)} className="px-3 py-1 bg-blue-50 text-blue-600 text-xs rounded hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50">
                         Ver Transações
                       </button>
                       {s.totalPendingPayoutAmount > 0 && (
                         <button onClick={() => setLiquidationModal({ userId: s.userId, currency: s.currency })} className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 flex items-center gap-1">
                           <FiDollarSign /> Liquidar
                         </button>
                       )}
                    </td>
                </tr>
                ))}
                {summaries.length === 0 && (
                <tr><td colSpan={6} className="p-6 text-center text-gray-500 dark:text-gray-400">Nenhum cliente encontrado com transações na Stripe.</td></tr>
                )}
            </tbody>
            </table>
        </div>
      </div>

      {/* Tabela de Transações Específicas */}
      {selectedUser && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mt-8 overflow-hidden border border-gray-100 dark:border-gray-700 animate-in fade-in slide-in-from-bottom-4">
          <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
              <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Transações do Cliente</h2>
                  <p className="text-xs text-gray-500">ID: {selectedUser}</p>
              </div>
              <button onClick={() => setSelectedUser(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-white">
                <FiX className="text-2xl" />
              </button>
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
                  <th className="p-4 font-medium text-gray-500 dark:text-gray-400 text-xs">Referência</th>
                  <th className="p-4 font-medium text-gray-500 dark:text-gray-400 text-xs">Data</th>
                  <th className="p-4 font-medium text-gray-500 dark:text-gray-400 text-xs">Bruto</th>
                  <th className="p-4 font-medium text-gray-500 dark:text-gray-400 text-xs">Tarifa</th>
                  <th className="p-4 font-medium text-gray-500 dark:text-gray-400 text-xs">Líquido (Loja)</th>
                  <th className="p-4 font-medium text-gray-500 dark:text-gray-400 text-xs">Estado Stripe</th>
                  <th className="p-4 font-medium text-gray-500 dark:text-gray-400 text-xs">Estado Pagamento</th>
                  <th className="p-4 font-medium text-gray-500 dark:text-gray-400 text-xs">Comprovativo</th>
                  </tr>
              </thead>
              <tbody>
                  {transactions.map((tx: any) => (
                  <tr key={tx.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                      <td className="p-4 text-xs text-gray-800 dark:text-gray-300 font-mono" title={tx.stripeSessionId}>{tx.stripeSessionId?.substring(0,14)}...</td>
                      <td className="p-4 text-xs text-gray-600 dark:text-gray-400">{new Date(tx.createdAt).toLocaleString()}</td>
                      <td className="p-4 text-xs font-medium text-gray-900 dark:text-white">{(tx.grossAmount || 0).toLocaleString("pt-PT", { style: "currency", currency: tx.currency || "USD" })}</td>
                      <td className="p-4 text-xs text-red-500">-{(tx.feeAmount || 0).toLocaleString("pt-PT", { style: "currency", currency: tx.currency || "USD" })}</td>
                      <td className="p-4 text-xs font-semibold text-green-600">{(tx.netAmount || 0).toLocaleString("pt-PT", { style: "currency", currency: tx.currency || "USD" })}</td>
                      <td className="p-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${tx.status === 'COMPLETED' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                          {tx.status}
                      </span>
                      </td>
                      <td className="p-4">
                      {tx.status === 'COMPLETED' ? (
                        <span className={`px-2 py-1 text-xs rounded-full ${tx.isPaidOut ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200' : 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300'}`}>
                            {tx.isPaidOut ? `Pago em ${new Date(tx.paidOutAt).toLocaleDateString()}` : "Pendente Payout"}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">-</span>
                      )}
                      </td>
                      <td className="p-4 text-xs">
                         {tx.receiptUrl ? (
                            <a href={tx.receiptUrl} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline flex items-center gap-1">
                               <FiEye /> Ver Link
                            </a>
                         ) : '-'}
                      </td>
                  </tr>
                  ))}
                  {transactions.length === 0 && (
                  <tr><td colSpan={8} className="p-6 text-center text-gray-500 dark:text-gray-400">Nenhuma transação encontrada.</td></tr>
                  )}
              </tbody>
              </table>
          </div>
        </div>
      )}

      {/* Modal de Liquidação */}
      {liquidationModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
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
                          className="w-full flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-transparent dark:text-white sm:text-sm"
                       />
                    </div>
                 </div>

                 <div className="flex justify-end gap-3 mt-6">
                    <button type="button" onClick={() => setLiquidationModal(null)} className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                       Cancelar
                    </button>
                    <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center gap-2">
                       <FiCheckCircle /> Confirmar Liquidação
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}
