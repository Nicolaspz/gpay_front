"use client";

import { useQuery } from "@tanstack/react-query";
import { LogsService } from "@/services/logs.service";
import { useAuth } from "@/hooks/useAuth";

export function useLogs() {
  const { user } = useAuth();
  const isAdmin = user?.user_type === "admin";

  return useQuery({
    queryKey: ["logs"],
    queryFn: LogsService.getLogs,
    enabled: isAdmin,
  });
}
