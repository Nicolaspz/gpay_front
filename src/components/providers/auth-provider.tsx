"use client"

import { useEffect, useRef } from "react"
import { useAuthStore } from "@/store/useAuthStore"
import { InactivityLogoutManager } from "./inactivity-logout-manager"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const checkToken = useAuthStore((state) => state.checkToken)
  const initialized = useRef(false)

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true
      checkToken()
    }
  }, [checkToken])

  return (
    <>
      <InactivityLogoutManager />
      {children}
    </>
  )
}
