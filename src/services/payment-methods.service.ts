import { api } from "@/services/apiClients";
import type { PaymentMethodApi, PaymentMethodForm } from "@/types/global";

export const PaymentMethodsService = {
  async getAll(): Promise<PaymentMethodApi[]> {
    const { data } = await api.get<PaymentMethodApi[]>("/payments");
    return Array.isArray(data) ? data : [];
  },

  async create(payload: PaymentMethodForm) {
    const { data } = await api.post("/payments", payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return data;
  },

  async update(payload: PaymentMethodForm) {
    const { data } = await api.put("/payments", payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return data;
  },

  async delete(id: string) {
    const { data } = await api.delete(`/payments/${id}`);
    return data;
  },
};
