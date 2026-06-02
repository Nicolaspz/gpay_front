"use client";

import { useQuery } from "@tanstack/react-query";
import { ClientsService } from "@/services/clients.service";
import { useAuth } from "@/hooks/useAuth";

export function useAdminClients() {
  const { user } = useAuth();
  const isAdmin = user?.user_type === "admin";

  return useQuery({
    queryKey: ["admin-clients"],
    queryFn: ClientsService.getAdminClients,
    enabled: isAdmin,
  });
}
