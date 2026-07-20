"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { AuthCard } from "@/components/auth/AuthCard"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { AuthService } from "@/services/auth.service"
import { PasswordInput } from "@/components/shared/PasswordInput"
import { usePasswordValidation } from "@/hooks/usePasswordValidation"
import { getErrorMessage } from "@/utils/api-error"
import { Phone } from "lucide-react"

export default function RegisterPage() {
  return <RegisterClient />;
}
