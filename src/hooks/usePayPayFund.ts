"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { StripeService } from "@/services/stripe.service";
import { useAuth } from "@/hooks/useAuth";
import type { PayPayBalance, PayPayMovement } from "@/types/stripe";

export function usePayPayFund() {
  const { user } = useAuth();
  const isAdmin = user?.user_type === "admin";
  const queryClient = useQueryClient();

  const balanceQuery = useQuery<PayPayBalance | null>({
    queryKey: ["paypay-balance"],
    queryFn: async () => {
      const res = await StripeService.getPayPayBalance();
      const raw = res.data;
      if (!raw || typeof raw !== "object") return null;
      const balance = raw.data ?? raw.balance ?? raw;
      if (
        typeof balance.available_amount === "number" &&
        typeof balance.total_credited === "number" &&
        typeof balance.total_debited === "number"
      ) {
        return balance as PayPayBalance;
      }
      return null;
    },
    enabled: isAdmin,
  });

  const movementsQuery = useQuery<PayPayMovement[]>({
    queryKey: ["paypay-movements"],
    queryFn: async () => {
      const res = await StripeService.getPayPayMovements();
      const raw = res.data;
      if (Array.isArray(raw)) return raw.filter((m: unknown) => m && typeof m === "object");
      if (raw?.data && Array.isArray(raw.data)) return raw.data.filter((m: unknown) => m && typeof m === "object");
      return [];
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
