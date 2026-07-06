"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { StripeService } from "@/services/stripe.service";
import { useAuth } from "@/hooks/useAuth";
import type { PayPayBalance, PayPayMovement } from "@/types/stripe";

export function usePayPayFund() {
  const { user } = useAuth();
  const isAdmin = user?.user_type === "admin";
  const queryClient = useQueryClient();

  const balanceQuery = useQuery<PayPayBalance>({
    queryKey: ["paypay-balance"],
    queryFn: async () => {
      const res = await StripeService.getPayPayBalance();
      return res.data;
    },
    enabled: isAdmin,
  });

  const movementsQuery = useQuery<PayPayMovement[]>({
    queryKey: ["paypay-movements"],
    queryFn: async () => {
      const res = await StripeService.getPayPayMovements();
      return Array.isArray(res.data) ? res.data : [];
    },
    enabled: isAdmin,
  });

  const topupMutation = useMutation({
    mutationFn: (payload: { amount: number; reference: string; description?: string }) =>
      StripeService.createPayPayTopup(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["paypay-balance"] });
      queryClient.invalidateQueries({ queryKey: ["paypay-movements"] });
    },
  });

  const validateDebitMutation = useMutation({
    mutationFn: (payload: { amount: number }) =>
      StripeService.validatePayPayDebit(payload),
  });

  return {
    balance: balanceQuery.data ?? null,
    isLoadingBalance: balanceQuery.isLoading,
    balanceError: balanceQuery.error,
    movements: movementsQuery.data ?? [],
    isLoadingMovements: movementsQuery.isLoading,
    movementsError: movementsQuery.error,
    topup: topupMutation.mutate,
    isTopuping: topupMutation.isPending,
    topupError: topupMutation.error,
    topupData: topupMutation.data,
    validateDebit: validateDebitMutation.mutate,
    isValidating: validateDebitMutation.isPending,
    validateDebitData: validateDebitMutation.data,
    validateDebitError: validateDebitMutation.error,
    refresh: () => {
      queryClient.invalidateQueries({ queryKey: ["paypay-balance"] });
      queryClient.invalidateQueries({ queryKey: ["paypay-movements"] });
    },
  };
}
