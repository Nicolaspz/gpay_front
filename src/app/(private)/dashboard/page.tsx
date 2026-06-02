'use client'
import { CardStat } from "@/components/dashboard/CardStat";
import { FiEye, FiAward, FiCheckCircle, FiAlertTriangle, FiXCircle } from "react-icons/fi";
import TrendsChart from "@/components/dashboard/TrendsChart";
import OptimizationDonut from "@/components/dashboard/OptimizationDonut";
import { useAuth } from "@/hooks/useAuth";
import { useTransactions } from "@/hooks/useTransactions";
import { formatCurrency, getDashboardMetrics } from "@/utils/dashboard";

export default function Dashboard() {
  const { user } = useAuth();
  const isAdmin = user?.user_type === "admin";
  const { data: transactions = [], isLoading: loading } = useTransactions();
  const metrics = getDashboardMetrics(transactions);

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
    <div className="space-y-6 pb-8">
      <div className="flex flex-col mb-2">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Dashboard {isAdmin ? "Administrativo" : "Geral"}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {isAdmin ? "Visão consolidada de todas as operações do sistema" : "Resumo da sua conta e operações"}
        </p>
      </div>
      
      {!loading && transactions.length === 0 && (
        <h1 className="text-xl font-semibold text-gray-600 dark:text-gray-300">
          Nenhum evento encontrado
        </h1>
      )}
      {/* Linha dos 4 cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <CardStat
          title="Todas transações"
          amount={metrics.total.toString()}
          change="+85.5%"
          icon={<FiEye className="text-blue-400 text-xl" />}
        />
        <CardStat
          title="Transações Concluidas"
          amount={metrics.success.toString()}
          change={metrics.successChange}
          icon={<FiCheckCircle className="text-green-400 text-xl" />}
        />
        <CardStat
          title="Total Recebido"
          amount={formatCurrency(metrics.totalReceived)}
          change={metrics.successChange}
          icon={<FiCheckCircle className="text-orange-400 text-xl" />}
        />
        <CardStat
          title="Total Falhadas"
          amount={metrics.failed.toString()}
          change={`${metrics.failedPercent.toFixed(1)}%`}
          icon={<FiXCircle className="text-purple-400 text-xl" />}
        />
        <CardStat
          title="Total Pedentes"
          amount={metrics.pending.toString()}
          change={`${metrics.pendingPercent.toFixed(1)}%`}
          icon={<FiAlertTriangle className="text-purple-400 text-xl" />}
        />
        <CardStat
          title="Maior Transação"
          amount={formatCurrency(metrics.highestSuccessAmount)}
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

            <TrendsChart data={metrics.chartData} />
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
            <OptimizationDonut data={metrics.paymentMethodData} />
          </div>
        </div>
      </div>
    </div>
  );
}
