"use client";

import { useMutation } from "@tanstack/react-query";
import { StripeService } from "@/services/stripe.service";
import type { PayPayWebhookPayload } from "@/types/stripe";

export function usePayPayWebhook() {
  const mutation = useMutation({
    mutationFn: (payload: PayPayWebhookPayload) =>
      StripeService.sendPayPayWebhook(payload),
  });

  return {
    send: mutation.mutate,
    sendAsync: mutation.mutateAsync,
    isSending: mutation.isPending,
    result: mutation.data,
    error: mutation.error,
    reset: mutation.reset,
  };
}
