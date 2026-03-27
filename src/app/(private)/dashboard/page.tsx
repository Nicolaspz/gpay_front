'use client'
import { CardStat } from "@/components/dashboard/CardStat";
import { FiEye, FiAward,FiCheckCircle,FiAlertTriangle, FiXCircle } from "react-icons/fi";
import TrendsChart from "@/components/dashboard/TrendsChart";
import OptimizationDonut from "@/components/dashboard/OptimizationDonut";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { api } from "@/services/apiClients";
import prepareChartData from "@/lib/dasboard";
import { Transaction } from "@/types/global";
import { parseCookies } from "nookies";




export default function Dashboard() {
   const [loading, setLoading] = useState(true);
   const [transactions, setTransactions] = useState<Transaction[]>([]);
   const { '@gCorporate.token': token } = parseCookies();
   
   const { user } = useContext(AuthContext);
   useEffect(() => {
       if (user === null) return;
       const tenantId = user.tenant_id || user.tenant?.tenant_id;
       if (!tenantId) {
         setLoading(false);
         return;
       }
   
       async function fetchTransactions() {
         try {
           setLoading(true);
           const response = await api.get(`/transactions/tenant/${tenantId}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
           setTransactions(response.data);
           
         } catch (error) {
           console.error("Erro ao buscar transações:", error);
         } finally {
           setLoading(false);
         }
       }
   
       fetchTransactions();
     }, [user, token]);

  const total = transactions.length;
  const pendentes = transactions.filter(t => t.status === "pending").length;
  const concluidas = transactions.filter(t => t.status === "success").length;
  const falha = transactions.filter(t => t.status === "failed").length;

  const totalRecebido = transactions
    .filter(t => t.status === "success")
    .reduce((acc, t) => acc + t.amount, 0);

    const percentConcluidas = total > 0 ? (concluidas / total) * 100 : 0;
    const percentPendentes = total > 0 ? (pendentes / total) * 100 : 0;
    const percentFalha = total > 0 ? ((falha / total) * 100 ).toFixed(2): 0;

    const maiorValorConcluido = transactions
  .filter(t => t.status === "success")
  .reduce((max, t) => Math.max(max, t.amount), 0);
  
  // Se o percentual de concluídas for maior que 50% → considera positivo (+), senão negativo (-)
const changeConcluidas = percentConcluidas >= 50 
  ? `+${percentConcluidas.toFixed(1)}%` 
  : `-${(100 - percentConcluidas).toFixed(1)}%`;

  
  const chartData = prepareChartData(transactions);
  //console.log("transaction chartData", chartData);

  const paymentMethodData = Object.values(
    transactions.reduce((acc, t) => {
      if (!acc[t.payment_method]) {
        acc[t.payment_method] = { name: t.payment_method, value: 0 };
      }
      acc[t.payment_method].value += 1;
      return acc;
    }, {} as Record<string, { name: string; value: number }>)
  );
  

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
    <div className="space-y-6">
      {!loading && transactions.length === 0 && (
  <h1 className="text-xl font-semibold text-gray-600 dark:text-gray-300">
    Nenhum evento encontrado
  </h1>
)}
      {/* Linha dos 4 cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <CardStat 
          title="Todas transações"
          amount={total.toString()}
          change="+85.5%"
          icon={<FiEye className="text-blue-400 text-xl" />}
        />
        <CardStat 
          title="Transações Concluidas"
          amount={concluidas.toString()}
          change={changeConcluidas}
          icon={<FiCheckCircle className="text-green-400 text-xl" />}
        />
        <CardStat 
          title="Total Recebido"
          amount={(totalRecebido).toLocaleString("pt-BR", { style: "currency", currency: "AOA" })}
          change={changeConcluidas}
          icon={<FiCheckCircle className="text-orange-400 text-xl" />}
        />
        <CardStat 
          title="Total Falhadas"
          amount={falha.toString()}
          change={percentFalha.toString()}
          icon={<FiXCircle className="text-purple-400 text-xl" />}
        />
        <CardStat 
          title="Total Pedentes"
          amount={pendentes.toString()}
          change={percentPendentes.toString()}
          icon={<FiAlertTriangle className="text-purple-400 text-xl" />}
        />
        <CardStat 
          title="Maior Transação"
          amount={(maiorValorConcluido).toLocaleString("pt-BR", { style: "currency", currency: "AOA" })}
          change="+1"
          icon={<FiAward className="text-purple-400 text-xl" />}
        />
      </div>

      {/* Linha abaixo dividida em 2 colunas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
  {/* Coluna 1: Gráfico ocupa 2/3 */}
  <div className="lg:col-span-2">
    <div className="bg-white dark:bg-[#1F2937] rounded-xl p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
      Visibilidade
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Categorização por data
      </p>
      
      <TrendsChart data={chartData} />
    </div>
  </div>

  {/* Coluna 2: Card circular */}
  <div>
    <div className="bg-white dark:bg-[#1F2937] rounded-xl p-5 shadow-sm h-full">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
      Transações por tipo
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Categorização por tipo de transações 
      </p>
      <OptimizationDonut data={paymentMethodData} />
    </div>
  </div>
</div>
    </div>
  );
}