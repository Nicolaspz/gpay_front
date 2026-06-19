"use client"

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Globe } from "lucide-react"

export function Endpoints() {
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
