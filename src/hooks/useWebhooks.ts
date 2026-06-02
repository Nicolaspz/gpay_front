"use client";

import { useQuery } from "@tanstack/react-query";
import { WebhooksService } from "@/services/webhooks.service";
import { useAuth } from "@/hooks/useAuth";

export function useWebhooks() {
  const { user } = useAuth();
  const tenantId = user?.tenant_id || user?.tenant?.tenant_id;

  const query = useQuery({
    queryKey: ["webhooks", tenantId],
    queryFn: () => {
      if (!tenantId) return [];
      return WebhooksService.getByTenant(tenantId);
    },
    enabled: !!tenantId,
  });

  return {
    ...query,
    tenantId,
  };
}
