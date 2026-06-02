import axios from "axios";
import { api } from "@/services/apiClients";
import type { ReferencePaymentPayload, ReferencePaymentResponse, Transaction } from "@/types/global";

export const TransactionsService = {
  async getAdminTransactions(): Promise<Transaction[]> {
    const { data } = await api.get<Transaction[]>("/transactions");
    return data;
  },

  async getTenantTransactions(tenantId: string): Promise<Transaction[]> {
    const { data } = await api.get<Transaction[]>(`/transactions/tenant/${tenantId}`);
    return data;
  },

  async generateReference(
    payload: ReferencePaymentPayload,
    apiKey: string | null,
    authToken?: string
  ): Promise<ReferencePaymentResponse> {
    const { data } = await axios.post<ReferencePaymentResponse>("/api/pay", payload, {
      headers: {
        Authorization: authToken ? `Bearer ${authToken}` : undefined,
        "gpay-x-api": apiKey ? (apiKey.startsWith("Bearer ") ? apiKey : `Bearer ${apiKey}`) : undefined,
      },
      timeout: 10000,
    });

    return data;
  },
};
