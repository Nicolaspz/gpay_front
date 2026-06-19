"use client"

import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function Exemplos() {
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
