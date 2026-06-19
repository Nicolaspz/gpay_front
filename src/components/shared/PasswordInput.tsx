"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff, CheckCircle, XCircle } from "lucide-react"

interface PasswordInputProps {
  id: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
  showValidation?: boolean
  errors?: string[]
  isValid?: boolean
  className?: string
  icon?: React.ReactNode
}

export function PasswordInput({
  id,
  value,
  onChange,
  placeholder = "••••••••",
  showValidation = false,
  errors = [],
  isValid = false,
  icon,
}: PasswordInputProps) {
  const [show, setShow] = useState(false)
  const hasErrors = showValidation && errors.length > 0

  return (
    <div className="grid gap-2">
      <div className="relative">
        <Input
          id={id}
          type={show ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required
          className={`h-11 pr-10 ${icon ? "pl-10" : ""} ${
            hasErrors ? "border-red-500 focus-visible:ring-red-500" : ""
          }`}
        />
        {icon && (
          <div className="absolute left-3 top-3 text-gray-400">{icon}</div>
        )}
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 cursor-pointer"
          aria-label={show ? "Ocultar senha" : "Mostrar senha"}
        >
          {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>

      {showValidation && (
        <div className="text-sm space-y-1 mt-1">
          {errors.map((error, index) => (
            <div key={index} className="flex items-center text-red-500">
              <XCircle className="h-3 w-3 mr-1 flex-shrink-0" />
              {error}
            </div>
          ))}
          {isValid && (
            <div className="flex items-center text-green-500">
              <CheckCircle className="h-3 w-3 mr-1" />
              Senha válida
            </div>
          )}
        </div>
      )}
    </div>
  )
}
