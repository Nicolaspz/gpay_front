"use client";

import { useQuery } from "@tanstack/react-query";
import { TransactionsService } from "@/services/transactions.service";
import { useAuth } from "@/hooks/useAuth";

export function useTransactions() {
  const { user } = useAuth();
  const isAdmin = user?.user_type === "admin";
  const tenantId = user?.tenant_id || user?.tenant?.tenant_id;

  return useQuery({
    queryKey: ["transactions", tenantId, isAdmin],
    queryFn: () => {
      if (isAdmin) return TransactionsService.getAdminTransactions();
      if (tenantId) return TransactionsService.getTenantTransactions(tenantId);
      return [];
    },
    enabled: isAdmin || !!tenantId,
  });
}
