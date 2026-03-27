"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { pt } from "date-fns/locale"

export default function ReportsPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  return (
    <div className="p-6 mx-auto max-w-7xl space-y-8">

<div className="flex flex-col md:flex-row items-start gap-8">
  {/* Calendário */}
  <div>
  <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border shadow"
              locale={pt}
            />
            
  </div>

  {/* Infos ao lado do calendário */}
  <div className="flex flex-col gap-4">
    {/* Data selecionada */}
    <div className="text-lg font-medium text-white">
      {selectedDate && (
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                {format(selectedDate, "PPP", { locale: pt })}
              </span>
            )}
    </div>

    {/* Dropdown */}
    <Select>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Tipo de relatório" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="vendas">Vendas</SelectItem>
              <SelectItem value="faturas">Faturas</SelectItem>
              <SelectItem value="pagamentos">Pagamentos</SelectItem>
            </SelectContent>
          </Select>
  </div>
</div>

      {/* Cabeçalho 
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <Select>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Tipo de relatório" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="vendas">Vendas</SelectItem>
              <SelectItem value="faturas">Faturas</SelectItem>
              <SelectItem value="pagamentos">Pagamentos</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center gap-3">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border shadow"
              locale={pt}
            />
            {selectedDate && (
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                {format(selectedDate, "PPP", { locale: pt })}
              </span>
            )}
          </div>
        </div>
      </div>
*/}
      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="flex flex-col justify-between">
          <CardHeader>
            <CardTitle>Receita Total</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold text-green-500">AOA 2.000.000</CardContent>
        </Card>

        <Card className="flex flex-col justify-between">
          <CardHeader>
            <CardTitle>Faturas Pagas</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">45</CardContent>
        </Card>

        <Card className="flex flex-col justify-between">
          <CardHeader>
            <CardTitle>Vendas</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">80</CardContent>
        </Card>
      </div>

      {/* Tabela de detalhes */}
      <Card>
        <CardHeader>
          <CardTitle>Detalhes das transações</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>06/08/2025</TableCell>
                <TableCell>Venda</TableCell>
                <TableCell>João Manuel</TableCell>
                <TableCell>AOA 25.000</TableCell>
                <TableCell className="text-green-500 font-semibold">Pago</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>05/08/2025</TableCell>
                <TableCell>Fatura</TableCell>
                <TableCell>Empresa ABC</TableCell>
                <TableCell>AOA 80.000</TableCell>
                <TableCell className="text-yellow-500 font-semibold">Pendente</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
