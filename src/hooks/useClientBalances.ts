"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { StripeService } from "@/services/stripe.service";
import { useAuth } from "@/hooks/useAuth";
import type { ClientBalance, RebuildBalancesResponse } from "@/types/stripe";

export function useClientBalances() {
  const { user } = useAuth();
  const isAdmin = user?.user_type === "admin";
  const queryClient = useQueryClient();

  const allBalancesQuery = useQuery<ClientBalance[]>({
    queryKey: ["client-balances", "admin-all"],
    queryFn: async () => {
      const res = await StripeService.getAllClientBalances();
      return Array.isArray(res.data) ? res.data : [];
    },
    enabled: isAdmin,
  });

  const rebuildMutation = useMutation<RebuildBalancesResponse>({
    mutationFn: async () => {
      const res = await StripeService.rebuildBalances();
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["client-balances"] });
    },
  });

  return {
    allBalances: allBalancesQuery.data ?? [],
    isLoadingBalances: allBalancesQuery.isLoading,
    balancesError: allBalancesQuery.error,
    rebuild: rebuildMutation.mutate,
    isRebuilding: rebuildMutation.isPending,
    rebuildResult: rebuildMutation.data,
    rebuildError: rebuildMutation.error,
  };
}
