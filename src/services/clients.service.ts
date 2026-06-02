import { api } from "@/services/apiClients";
import type { AdminClient } from "@/types/global";

export const ClientsService = {
  async getAdminClients(): Promise<AdminClient[]> {
    const { data } = await api.get<AdminClient[]>("/users");
    return Array.isArray(data) ? data : [];
  },
};
