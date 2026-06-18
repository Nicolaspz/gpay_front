"use client"

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { CheckCircle, AlertTriangle } from "lucide-react"

export function APIResponses() {
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
