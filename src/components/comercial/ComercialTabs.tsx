"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Lock, Bell, CreditCard, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"

interface Tab {
  id: string
  label: string
  icon: string
  content: React.ReactNode
  enabled?: boolean
}

interface SettingsTabsProps {
  tabs: Tab[]
  defaultTab: string
}

const iconMap = {
  user: <User className="mr-2 h-4 w-4" />,
  lock: <Lock className="mr-2 h-4 w-4" />,
  bell: <Bell className="mr-2 h-4 w-4" />,
  "credit-card": <CreditCard className="mr-2 h-4 w-4" />,
}

export function CommercialTabs({ tabs, defaultTab }: SettingsTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab)
  const [loading, setLoading] = useState(true)

  // Filtra apenas as tabs habilitadas
  const enabledTabs = tabs.filter(tab => tab.enabled !== false)
  
  // Se a tab ativa não estiver habilitada, muda para a primeira habilitada
  useEffect(() => {
    if (enabledTabs.length > 0 && !enabledTabs.find(tab => tab.id === activeTab)) {
      const firstEnabledTab = enabledTabs[0].id
      setActiveTab(firstEnabledTab)
      localStorage.setItem("activeTab", firstEnabledTab)
    }
  }, [activeTab, enabledTabs])

  // Carregar tab salvo no localStorage
  useEffect(() => {
    const savedTab = localStorage.getItem("activeTab")
    if (savedTab && enabledTabs.find(tab => tab.id === savedTab)) {
      setActiveTab(savedTab)
    }
  }, [enabledTabs])

  // Salvar tab sempre que mudar
  useEffect(() => {
    localStorage.setItem("activeTab", activeTab)
  }, [activeTab])

  // Simula fetch de dados quando tab muda
  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(timer)
  }, [activeTab])

  return (
    <Tabs
      value={activeTab}
      onValueChange={(val) => {
        // Só permite mudar para tabs habilitadas
        const targetTab = tabs.find(tab => tab.id === val)
        if (targetTab?.enabled !== false) {
          setActiveTab(val)
        }
      }}
      className="w-full"
    >
      <TabsList className="w-full grid grid-cols-2 md:grid-cols-4 gap-2">
        {tabs.map((tab) => {
          const isEnabled = tab.enabled !== false
          
          return (
            <TabsTrigger 
              key={tab.id} 
              value={tab.id} 
              className={`
                cursor-pointer flex items-center justify-center md:justify-start
                whitespace-nowrap text-sm md:text-base
                ${!isEnabled ? 'opacity-50 cursor-not-allowed' : ''}
              `}
              disabled={!isEnabled}
            >
              <span className="hidden md:inline">
                {iconMap[tab.icon as keyof typeof iconMap]}
              </span>
              <span className="truncate">{tab.label}</span>
              {!isEnabled && (
                <span className="ml-1 md:ml-2 text-xs bg-gray-100 text-gray-400 px-1 py-0.5 rounded hidden md:inline">
                  Em breve
                </span>
              )}
            </TabsTrigger>
          )
        })}
      </TabsList>

      {tabs.map((tab) => (
        <TabsContent key={tab.id} value={tab.id} className="mt-6">
          {loading ? (
            <div className="flex items-center justify-center h-40 text-gray-500">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span>Carregando {tab.label}...</span>
            </div>
          ) : (
            tab.content
          )}
        </TabsContent>
      ))}
    </Tabs>
  )
}