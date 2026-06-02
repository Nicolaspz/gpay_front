import { api } from "@/services/apiClients";
import type { Webhook, WebhookPayload } from "@/types/global";

function normalizeWebhookResponse(data: Webhook | Webhook[] | null | undefined) {
  if (!data) return [];
  return Array.isArray(data) ? data : [data];
}

export const WebhooksService = {
  async getByTenant(tenantId: string): Promise<Webhook[]> {
    const { data } = await api.get<Webhook[] | Webhook>(`/webhooks/tenant/${tenantId}`);
    return normalizeWebhookResponse(data);
  },

  async create(payload: WebhookPayload): Promise<Webhook> {
    const { data } = await api.post<Webhook>("/webhooks", payload);
    return data;
  },

  async update(id: string, payload: WebhookPayload) {
    const { data } = await api.put(`/webhooks/${id}`, payload);
    return data;
  },

  async delete(id: string, tenantId: string) {
    const { data } = await api.delete(`/webhooks/${id}/tenant/${tenantId}`);
    return data;
  },
};
