"use client"

import { useEffect, useRef } from "react"
import { useAuthStore } from "@/store/useAuthStore"
import { useRouter } from "next/navigation"

const INACTIVITY_TIMEOUT = 15 * 60 * 1000 // 15 minutes

export function useInactivityLogout() {
  const router = useRouter()
  const { signOut, isAuthenticated } = useAuthStore()
  const inactivityTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const resetInactivityTimer = () => {
    if (inactivityTimer.current) {
      clearTimeout(inactivityTimer.current)
    }

    inactivityTimer.current = setTimeout(() => {
      signOut()
      router.push("/")
    }, INACTIVITY_TIMEOUT)
  }

  const handleUserInteraction = () => {
    if (isAuthenticated) {
      resetInactivityTimer()
    }
  }

  useEffect(() => {
    if (!isAuthenticated) return

    const events = ["mousemove", "mousedown", "keydown", "scroll", "touchstart"]

    events.forEach((event) => {
      window.addEventListener(event, handleUserInteraction)
    })

    resetInactivityTimer()

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleUserInteraction)
      })
      if (inactivityTimer.current) {
        clearTimeout(inactivityTimer.current)
      }
    }
  }, [isAuthenticated, signOut, router])
}
