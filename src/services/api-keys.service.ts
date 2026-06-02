import { api } from "@/services/apiClients";
import type { ApiKey, ApiKeyPayload, ApiKeyResponse } from "@/types/global";

function mapApiKey(item: ApiKeyResponse): ApiKey {
  return {
    id: item.id,
    name: item.name,
    key: item.value,
    status: item.expire_at && new Date(item.expire_at) < new Date() ? "expired" : "active",
    createdAt: item.created_at,
    expiresAt: item.expire_at ?? null,
  };
}

function normalizeApiKeyResponse(data: ApiKeyResponse | ApiKeyResponse[] | null | undefined) {
  if (!data) return [];
  return Array.isArray(data) ? data : [data];
}

export const ApiKeysService = {
  async getByTenant(tenantId: string): Promise<ApiKey[]> {
    const { data } = await api.get<ApiKeyResponse[] | ApiKeyResponse>(`/api-keys/tenant/${tenantId}`);
    return normalizeApiKeyResponse(data).map(mapApiKey);
  },

  async create(payload: ApiKeyPayload): Promise<ApiKey> {
    const { data } = await api.post<ApiKeyResponse>("/api-keys", payload);
    return mapApiKey(data);
  },

  async update(id: string, payload: ApiKeyPayload) {
    const { data } = await api.put(`/api-keys/${id}`, payload);
    return data;
  },

  async delete(id: string, tenantId: string) {
    const { data } = await api.delete(`/api-keys/${id}/tenant/${tenantId}`);
    return data;
  },
};
