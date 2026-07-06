"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { StripeService } from "@/services/stripe.service";
import { useAuth } from "@/hooks/useAuth";
import type { TransactionSummaryResponse, AdminClientSummary } from "@/types/stripe";

export function useTransactionSummary() {
  const { user } = useAuth();
  const isAdmin = user?.user_type === "admin";
  const userId = user?.id;
  const queryClient = useQueryClient();

  const adminClientsQuery = useQuery<AdminClientSummary[]>({
    queryKey: ["transactions", "admin-clients"],
    queryFn: async () => {
      const res = await StripeService.getAdminClientsSummary();
      return Array.isArray(res.data) ? res.data : [];
    },
    enabled: isAdmin,
  });

  const userSummaryQuery = useQuery<TransactionSummaryResponse>({
    queryKey: ["transactions", "user-summary", userId],
    queryFn: async () => {
      if (!userId) throw new Error("User ID not found");
      const res = await StripeService.getTransactionSummary(userId);
      return res.data;
    },
    enabled: !!userId && !isAdmin,
  });

  return {
    adminClients: adminClientsQuery.data ?? [],
    isLoadingAdminClients: adminClientsQuery.isLoading,
    userSummary: userSummaryQuery.data ?? null,
    isLoadingUserSummary: userSummaryQuery.isLoading,
    refresh: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions", "admin-clients"] });
      queryClient.invalidateQueries({ queryKey: ["transactions", "user-summary"] });
    },
  };
}
