import { SettingsHeader } from "@/components/settings/SettingsHeader"
import { AccountSection } from "@/components/settings/AccountSection"
import { SecuritySection } from "@/components/settings/SecuritySection"
import { NotificationsSection } from "@/components/settings/NotificationsSection"
import { PaymentSettingsSection } from "@/components/settings/PaymentSettingsSection"
import { SettingsTabs } from "@/components/settings/SettingsTabs"

export default function SettingsPage() {
  const tabs = [
    { 
      id: "account", 
      label: "Conta", 
      icon: "user", 
      content: <AccountSection />,
      enabled: false // Desabilitado
    },
    { 
      id: "security", 
      label: "Segurança", 
      icon: "lock", 
      content: <SecuritySection />,
      enabled: false // Desabilitado
    },
    { 
      id: "notifications", 
      label: "Notificações", 
      icon: "bell", 
      content: <NotificationsSection />,
      enabled: false // Desabilitado
    },
    { 
      id: "payments", 
      label: "Pagamentos", 
      icon: "credit-card", 
      content: <PaymentSettingsSection />,
      enabled: true // Habilitado
    },
  ]

  return (
    <div className="flex-1 space-y-6 p-6">
      <SettingsHeader 
        title="Configurações do Sistema"
        description="Gerencie preferências da conta e configurações de pagamento"
      />
      
      <SettingsTabs 
        tabs={tabs} 
        defaultTab="payments" 
      />
    </div>
  )
}