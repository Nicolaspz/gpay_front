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
  const stripeUserId = user?.id;

  const summariesQuery = useQuery<StripeSummary[]>({
    queryKey: ["stripe-summaries", isAdmin, stripeUserId],
    queryFn: async () => {
      if (!user || isAdmin) return [];
      const res = await StripeService.getSummaries(stripeUserId);
      return res.data;
    },
    enabled: !!user && !isAdmin,
  });

  const oldTxQuery = useQuery<StripeTransaction[]>({
    queryKey: ["stripe-old-transactions", isAdmin, stripeUserId],
    queryFn: async () => {
      if (!user) return [];
      const res = await StripeService.getOldTransactions(isAdmin, stripeUserId);
      return res.data;
    },
    enabled: !!user,
  });

  const newTxQuery = useQuery<StripeTransaction[]>({
    queryKey: ["stripe-new-transactions", isAdmin, stripeUserId],
    queryFn: async () => {
      if (!user) return [];
      const res = await StripeService.getNewTransactions(isAdmin, stripeUserId);
      return res.data;
    },
    enabled: !!user,
  });

  const stats: StripeStats = useMemo(() => {
    let totalGross = 0;
    let totalNet = 0;
    let totalPending = 0;
    let totalPaid = 0;
    let totalGrossUSD = 0;
    let totalGrossAOA = 0;
    let totalNetUSD = 0;
    let totalNetAOA = 0;

    if (isAdmin) {
      (oldTxQuery.data ?? []).forEach((tx) => {
        if (tx.status === "COMPLETED") {
          totalGross += tx.grossAmount || 0;
          totalNet += tx.netAmount || 0;
          if (tx.isPaidOut) {
            totalPaid += tx.netAmount || 0;
          } else {
            totalPending += tx.netAmount || 0;
          }
        }
        const curr = (tx.currency || "").toUpperCase();
        if (curr === "USD") {
          totalGrossUSD += tx.grossAmount || 0;
          totalNetUSD += tx.netAmount || 0;
        } else if (curr === "AOA") {
          totalGrossAOA += tx.grossAmount || 0;
          totalNetAOA += tx.netAmount || 0;
        }
      });
    } else {
      (summariesQuery.data ?? []).forEach((s) => {
        totalGross += s.totalGrossAmount || 0;
        totalNet += s.totalNetAmount || 0;
        totalPending += s.totalPendingPayoutAmount || 0;
        totalPaid += s.totalPaidOutAmount || 0;
      });
      (oldTxQuery.data ?? []).forEach((tx) => {
        const curr = (tx.currency || "").toUpperCase();
        if (curr === "USD") {
          totalGrossUSD += tx.grossAmount || 0;
          totalNetUSD += tx.netAmount || 0;
        } else if (curr === "AOA") {
          totalGrossAOA += tx.grossAmount || 0;
          totalNetAOA += tx.netAmount || 0;
        }
      });
    }

    return {
      totalGross,
      totalNet,
      totalPending,
      totalPaid,
      count: (oldTxQuery.data ?? []).length,
      totalGrossUSD,
      totalGrossAOA,
      totalNetUSD,
      totalNetAOA,
    };
  }, [summariesQuery.data, oldTxQuery.data, isAdmin]);

  return {
    oldTransactions: oldTxQuery.data ?? [],
    newTransactions: newTxQuery.data ?? [],
    summaries: summariesQuery.data ?? [],
    stats,
    isAdmin,
    tenantId: user?.tenant_id || user?.tenant?.tenant_id,
    isLoading:
      (!isAdmin && summariesQuery.isLoading) ||
      (oldTxQuery.isLoading && (oldTxQuery.data ?? []).length === 0),
  };
}
