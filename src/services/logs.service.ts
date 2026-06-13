import { api } from "@/services/apiClients";
import type { Log } from "@/types/global";

export const LogsService = {
  async getLogs(): Promise<Log[]> {
    const { data } = await api.get<Log[]>("/logs");
    return Array.isArray(data) ? data : [];
  },

  async getLogById(id: string): Promise<Log> {
    const { data } = await api.get<Log>(`/logs/${id}`);
    return data;
  },
};
