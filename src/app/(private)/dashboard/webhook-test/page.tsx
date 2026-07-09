'use client'

import { useState } from "react";
import { usePayPayWebhook } from "@/hooks/usePayPayWebhook";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FiSend, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function WebhookTestPage() {
  const router = useRouter();
  const { user } = useAuth();
  const isAdmin = user?.user_type === "admin";

  const { send, isSending, result, error, reset } = usePayPayWebhook();

  const [eventType, setEventType] = useState("paypay.wallet.debited");
  const [paypayTxId, setPaypayTxId] = useState("pp_tx_");
  const [internalTxId, setInternalTxId] = useState("ORDEM-");
  const [amount, setAmount] = useState("85000");
  const [currency, setCurrency] = useState("aoa");
  const [status, setStatus] = useState("COMPLETED");
  const [message, setMessage] = useState("Debito confirmado na conta PayPay da GPay");

  if (!isAdmin) {
    router.replace("/dashboard");
    return null;
  }

  const handleSend = () => {
    reset();
    send({
      event_type: eventType,
      paypay_transaction_id: paypayTxId,
      internal_transaction_id: internalTxId,
      amount: Number(amount),
      currency,
      status,
      message: message || undefined,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Simular Webhook PayPay
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          Envie um webhook de teste para o servidor Stripe como se fosse enviado pela PayPay
        </p>
      </div>

      <Card className="p-6 max-w-2xl">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Event Type</label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 text-gray-700 dark:text-gray-300 mt-1"
              >
                <option value="paypay.wallet.debited">paypay.wallet.debited</option>
                <option value="paypay.wallet.credited">paypay.wallet.credited</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 text-gray-700 dark:text-gray-300 mt-1"
              >
                <option value="COMPLETED">COMPLETED</option>
                <option value="PENDING">PENDING</option>
                <option value="FAILED">FAILED</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">PayPay Transaction ID</label>
            <Input
              placeholder="pp_tx_123"
              value={paypayTxId}
              onChange={(e) => setPaypayTxId(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Internal Transaction ID</label>
            <Input
              placeholder="ORDEM-00005"
              value={internalTxId}
              onChange={(e) => setInternalTxId(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Montante</label>
              <Input
                type="number"
                placeholder="85000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Moeda</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 text-gray-700 dark:text-gray-300 mt-1"
              >
                <option value="aoa">AOA</option>
                <option value="usd">USD</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Mensagem (opcional)</label>
            <Input
              placeholder="Debito confirmado na conta PayPay da GPay"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <Button
            onClick={handleSend}
            disabled={isSending || !paypayTxId || !internalTxId || !amount}
            className="w-full flex items-center gap-2"
          >
            <FiSend className="h-4 w-4" />
            {isSending ? "A enviar..." : "Enviar Webhook"}
          </Button>

          {result && (
            <div className="p-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg text-sm flex items-center gap-2">
              <FiCheckCircle className="h-4 w-4" />
              Webhook enviado com sucesso! (Status: {result.status})
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg text-sm flex items-center gap-2">
              <FiXCircle className="h-4 w-4" />
              Erro ao enviar webhook: {error.message}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
