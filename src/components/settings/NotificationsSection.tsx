import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export function NotificationsSection() {
  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Notificações</h2>
        <p className="text-sm text-gray-600">Controle quais alertas deseja receber</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label>Pagamentos Recebidos</Label>
            <p className="text-sm text-gray-600">Notificação por e-mail</p>
          </div>
          <Switch defaultChecked />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label>Transferências Concluídas</Label>
            <p className="text-sm text-gray-600">Notificação por SMS</p>
          </div>
          <Switch />
        </div>
      </div>
    </Card>
  )
}