"use client";

import { useQuery } from "@tanstack/react-query";
import { StripeService } from "@/services/stripe.service";
import type { ClientBalanceByCurrency } from "@/types/stripe";

export function useClientBalanceByCurrency(userId: string, currency: string) {
  const query = useQuery<ClientBalanceByCurrency>({
    queryKey: ["client-balance", userId, currency],
    queryFn: async () => {
      const res = await StripeService.getClientBalanceByCurrency(userId, currency);
      return res.data;
    },
    enabled: !!userId && !!currency,
  });

  return {
    balance: query.data ?? null,
    isLoading: query.isLoading,
    error: query.error,
  };
}
