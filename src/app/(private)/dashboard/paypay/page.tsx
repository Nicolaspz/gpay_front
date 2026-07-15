'use client'

import { useState } from "react";
import { usePayPayFund } from "@/hooks/usePayPayFund";
import { CardStat } from "@/components/dashboard/CardStat";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FiDollarSign, FiArrowUp, FiArrowDown, FiDatabase, FiPlus, FiRefreshCw } from "react-icons/fi";
import { format } from "date-fns";

export default function PayPayDashboard() {
  const {
    balance,
    isLoadingBalance,
    movements,
    isLoadingMovements,
    topup,
    isTopuping,
    topupData,
    validateDebit,
    isValidating,
    validateDebitData,
    validateDebitError,
    refresh,
  } = usePayPayFund();

  const [topupAmount, setTopupAmount] = useState("");
  const [topupReference, setTopupReference] = useState("");
  const [topupDescription, setTopupDescription] = useState("");
  const [topupOpen, setTopupOpen] = useState(false);

  const [debitAmount, setDebitAmount] = useState("");
  const [debitResult, setDebitResult] = useState<{ valid: boolean; message?: string } | null>(null);
  const [debitOpen, setDebitOpen] = useState(false);

  const handleTopup = async () => {
    if (!topupAmount || !topupReference) return;
    topup({
      amount: Number(topupAmount),
      reference: topupReference,
      description: topupDescription || undefined,
    });
    setTopupOpen(false);
    setTopupAmount("");
    setTopupReference("");
    setTopupDescription("");
  };

  const handleValidateDebit = async () => {
    if (!debitAmount) return;
    setDebitResult(null);
    validateDebit({ amount: Number(debitAmount) });
    setDebitOpen(false);
    setDebitAmount("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">
            Fundo Operacional PayPay
          </h1>
          <p className="text-[var(--muted-foreground)] text-sm">
            Gestão do saldo operacional da conta PayPay (AOA)
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={topupOpen} onOpenChange={setTopupOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <FiPlus className="h-4 w-4" />
                Creditar Fundo
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Creditar Fundo PayPay</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <label className="text-sm font-medium text-[var(--foreground)]">Montante (AOA)</label>
                  <Input
                    type="number"
                    placeholder="1000000"
                    value={topupAmount}
                    onChange={(e) => setTopupAmount(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-[var(--foreground)]">Referência</label>
                  <Input
                    placeholder="PAYPAY-TOPUP-2026-0001"
                    value={topupReference}
                    onChange={(e) => setTopupReference(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-[var(--foreground)]">Descrição (opcional)</label>
                  <Input
                    placeholder="Carregamento manual"
                    value={topupDescription}
                    onChange={(e) => setTopupDescription(e.target.value)}
                  />
                </div>
                <Button onClick={handleTopup} disabled={isTopuping} className="w-full">
                  {isTopuping ? "A creditar..." : "Creditar"}
                </Button>
                {topupData && (
                  <p className="text-sm text-[var(--success)] text-center">
                    Fundo creditado com sucesso!
                  </p>
                )}
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={debitOpen} onOpenChange={setDebitOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <FiDatabase className="h-4 w-4" />
                Validar Débito
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Validar Débito PayPay</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <label className="text-sm font-medium text-[var(--foreground)]">Montante (AOA)</label>
                  <Input
                    type="number"
                    placeholder="85000"
                    value={debitAmount}
                    onChange={(e) => setDebitAmount(e.target.value)}
                  />
                </div>
                <Button onClick={handleValidateDebit} disabled={isValidating} className="w-full">
                  {isValidating ? "A validar..." : "Validar"}
                </Button>
                {validateDebitData && (
                  <p className="text-sm text-[var(--success)] text-center">
                    Débito validado com sucesso!
                  </p>
                )}
                {validateDebitError && (
                  <p className="text-sm text-[var(--danger)] text-center">
                    Saldo insuficiente ou erro na validação.
                  </p>
                )}
                {debitResult && (
                  <p className={`text-sm text-center ${debitResult.valid ? "text-[var(--success)]" : "text-[var(--danger)]"}`}>
                    {debitResult.message}
                  </p>
                )}
              </div>
            </DialogContent>
          </Dialog>

          <Button variant="ghost" onClick={refresh} className="flex items-center gap-2">
            <FiRefreshCw className="h-4 w-4" />
            Atualizar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <CardStat
          title="Saldo Disponível"
          amount={balance?.available_amount != null ? `${balance.available_amount.toLocaleString("pt-AO")} AOA` : "---"}
          icon={<FiDollarSign className="text-[var(--success)]" />}
        />
        <CardStat
          title="Total Creditado"
          amount={balance?.total_credited != null ? `${balance.total_credited.toLocaleString("pt-AO")} AOA` : "---"}
          icon={<FiArrowUp className="text-[var(--accent-primary)]" />}
        />
        <CardStat
          title="Total Debitado"
          amount={balance?.total_debited != null ? `${balance.total_debited.toLocaleString("pt-AO")} AOA` : "---"}
          icon={<FiArrowDown className="text-[var(--danger)]" />}
        />
        <CardStat
          title="Última Atualização"
          amount={balance?.updated_at ? format(new Date(balance.updated_at), "dd/MM/yyyy HH:mm") : "---"}
          icon={<FiDatabase className="text-[var(--info)]" />}
        />
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">
            Movimentos do Fundo PayPay
          </h2>
          <span className="text-sm text-[var(--muted-foreground)]">{movements.length} movimentos</span>
        </div>

        {isLoadingMovements ? (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-4 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : movements.length === 0 ? (
          <p className="text-center text-[var(--muted-foreground)] py-8">Nenhum movimento encontrado.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[var(--muted)] border-b border-[var(--border)]">
                  <th className="p-3 font-medium text-[var(--muted-foreground)] text-xs">ID</th>
                  <th className="p-3 font-medium text-[var(--muted-foreground)] text-xs">Tipo</th>
                  <th className="p-3 font-medium text-[var(--muted-foreground)] text-xs">Montante</th>
                  <th className="p-3 font-medium text-[var(--muted-foreground)] text-xs">Referência</th>
                  <th className="p-3 font-medium text-[var(--muted-foreground)] text-xs">Descrição</th>
                  <th className="p-3 font-medium text-[var(--muted-foreground)] text-xs">Data</th>
                </tr>
              </thead>
              <tbody>
                {movements.map((mov) => (
                  <tr key={mov.id} className="border-b border-[var(--border)] hover:bg-[var(--muted)] transition">
                    <td className="p-3 text-xs font-mono text-[var(--foreground)]">{mov.id}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 text-[10px] rounded-full font-bold ${
                        mov.type === "credit"
                          ? "bg-[var(--success-subtle)] text-[var(--success)]"
                          : mov.type === "debit"
                          ? "bg-[var(--danger-subtle)] text-[var(--danger)]"
                          : "bg-[var(--muted)] text-[var(--muted-foreground)]"
                      }`}>
                        {mov.type === "credit" ? "CRÉDITO" : mov.type === "debit" ? "DÉBITO" : "IGNORADO"}
                      </span>
                    </td>
                    <td className="p-3 text-xs font-medium text-[var(--foreground)]">
                      {mov.amount != null ? `${mov.amount.toLocaleString("pt-AO")} AOA` : "—"}
                    </td>
                    <td className="p-3 text-xs text-[var(--muted-foreground)] font-mono">{mov.reference || "—"}</td>
                    <td className="p-3 text-xs text-[var(--muted-foreground)]">{mov.description || "—"}</td>
                    <td className="p-3 text-xs text-[var(--muted-foreground)]">
                      {mov.created_at ? format(new Date(mov.created_at), "dd/MM/yyyy HH:mm") : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
