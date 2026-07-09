"use client";

import { useMutation } from "@tanstack/react-query";
import { StripeService } from "@/services/stripe.service";
import type { WithdrawalValidationResponse } from "@/types/stripe";

export function useWithdrawalValidation(userId: string) {
  const mutation = useMutation<WithdrawalValidationResponse, Error, { amount: number; currency: string }>({
    mutationFn: async (payload) => {
      const res = await StripeService.validateWithdrawal(userId, payload);
      return res.data;
    },
  });

  return {
    validate: mutation.mutate,
    validateAsync: mutation.mutateAsync,
    isValidating: mutation.isPending,
    validationResult: mutation.data,
    validationError: mutation.error,
    reset: mutation.reset,
  };
}
