"use client"

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"

const requiredFields = [
  { field: 'amount', desc: 'Valor da transação' },
  { field: 'redirect_url', desc: 'URL de redirecionamento após o pagamento' },
  { field: 'customer', desc: 'Dados do cliente (name, phone, email)' },
  { field: 'payment_method', desc: 'Pode ser "reference" (gerar referência) ou "multicaixa" (pagamento expresso)' },
  { field: 'transaction_type', desc: 'Tipo de transação' },
  { field: 'transaction_id', desc: 'ID único da transação' }
]

export function PayloadStructure() {
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
            {requiredFields.map(item => (
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
