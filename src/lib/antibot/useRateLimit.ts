"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import type { RateLimitConfig } from "./types"

const DEFAULT_CONFIG: RateLimitConfig = {
  maxAttempts: 3,
  lockoutMs: 30000,
}

export function useRateLimit(config?: Partial<RateLimitConfig>): {
  attempts: number
  isLocked: boolean
  lockoutSecondsLeft: number
  registerFailure: () => void
  registerSuccess: () => void
} {
  const { maxAttempts, lockoutMs } = { ...DEFAULT_CONFIG, ...config }
  const [attempts, setAttempts] = useState(0)
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null)
  const [lockoutSecondsLeft, setLockoutSecondsLeft] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const isLocked = lockoutUntil !== null && Date.now() < lockoutUntil

  const clearCountdown = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  useEffect(() => {
    if (isLocked && lockoutUntil !== null) {
      const tick = () => {
        const remaining = Math.max(0, Math.ceil((lockoutUntil - Date.now()) / 1000))
        setLockoutSecondsLeft(remaining)
        if (remaining <= 0) {
          clearCountdown()
          setLockoutUntil(null)
          setLockoutSecondsLeft(0)
        }
      }
      tick()
      intervalRef.current = setInterval(tick, 1000)
    }

    if (!isLocked) {
      clearCountdown()
      setLockoutSecondsLeft(0)
    }

    return clearCountdown
  }, [isLocked, lockoutUntil, clearCountdown])

  const registerFailure = useCallback(() => {
    const next = attempts + 1
    setAttempts(next)
    if (next >= maxAttempts) {
      setLockoutUntil(Date.now() + lockoutMs)
    }
  }, [attempts, maxAttempts, lockoutMs])

  const registerSuccess = useCallback(() => {
    setAttempts(0)
    setLockoutUntil(null)
    setLockoutSecondsLeft(0)
    clearCountdown()
  }, [clearCountdown])

  return {
    attempts,
    isLocked,
    lockoutSecondsLeft,
    registerFailure,
    registerSuccess,
  }
}
