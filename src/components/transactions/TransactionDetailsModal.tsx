"use client"

import type { Transaction } from "@/types/global"
import { formatCurrency } from "@/utils/dashboard"

type Props = {
  transaction: Transaction
  onClose: () => void
}

export function TransactionDetailsModal({ transaction: tx, onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-[var(--card)] rounded-xl p-6 w-full max-w-2xl shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">Detalhes da Transação</h3>
          <button onClick={onClose} className="text-2xl">
            ✕
          </button>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <p className="text-xs text-[var(--muted-foreground)] uppercase">Cliente</p>
              <p className="font-bold">{tx.customer_name}</p>
            </div>
            <div>
              <p className="text-xs text-[var(--muted-foreground)] uppercase">Email</p>
              <p>{tx.customer_email || "N/A"}</p>
            </div>
            {(() => {
              try {
                const meta =
                  typeof tx.metadata === "string"
                    ? JSON.parse(tx.metadata || "{}")
                    : tx.metadata || {}
                const entity = meta.entity || meta.Entity || meta?.reference?.entity
                const reference =
                  meta.referenceNumber ||
                  meta.reference_number ||
                  meta.referencia ||
                  meta.Reference ||
                  meta?.reference?.referenceNumber

                if (tx.payment_method === "reference" && (entity || reference)) {
                  return (
                    <>
                      {entity && (
                        <div>
                          <p className="text-xs text-[var(--muted-foreground)] uppercase">Entidade</p>
                          <p className="font-bold font-mono">{entity}</p>
                        </div>
                      )}
                      {reference && (
                        <div>
                          <p className="text-xs text-[var(--muted-foreground)] uppercase">Referência</p>
                          <p className="font-bold font-mono tracking-wider">{reference}</p>
                        </div>
                      )}
                    </>
                  )
                }
              } catch {}
              return null
            })()}
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-[var(--muted-foreground)] uppercase">Valor</p>
              <p className="text-xl font-bold text-[var(--success)]">
                {formatCurrency(tx.amount)}
              </p>
            </div>
            <div>
              <p className="text-xs text-[var(--muted-foreground)] uppercase">Status</p>
              <p className="font-bold">{tx.status.toUpperCase()}</p>
            </div>
            <div>
              <p className="text-xs text-[var(--muted-foreground)] uppercase">Método</p>
              <p className="font-bold capitalize">{tx.payment_method}</p>
            </div>
            {tx.status === "failed" &&
              (() => {
                try {
                  const meta =
                    typeof tx.metadata === "string"
                      ? JSON.parse(tx.metadata || "{}")
                      : tx.metadata || {}
                  const errorMessage =
                    meta.message ||
                    meta.error ||
                    meta.motivo ||
                    meta.reason ||
                    meta.descricao ||
                    "Falha na transação (motivo não especificado na metadata)"
                  return (
                    <div className="col-span-2 pt-2 border-t border-red-100 dark:border-red-900/30">
                      <p className="text-xs text-[var(--danger)] uppercase font-bold flex items-center gap-1">
                        Motivo da Falha
                      </p>
                      <p className="text-sm text-[var(--danger)] font-medium">
                        {errorMessage}
                      </p>
                    </div>
                  )
                } catch {
                  return null
                }
              })()}
          </div>
        </div>
        <div className="mt-8 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md font-medium bg-[var(--accent-primary)] text-white hover:opacity-90"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  )
}
