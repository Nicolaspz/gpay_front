"use client"

import { useState } from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { 
  Code, 
  FileText, 
  Play, 
  CheckCircle, 
  Zap,
  Shield,
  Globe,
  CreditCard,
  BookOpen,
  ArrowRight,
  Info,
  AlertTriangle,
  Menu,
  X,
} from "lucide-react"

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

      {/* ── Mobile top bar ── */}
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

      {/* ── Mobile sidebar overlay ── */}
      {mobileSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 flex"
          style={{ backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)', background: 'rgba(15,15,30,0.4)' }}
          onClick={() => setMobileSidebarOpen(false)}
        >
          {/* Drawer */}
          <div
            className="relative w-72 max-w-[85vw] h-full bg-white shadow-2xl flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            {/* Drawer header */}
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

            {/* Nav items */}
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

            {/* Drawer footer */}
            <div className="p-4 border-t border-gray-100">
              <p className="text-xs text-gray-400 text-center">API v1.0 — GPayment Angola</p>
            </div>
          </div>
        </div>
      )}

      {/* ── Page body ── */}
      <div className="container mx-auto py-6 px-4 lg:px-6">
        <div className="flex gap-8">

          {/* ── Desktop sidebar (hidden on mobile) ── */}
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

          {/* ── Main content ── */}
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

/* ─────────────────────────────────────────────
   Sections (unchanged logic, added overflow fixes)
───────────────────────────────────────────── */

interface IntroducaoProps { onGetStarted: () => void }

function Introducao({ onGetStarted }: IntroducaoProps) {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
          API v1.0
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          GPayment Gateway
        </h1>
        <p className="text-lg md:text-xl text-gray-600">
          Integre pagamentos digitais de forma simples e segura com a API poderosa da GPayment Angola
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardHeader className="bg-blue-50 border-b border-blue-100">
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <Zap className="w-5 h-5 text-yellow-500" />
              Começo Rápido
            </CardTitle>
            <CardDescription className="text-gray-600">Comece a integrar em minutos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              {[
                "Obtenha sua chave API no painel",
                "Faça sua primeira requisição de pagamento",
                "Processe a resposta",
              ].map(text => (
                <div key={text} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse flex-shrink-0" />
                  <p className="text-gray-700 text-sm">{text}</p>
                </div>
              ))}
            </div>
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={onGetStarted}>
              Começar a Integrar
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardHeader className="bg-green-50 border-b border-green-100">
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <CreditCard className="w-5 h-5 text-blue-500" />
              Funcionalidades
            </CardTitle>
            <CardDescription className="text-gray-600">O que você pode construir</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 pt-6">
            {["Pagamentos Multicaixa","Pagamentos por Referência","Notificações em Tempo Real","Transações Seguras"].map(f => (
              <div key={f} className="flex items-center gap-2 py-1">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span className="text-gray-700 text-sm">{f}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="text-gray-900">URL Base</CardTitle>
          <CardDescription className="text-gray-600">Todas as requisições da API devem ser feitas para esta URL base</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto">
            <code className="text-sm font-mono text-gray-800 whitespace-nowrap">
              https://pays.gpayangola.com
            </code>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="text-gray-900">Fluxo de Pagamento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { step: 1, title: "Cliente inicia pagamento",  desc: "Cliente seleciona método de pagamento" },
              { step: 2, title: "Sistema cria transação",    desc: "Sua aplicação envia dados para nossa API" },
              { step: 3, title: "Processamento",             desc: "GPayment processa o pagamento" },
              { step: 4, title: "Confirmação",               desc: "Sua aplicação recebe a confirmação" },
            ].map(item => (
              <div key={item.step} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {item.step}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm md:text-base">{item.title}</h4>
                  <p className="text-xs md:text-sm text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function Autenticacao() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
          Primeiros Passos
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Autenticação</h2>
        <p className="text-gray-600">Proteja suas requisições API com headers de autenticação</p>
      </div>

      <Alert className="bg-blue-50 border border-blue-200">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertTitle className="text-blue-900">Chave API Obrigatória</AlertTitle>
        <AlertDescription className="text-blue-800">
          Inclua sua chave API no header{' '}
          <code className="bg-blue-100 px-1 py-0.5 rounded text-blue-700">gpay-x-api</code>{' '}
          para todas as requisições.
        </AlertDescription>
      </Alert>

      <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
        <CardHeader className="bg-gray-50 border-b border-gray-200">
          <CardTitle className="text-gray-900">Como Obter sua Chave API</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          {["Acesse o painel da GPayment","Navegue até as configurações da API","Gere uma nova chave API","Use essa chave em todas as requisições"].map((step, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {index + 1}
              </div>
              <p className="text-gray-700 text-sm md:text-base">{step}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
        <CardHeader className="bg-gray-50 border-b border-gray-200">
          <CardTitle className="text-gray-900">Exemplo de Headers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto">
            <pre className="text-sm font-mono text-gray-800 whitespace-pre">
{`Headers:
  Content-Type: application/json
  gpay-x-api: Bearer`}
            </pre>
          </div>
        </CardContent>
      </Card>

      <Alert className="bg-red-50 border border-red-200">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertTitle className="text-red-900">Importante</AlertTitle>
        <AlertDescription className="text-red-800">
          Nunca exponha sua chave API no lado do cliente. Use variáveis de ambiente para armazenar suas credenciais.
        </AlertDescription>
      </Alert>
    </div>
  )
}

function Endpoints() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Endpoints da API</h2>
        <p className="text-gray-600">Endpoints disponíveis para processamento de pagamentos</p>
      </div>

      <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
        <CardHeader className="bg-green-50 border-b border-green-200">
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <Globe className="w-5 h-5 text-green-600" />
            Criar Pagamento
          </CardTitle>
          <CardDescription className="text-gray-600">Iniciar uma nova transação de pagamento</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">POST</span>
            <code className="text-sm font-mono text-gray-800">/api/pay</code>
            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">Obrigatório</span>
          </div>

          <Tabs defaultValue="curl" className="w-full">
            <TabsList className="bg-gray-100 p-1 rounded-lg w-full sm:max-w-max flex">
              <TabsTrigger value="curl" className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm flex-1 sm:flex-none">
                cURL
              </TabsTrigger>
              <TabsTrigger value="javascript" className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm flex-1 sm:flex-none">
                JavaScript
              </TabsTrigger>
            </TabsList>
            <TabsContent value="curl">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto">
                <pre className="text-sm font-mono text-gray-800 whitespace-pre">
{`curl -X POST https://pays.gpayangola.com/api/pay \\
  -H "Content-Type: application/json" \\
  -H "gpay-x-api: Bearer" \\
  -d '{
    "amount": 500,
    "redirect_url": "my-app",
    "customer": {
        "name": "Romeu",
        "phone": "943558106",
        "email": "romeucajamba@gmail.com"
    },
    "description": "Teste agora dia 10-03-2026 às 8h00",
    "payment_method": "reference",
    "transaction_type": "payment", 
    "transaction_id": "MC7F4A1B9U"
  }'`}
                </pre>
              </div>
            </TabsContent>
            <TabsContent value="javascript">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto">
                <pre className="text-sm font-mono text-gray-800 whitespace-pre">
{`const response = await fetch(
  'https://pays.gpayangola.com/api/pay',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'gpay-x-api': 'Bearer'
    },
    body: JSON.stringify({
      amount: 500,
      redirect_url: "my-app",
      customer: {
        name: "Romeu",
        phone: "943558106",
        email: "romeucajamba@gmail.com"
      },
      description: "Teste agora dia 10-03-2026 às 8h00",
      payment_method: "reference",
      transaction_type: "payment", 
      transaction_id: "MC7F4A1B9U"
    })
  }
);`}
                </pre>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

function PayloadStructure() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Estrutura do Payload</h2>
        <p className="text-gray-600">Campos obrigatórios e opcionais para requisições de pagamento</p>
      </div>

      <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
        <CardHeader className="bg-blue-50 border-b border-blue-100">
          <CardTitle className="text-gray-900">Corpo da Requisição de Pagamento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto">
            <pre className="text-sm font-mono text-gray-800 whitespace-pre">
{`{
  "amount": 500,                        // Obrigatório - Valor a pagar
  "redirect_url": "my-app",             // Obrigatório - URL de redirecionamento
  "customer": {                         // Obrigatório - Dados do cliente
    "name": "Romeu",                    // Obrigatório - Nome
    "phone": "943558106",               // Obrigatório - Telefone
    "email": "romeucajamba@gmail.com"   // Obrigatório - Email
  },
  "description": "Teste agora dia 10-03-2026 às 8h00", // Opcional - Descrição
  "payment_method": "reference",        // Obrigatório - "reference" ou "multicaixa"
  "transaction_type": "payment",        // Obrigatório - Tipo de transação
  "transaction_id": "MC7F4A1B9U"        // Obrigatório - ID único da transação
}`}
            </pre>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="bg-red-50 border-b border-red-100">
            <CardTitle className="text-gray-900">Campos Obrigatórios</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-6">
            {[
              { field: 'amount', desc: 'Valor da transação' },
              { field: 'redirect_url', desc: 'URL de redirecionamento após o pagamento' },
              { field: 'customer', desc: 'Dados do cliente (name, phone, email)' },
              { field: 'payment_method', desc: 'Pode ser "reference" (gerar referência) ou "multicaixa" (pagamento expresso)' },
              { field: 'transaction_type', desc: 'Tipo de transação' },
              { field: 'transaction_id', desc: 'ID único da transação' }
            ].map(item => (
              <div key={item.field} className="flex items-start gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                <div>
                  <code className="text-sm font-semibold text-gray-800">{item.field}</code>
                  <p className="text-xs text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="bg-blue-50 border-b border-blue-100">
            <CardTitle className="text-gray-900">Campos Opcionais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-6">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
              <div>
                <code className="text-sm font-semibold text-gray-800">description</code>
                <p className="text-xs text-gray-600">Descrição do pagamento</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function APIResponses() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Respostas da API</h2>
        <p className="text-gray-600">Entenda o formato das respostas para requisições bem-sucedidas e com erro</p>
      </div>

      <div className="grid gap-6">
        <Card className="border border-green-200 shadow-sm">
          <CardHeader className="bg-green-50 border-b border-green-200">
            <CardTitle className="text-green-700 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Resposta de Sucesso
            </CardTitle>
            <CardDescription className="text-green-600">200 OK — Pagamento criado com sucesso</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto">
              <pre className="text-sm font-mono text-gray-800 whitespace-pre">
{`{
    "success": true,
    "data": {
        "id": "b99a79af-e7da-4383-9a4e-3da30461ff9e",
        "responseStatus": {
            "successful": true,
            "status": "Pending",
            "code": 101,
            "message": "A solicitação foi aceita para processamento.",
            "source": "REF",
            "sourceDetails": {
                "attempt": 1,
                "type": "NONE",
                "code": "NONE",
                "message": "OK"
            },
            "reference": {
                "referenceNumber": "534265764",
                "dueDate": "2026-03-10T12:17:11",
                "entity": "11445"
            }
        }
    }
}`}
              </pre>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-red-200 shadow-sm">
          <CardHeader className="bg-red-50 border-b border-red-200">
            <CardTitle className="text-red-700 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Resposta de Erro
            </CardTitle>
            <CardDescription className="text-red-600">400 Bad Request — Dados inválidos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto">
              <pre className="text-sm font-mono text-gray-800 whitespace-pre">
{`{
  "success": false,
  "status": "error",
  "message": "transaction_id inválido. Utilize apenas letras e números.",
  "code": "VALIDATION_ERROR",
  "details": {
    "field": "transaction_id",
    "reason": "formato_invalido"
  }
}`}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function Exemplos() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Exemplos de Código</h2>
        <p className="text-gray-600">Trechos de código prontos para usar em diferentes linguagens de programação</p>
      </div>

      <Tabs defaultValue="nodejs" className="w-full">
        <TabsList className="bg-gray-100 p-1 rounded-lg w-full sm:max-w-max flex">
          {["nodejs","python","php","java"].map(lang => (
            <TabsTrigger
              key={lang}
              value={lang}
              className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm flex-1 sm:flex-none text-xs sm:text-sm capitalize"
            >
              {lang === 'nodejs' ? 'Node.js' : lang.charAt(0).toUpperCase() + lang.slice(1)}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="nodejs">
          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="pt-6">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto">
                <pre className="text-sm font-mono text-gray-800 whitespace-pre">
{`// Exemplo completo em Node.js
const GPaymentAPI = {
  baseURL: 'https://pays.gpayangola.com',
  apiKey: process.env.GPAYMENT_API_KEY,

  async createPayment(paymentData) {
    const response = await fetch(\`\${this.baseURL}/payments\`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'gpay-x-api': 'Bearer'
      },
      body: JSON.stringify(paymentData)
    });

    if (!response.ok) {
      throw new Error(\`Erro na API: \${response.status}\`);
    }

    return await response.json();
  }
};`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="python">
          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="pt-6">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto">
                <pre className="text-sm font-mono text-gray-800 whitespace-pre">
{`# Exemplo completo em Python
import requests
import os

class GPaymentClient:
    def __init__(self):
        self.base_url = "https://pays.gpayangola.com"
        self.api_key = os.getenv('GPAYMENT_API_KEY')
    
    def create_payment(self, payment_data):
        headers = {
            'Content-Type': 'application/json',
            'gpay-x-api': 'Bearer'
        }
        
        response = requests.post(
            f"{self.base_url}/api/pay",
            json=payment_data,
            headers=headers
        )
        
        if response.status_code != 200:
            raise Exception(f"Erro na API: {response.status_code}")
        
        return response.json()`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}