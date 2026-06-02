"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ApiKeysService } from "@/services/api-keys.service";
import { useAuth } from "@/hooks/useAuth";
import { useApiKeyStore } from "@/store/useApiKeyStore";

export function useApiKeys(options?: { syncStore?: boolean; enabledWhenStoreEmpty?: boolean }) {
  const { user } = useAuth();
  const tenantId = user?.tenant_id || user?.tenant?.tenant_id;
  const { apiKeys, setApiKeys } = useApiKeyStore();
  const enabledByStore = options?.enabledWhenStoreEmpty ? apiKeys.length === 0 : true;

  const query = useQuery({
    queryKey: ["api-keys", tenantId],
    queryFn: () => {
      if (!tenantId) return [];
      return ApiKeysService.getByTenant(tenantId);
    },
    enabled: !!tenantId && enabledByStore,
  });

  useEffect(() => {
    if (options?.syncStore && query.data) {
      setApiKeys(query.data);
    }
  }, [options?.syncStore, query.data, setApiKeys]);

  return {
    ...query,
    tenantId,
  };
}
