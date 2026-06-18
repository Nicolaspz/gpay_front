"use client"

import { useState } from 'react'
import { Separator } from "@/components/ui/separator"
import { 
  BookOpen,
  Shield,
  Code,
  FileText,
  Play,
  CheckCircle,
  Menu,
  X,
} from "lucide-react"
import { Introducao } from "@/components/document/Introducao"
import { Autenticacao } from "@/components/document/Autenticacao"
import { Endpoints } from "@/components/document/Endpoints"
import { PayloadStructure } from "@/components/document/PayloadStructure"
import { APIResponses } from "@/components/document/APIResponses"
import { Exemplos } from "@/components/document/Exemplos"

const navigation = [
  { id: 'introducao', title: 'Introdução', icon: BookOpen },
  { id: 'autenticacao', title: 'Autenticação', icon: Shield },
  { id: 'endpoints', title: 'Endpoints', icon: Code },
  { id: 'payload', title: 'Estrutura do Payload', icon: FileText },
  { id: 'respostas', title: 'Respostas da API', icon: Play },
  { id: 'exemplos', title: 'Exemplos de Código', icon: CheckCircle },
]

export default function GPaymentDocumentation() {
  const [activeSection, setActiveSection] = useState('introducao')
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  const handleSectionChange = (sectionId: string) => {
    setIsTransitioning(true)
    setMobileSidebarOpen(false)
    setTimeout(() => {
      setActiveSection(sectionId)
      setIsTransitioning(false)
    }, 200)
  }

  const handleGetStarted = () => {
    handleSectionChange('autenticacao')
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'introducao':   return <Introducao onGetStarted={handleGetStarted} />
      case 'autenticacao': return <Autenticacao />
      case 'endpoints':    return <Endpoints />
      case 'payload':      return <PayloadStructure />
      case 'respostas':    return <APIResponses />
      case 'exemplos':     return <Exemplos />
      default:             return <Introducao onGetStarted={handleGetStarted} />
    }
  }

  const activeLabel = navigation.find(n => n.id === activeSection)?.title ?? ''

  return (
    <div className="min-h-screen bg-white">

      <div className="lg:hidden sticky top-0 z-40 flex items-center justify-between gap-3 border-b border-gray-200 bg-white px-4 py-3 shadow-sm">
        <span className="text-sm font-semibold text-gray-700 truncate">{activeLabel}</span>
        <button
          onClick={() => setMobileSidebarOpen(true)}
          className="flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors"
          aria-label="Abrir navegação"
        >
          <Menu className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {mobileSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 flex"
          style={{ backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)', background: 'rgba(15,15,30,0.4)' }}
          onClick={() => setMobileSidebarOpen(false)}
        >
          <div
            className="relative w-72 max-w-[85vw] h-full bg-white shadow-2xl flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <span className="text-sm font-bold text-gray-800">Documentação GPayment</span>
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                aria-label="Fechar menu"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto p-3 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-all duration-200 ${
                      activeSection === item.id
                        ? 'bg-blue-100 text-blue-700 font-semibold border border-blue-200'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 border border-transparent'
                    }`}
                    onClick={() => handleSectionChange(item.id)}
                  >
                    <Icon className="w-4 h-4 mr-3 flex-shrink-0" />
                    {item.title}
                  </button>
                )
              })}
            </nav>

            <div className="p-4 border-t border-gray-100">
              <p className="text-xs text-gray-400 text-center">API v1.0 — GPayment Angola</p>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto py-6 px-4 lg:px-6">
        <div className="flex gap-8">

          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-6 space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Documentação GPayment</h2>
                <p className="text-sm text-gray-600 mb-4">
                  Guia completo para integração da API de pagamentos
                </p>
              </div>
              <nav className="space-y-2">
                {navigation.map((item) => {
                  const Icon = item.icon
                  return (
                    <button
                      key={item.id}
                      className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-sm ${
                        activeSection === item.id
                          ? 'bg-blue-100 text-blue-700 font-semibold border border-blue-200'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 border border-transparent hover:border-gray-200'
                      }`}
                      onClick={() => handleSectionChange(item.id)}
                    >
                      <Icon className="w-4 h-4 mr-3" />
                      {item.title}
                    </button>
                  )
                })}
              </nav>
              <Separator className="bg-gray-200" />
            </div>
          </aside>

          <main className="flex-1 min-w-0">
            <div className={`max-w-4xl transition-all duration-300 ${
              isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
            }`}>
              {renderContent()}
            </div>
          </main>

        </div>
      </div>
    </div>
  )
}
