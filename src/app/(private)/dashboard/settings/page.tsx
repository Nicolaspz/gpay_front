import { SettingsHeader } from "@/components/settings/SettingsHeader"
import { SecuritySection } from "@/components/settings/SecuritySection"
import { NotificationsSection } from "@/components/settings/NotificationsSection"
import { PaymentSettingsSection } from "@/components/settings/PaymentSettingsSection"
import { SettingsTabs } from "@/components/settings/SettingsTabs"

export default function SettingsPage() {
  const tabs = [
    { 
      id: "security", 
      label: "Segurança", 
      icon: "lock", 
      content: <SecuritySection />,
      enabled: false
    },
    { 
      id: "notifications", 
      label: "Notificações", 
      icon: "bell", 
      content: <NotificationsSection />,
      enabled: true
    },
    { 
      id: "payments", 
      label: "Pagamentos", 
      icon: "credit-card", 
      content: <PaymentSettingsSection />,
      enabled: true
    },
  ]

  return (
    <div className="flex-1 space-y-6 p-6">
      <SettingsHeader 
        title="Configurações do Sistema"
        description="Gerencie preferências e configurações de pagamento"
      />
      
      <SettingsTabs 
        tabs={tabs} 
        defaultTab="payments" 
      />
    </div>
  )
}