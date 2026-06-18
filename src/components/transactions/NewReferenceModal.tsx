"use client"

import { useState, useEffect } from "react"
import { useGenerateReference, type NewReferenceData } from "@/hooks/useGenerateReference"

type Props = {
  tenantId: string | undefined
  userToken: string | undefined
  onClose: () => void
}

export function NewReferenceModal({ tenantId, userToken, onClose }: Props) {
  const { generate, referenceResult, setReferenceResult, isPending } =
    useGenerateReference(tenantId, userToken)

  const [form, setForm] = useState<NewReferenceData>({
    amount: 0,
    customer_name: "",
    customer_phone: "",
    customer_email: "",
    description: "",
    payment_method: "multicaixa",
    transaction_id: "",
  })

  useEffect(() => {
    if (referenceResult) return
  }, [referenceResult])

  const handleSubmit = () => {
    if (!tenantId) return
    generate(form)
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#1F2937] rounded-xl p-6 w-full max-w-md shadow-2xl">
        <h3 className="text-xl font-bold mb-4">
          {referenceResult ? "Referência Criada" : "Nova Referência"}
        </h3>

        {!referenceResult ? (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Nome do Cliente"
              value={form.customer_name}
              onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
              className="w-full p-2 border rounded bg-transparent dark:border-gray-700"
            />
            <input
              type="email"
              placeholder="Email do Cliente (opcional)"
              value={form.customer_email}
              onChange={(e) => setForm({ ...form, customer_email: e.target.value })}
              className="w-full p-2 border rounded bg-transparent dark:border-gray-700"
            />
            <input
              type="text"
              placeholder="Telefone do Cliente (opcional)"
              value={form.customer_phone}
              onChange={(e) => setForm({ ...form, customer_phone: e.target.value })}
              className="w-full p-2 border rounded bg-transparent dark:border-gray-700"
            />
            <input
              type="text"
              placeholder="Descrição (opcional)"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full p-2 border rounded bg-transparent dark:border-gray-700"
            />
            <input
              type="number"
              placeholder="Montante (AOA)"
              value={form.amount || ""}
              onChange={(e) =>
                setForm({ ...form, amount: parseFloat(e.target.value) || 0 })
              }
              className="w-full p-2 border rounded bg-transparent dark:border-gray-700"
            />
            <select
              value={form.payment_method}
              onChange={(e) => setForm({ ...form, payment_method: e.target.value })}
              className="w-full p-2 border rounded bg-transparent dark:border-gray-700 dark:bg-gray-800"
            >
              <option value="multicaixa">Multicaixa</option>
              <option value="reference">Referência</option>
            </select>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => {
                  setReferenceResult(null)
                  onClose()
                }}
                className="px-4 py-2 rounded-md font-medium bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                disabled={isPending}
                className="px-4 py-2 rounded-md font-medium bg-blue-600 text-white flex items-center justify-center min-w-[100px] disabled:opacity-50"
              >
                {isPending ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  "Gerar"
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 text-center">
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded">
              <p className="text-xs text-gray-500">
                Entidade: {referenceResult.entity}
              </p>
              <p className="text-2xl font-mono font-bold tracking-widest">
                {referenceResult.referenceNumber}
              </p>
            </div>
            <button
              onClick={() => {
                setReferenceResult(null)
                onClose()
              }}
              className="w-full px-4 py-2 rounded-md font-medium bg-blue-600 text-white"
            >
              Concluído
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
