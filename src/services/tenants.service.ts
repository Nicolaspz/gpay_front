import { api } from "@/services/apiClients";
import type { TenantPaymentSettings } from "@/types/global";

export const TenantsService = {
  async updatePaymentSettings(tenantId: string, payload: TenantPaymentSettings): Promise<TenantPaymentSettings> {
    const { data } = await api.put<TenantPaymentSettings>(`/tenants/${tenantId}`, payload);
    return data;
  },
};
