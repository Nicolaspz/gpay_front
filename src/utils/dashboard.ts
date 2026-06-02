import prepareChartData from "@/lib/dasboard";
import type { Transaction } from "@/types/global";

export function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "AOA" });
}

export function getDashboardMetrics(transactions: Transaction[]) {
  const total = transactions.length;
  const pending = transactions.filter((transaction) => transaction.status?.toLowerCase() === "pending").length;
  const success = transactions.filter((transaction) => transaction.status?.toLowerCase() === "success").length;
  const failed = transactions.filter((transaction) => transaction.status?.toLowerCase() === "failed").length;

  const totalReceived = transactions
    .filter((transaction) => transaction.status?.toLowerCase() === "success")
    .reduce((acc, transaction) => acc + Number(transaction.amount || 0), 0);

  const successPercent = total > 0 ? (success / total) * 100 : 0;
  const pendingPercent = total > 0 ? (pending / total) * 100 : 0;
  const failedPercent = total > 0 ? (failed / total) * 100 : 0;

  const highestSuccessAmount = transactions
    .filter((transaction) => transaction.status?.toLowerCase() === "success")
    .reduce((max, transaction) => Math.max(max, Number(transaction.amount || 0)), 0);

  const successChange = successPercent >= 50
    ? `+${successPercent.toFixed(1)}%`
    : `-${(100 - successPercent).toFixed(1)}%`;

  const paymentMethodData = Object.values(
    transactions.reduce((acc, transaction) => {
      const paymentMethod = transaction.payment_method || "N/A";

      if (!acc[paymentMethod]) {
        acc[paymentMethod] = { name: paymentMethod, value: 0 };
      }

      acc[paymentMethod].value += 1;
      return acc;
    }, {} as Record<string, { name: string; value: number }>)
  );

  return {
    total,
    pending,
    success,
    failed,
    totalReceived,
    successPercent,
    pendingPercent,
    failedPercent,
    highestSuccessAmount,
    successChange,
    chartData: prepareChartData(transactions),
    paymentMethodData,
  };
}
