"use client"

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Zap,
  CreditCard,
  CheckCircle,
  ArrowRight,
} from "lucide-react"

type Props = {
  onGetStarted: () => void
}

export function Introducao({ onGetStarted }: Props) {
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
