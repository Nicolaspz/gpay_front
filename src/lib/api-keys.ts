import { ApiKeysService } from "@/services/api-keys.service";
import type { ApiKey, ApiKeyPayload } from "@/types/global";

export type { ApiKey } from "@/types/global";

export function getApiKeys(tenantId: string): Promise<ApiKey[]> {
  return ApiKeysService.getByTenant(tenantId);
}

export function createApiKey(params: ApiKeyPayload): Promise<ApiKey> {
  return ApiKeysService.create(params);
}

export function updateApiKey(id: string, body: ApiKeyPayload) {
  return ApiKeysService.update(id, body);
}

export function deleteApiKey(id: string, tenantId: string) {
  return ApiKeysService.delete(id, tenantId);
}
