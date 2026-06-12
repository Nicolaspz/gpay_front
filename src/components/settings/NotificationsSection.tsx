"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useNotifications } from "@/hooks/useNotifications"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Bell, CheckCheck, Loader2 } from "lucide-react"

export function NotificationsSection() {
  const { notifications, isLoading, markAsRead, markAllAsRead, isMarkingAll } = useNotifications()

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold">Notificações</h2>
          <p className="text-sm text-gray-600">Histórico de notificações da sua conta</p>
        </div>
        {notifications.some((n) => !n.read) && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => markAllAsRead()}
            disabled={isMarkingAll}
            className="flex items-center gap-1 cursor-pointer"
          >
            {isMarkingAll ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CheckCheck className="h-4 w-4" />
            )}
            Marcar todas como lidas
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12 text-gray-500">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : notifications.length === 0 ? (
        <div className="flex flex-col items-center py-12 text-gray-500">
          <Bell className="h-12 w-12 mb-3 opacity-30" />
          <p className="text-sm">Nenhuma notificação encontrada</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((notification) => (
            <button
              key={notification.id}
              onClick={() => markAsRead(notification.id)}
              className={`w-full text-left p-4 rounded-lg border transition-colors cursor-pointer ${
                !notification.read
                  ? "bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-800"
                  : "bg-white dark:bg-gray-800/50 border-gray-100 dark:border-gray-700"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${
                  !notification.read ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {notification.title}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                    {formatDistanceToNow(new Date(notification.created_at), {
                      addSuffix: true,
                      locale: ptBR,
                    })}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </Card>
  )
}
