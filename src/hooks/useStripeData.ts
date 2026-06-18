import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { StripeService } from "@/services/stripe.service";
import type {
  StripeTransaction,
  StripeSummary,
  StripeStats,
} from "@/types/stripe";

export function useStripeData() {
  const { user } = useAuth();
  const isAdmin = user?.user_type === "admin";
  const stripeUserId = isAdmin ? undefined : user?.id;

  const summariesQuery = useQuery<StripeSummary[]>({
    queryKey: ["stripe-summaries", isAdmin, stripeUserId],
    queryFn: async () => {
      if (!user || isAdmin) return [];
      const res = await StripeService.getSummaries(stripeUserId);
      return res.data;
    },
    enabled: !!user && !isAdmin,
  });

  const transactionsQuery = useQuery<StripeTransaction[]>({
    queryKey: ["stripe-transactions", isAdmin, stripeUserId],
    queryFn: async () => {
      if (!user) return [];
      const res = await StripeService.getTransactions(isAdmin, stripeUserId);
      return res.data;
    },
    enabled: !!user,
  });

  const stats: StripeStats = useMemo(() => {
    let totalGross = 0;
    let totalNet = 0;
    let totalPending = 0;
    let totalPaid = 0;

    if (isAdmin) {
      (transactionsQuery.data ?? []).forEach((tx) => {
        if (tx.status === "COMPLETED") {
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
      (summariesQuery.data ?? []).forEach((s) => {
        totalGross += s.totalGrossAmount || 0;
        totalNet += s.totalNetAmount || 0;
        totalPending += s.totalPendingPayoutAmount || 0;
        totalPaid += s.totalPaidOutAmount || 0;
      });
    }

    return {
      totalGross,
      totalNet,
      totalPending,
      totalPaid,
      count: (transactionsQuery.data ?? []).length,
    };
  }, [summariesQuery.data, transactionsQuery.data, isAdmin]);

  return {
    transactions: transactionsQuery.data ?? [],
    summaries: summariesQuery.data ?? [],
    stats,
    isAdmin,
    tenantId: user?.tenant_id || user?.tenant?.tenant_id,
    isLoading:
      (!isAdmin && summariesQuery.isLoading) ||
      (transactionsQuery.isLoading && (transactionsQuery.data ?? []).length === 0),
  };
}
