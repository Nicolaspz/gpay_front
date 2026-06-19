"use client"

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info, AlertTriangle } from "lucide-react"

export function Autenticacao() {
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
