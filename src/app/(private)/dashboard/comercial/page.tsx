import { ComercialHeader } from "@/components/comercial/ComercialHeader";
import { CommercialTabs } from "@/components/comercial/ComercialTabs";
import { ContractsSection } from "@/components/comercial/ContractsSection";
import { PaymentMethodsSection } from "@/components/comercial/PaymentMethods";
import { ReferencesSection } from "@/components/comercial/ReferencesSection";
import { SettingsTabs } from "@/components/settings/SettingsTabs";


export default function CommercialPage() {
  const tabs = [
    {
      id: "payment-methods",
      label: "Formas de Pagamento",
      icon: "",
      content: <PaymentMethodsSection />,
      enabled: true
    },
    {
      id: "contracts",
      label: "Contatos",
      icon: "",
      content: <ContractsSection />,
      enabled: false
    },
    {
      id: "references",
      label: "Referências",
      icon: "",
      content: <ReferencesSection />,
      enabled: false
    },
  ];

  return (
    <div className="flex-1 space-y-6 p-6">
      <ComercialHeader 
        title="Área Comercial" 
        description="Gerencie métodos de pagamento, contratos e referências"
      />
      
      <SettingsTabs 
              tabs={tabs} 
              defaultTab="payment-methods" 
            />
    </div>
  )
}