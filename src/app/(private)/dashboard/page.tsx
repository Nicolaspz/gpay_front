'use client'
import { CardStat } from "@/components/dashboard/CardStat";
import { FiEye, FiAward, FiCheckCircle, FiAlertTriangle, FiXCircle } from "react-icons/fi";
import TrendsChart from "@/components/dashboard/TrendsChart";
import OptimizationDonut from "@/components/dashboard/OptimizationDonut";
import { useAuth } from "@/hooks/useAuth";
import { useTransactions } from "@/hooks/useTransactions";
import { formatCurrency, getDashboardMetrics } from "@/utils/dashboard";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.05 }
  }
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] as const } }
};

export default function Dashboard() {
  const { user } = useAuth();
  const isAdmin = user?.user_type === "admin";
  const { data: transactions = [], isLoading: loading } = useTransactions();
  const metrics = getDashboardMetrics(transactions);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Skeleton className="h-[140px] rounded-[var(--radius-xl)]" />
          <Skeleton className="h-[100px] rounded-[var(--radius-lg)]" />
          <Skeleton className="h-[100px] rounded-[var(--radius-lg)]" />
          <Skeleton className="h-[100px] rounded-[var(--radius-lg)]" />
          <Skeleton className="h-[100px] rounded-[var(--radius-lg)]" />
          <Skeleton className="h-[100px] rounded-[var(--radius-lg)]" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6 pb-8"
    >
      {/* Page header */}
      <motion.div variants={item} className="flex flex-col mb-2">
        <h1
          className="text-[22px] font-bold text-[var(--foreground)]"
          style={{ fontFamily: "var(--font-clash-display)" }}
        >
          Dashboard {isAdmin ? "Administrativo" : "Geral"}
        </h1>
        <p className="text-sm text-[var(--muted-foreground)]">
          {isAdmin ? "Visão consolidada de todas as operações do sistema" : "Resumo da sua conta e operações"}
        </p>
      </motion.div>

      {!loading && transactions.length === 0 && (
        <motion.div variants={item}>
          <p className="text-base font-medium text-[var(--muted-foreground)]">
            Nenhum evento encontrado
          </p>
        </motion.div>
      )}

      {/* Bento grid — metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Hero card — spans 2 cols */}
        <motion.div variants={item} className="sm:col-span-2">
          <CardStat
            title="Total de Transações"
            amount={metrics.total.toString()}
            change={metrics.successChange}
            icon={<FiEye className="text-[var(--accent-primary)] text-xl" />}
            hero
            sparklineData={metrics.chartData?.map((d: any) => ({ value: d.success })) || []}
          />
        </motion.div>

        <motion.div variants={item}>
          <CardStat
            title="Transações Concluídas"
            amount={metrics.success.toString()}
            change={metrics.successChange}
            icon={<FiCheckCircle className="text-[var(--success)] text-xl" />}
          />
        </motion.div>

        <motion.div variants={item}>
          <CardStat
            title="Total Falhadas"
            amount={metrics.failed.toString()}
            change={`${metrics.failedPercent.toFixed(1)}%`}
            icon={<FiXCircle className="text-[var(--danger)] text-xl" />}
          />
        </motion.div>

        <motion.div variants={item}>
          <CardStat
            title="Total Pendentes"
            amount={metrics.pending.toString()}
            change={`${metrics.pendingPercent.toFixed(1)}%`}
            icon={<FiAlertTriangle className="text-[var(--warning)] text-xl" />}
          />
        </motion.div>

        <motion.div variants={item}>
          <CardStat
            title="Total Recebido"
            amount={formatCurrency(metrics.totalReceived)}
            change={metrics.successChange}
            icon={<FiCheckCircle className="text-[var(--info)] text-xl" />}
          />
        </motion.div>

        <motion.div variants={item}>
          <CardStat
            title="Maior Transação"
            amount={formatCurrency(metrics.highestSuccessAmount)}
            change="+1"
            icon={<FiAward className="text-[var(--accent-primary)] text-xl" />}
          />
        </motion.div>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div variants={item} className="lg:col-span-2">
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius-lg)] p-5 shadow-[var(--shadow-xs)]">
            <div className="mb-4">
              <h2 className="text-[15px] font-bold text-[var(--foreground)]" style={{ fontFamily: "var(--font-clash-display)" }}>
                Tendências
              </h2>
              <p className="text-xs text-[var(--muted-foreground)] mt-0.5">Volume de transações por status</p>
            </div>
            <TrendsChart data={metrics.chartData} />
          </div>
        </motion.div>

        <motion.div variants={item}>
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius-lg)] p-5 shadow-[var(--shadow-xs)] h-full">
            <div className="mb-4">
              <h2 className="text-[15px] font-bold text-[var(--foreground)]" style={{ fontFamily: "var(--font-clash-display)" }}>
                Transações por Tipo
              </h2>
              <p className="text-xs text-[var(--muted-foreground)] mt-0.5">Distribuição por método de pagamento</p>
            </div>
            <OptimizationDonut data={metrics.paymentMethodData} />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
