import { api } from "@/services/apiClients";
import type { Notification } from "@/types/global";

export const NotificationsService = {
  async getMyNotifications(): Promise<Notification[]> {
    const { data } = await api.get<Notification[]>("/notifications");
    return Array.isArray(data) ? data : [];
  },

  async getUnreadCount(): Promise<number> {
    const { data } = await api.get<{ count: number }>("/notifications/unread-count");
    return data.count ?? 0;
  },

  async markAsRead(id: string): Promise<void> {
    await api.patch(`/notifications/${id}/read`);
  },

  async markAllAsRead(): Promise<void> {
    await api.patch("/notifications/read-all");
  },

  async getAllNotifications(): Promise<Notification[]> {
    const { data } = await api.get<Notification[]>("/notifications/all");
    return Array.isArray(data) ? data : [];
  },
};
