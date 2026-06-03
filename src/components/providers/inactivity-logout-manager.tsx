"use client"

import { useInactivityLogout } from "@/hooks/useInactivityLogout"

export function InactivityLogoutManager() {
  useInactivityLogout()
  return null
}
