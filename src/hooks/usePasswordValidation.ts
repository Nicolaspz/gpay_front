import { useMemo } from "react"

const PASSWORD_RULES = {
  uppercase: /[A-Z]/,
  lowercase: /[a-z]/,
  specialChar: /[!@#$%^&*(),.?":{}|<>]/,
  minLength: /.{8,}/,
} as const

const PASSWORD_ERROR_MESSAGES: Record<keyof typeof PASSWORD_RULES, string> = {
  uppercase: "A senha deve conter pelo menos uma letra maiúscula",
  lowercase: "A senha deve conter pelo menos uma letra minúscula",
  specialChar: "A senha deve conter pelo menos um caractere especial",
  minLength: "A senha deve ter pelo menos 8 caracteres",
}

export function usePasswordValidation(password: string) {
  const errors = useMemo(() => {
    return (Object.keys(PASSWORD_RULES) as Array<keyof typeof PASSWORD_RULES>).filter(
      (key) => !PASSWORD_RULES[key].test(password)
    ).map((key) => PASSWORD_ERROR_MESSAGES[key])
  }, [password])

  return {
    errors,
    isValid: errors.length === 0 && password.length > 0,
  }
}
