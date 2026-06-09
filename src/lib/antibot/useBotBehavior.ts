"use client"

import { useRef, useMemo, useCallback } from "react"
import type { FieldRegistration, BotBehaviorConfig } from "./types"

interface FieldState {
  hasKeyDown: boolean
  hasMouseDown: boolean
  hasFocus: boolean
}

export function useBotBehavior(config: BotBehaviorConfig): {
  registerField: (id: string) => FieldRegistration
  isSuspicious: () => boolean
} {
  const fieldsRef = useRef<Record<string, FieldState>>({})
  const refsMap = useRef<Record<string, React.RefObject<HTMLInputElement | null>>>({})

  const getOrCreate = useCallback((id: string): FieldState => {
    if (!fieldsRef.current[id]) {
      fieldsRef.current[id] = {
        hasKeyDown: false,
        hasMouseDown: false,
        hasFocus: false,
      }
    }
    return fieldsRef.current[id]
  }, [])

  const getRef = useCallback((id: string): React.RefObject<HTMLInputElement | null> => {
    if (!refsMap.current[id]) {
      refsMap.current[id] = { current: null }
    }
    return refsMap.current[id]
  }, [])

  const registerField = useCallback(
    (id: string): FieldRegistration => {
      const state = getOrCreate(id)
      return {
        ref: getRef(id),
        onKeyDown: () => {
          state.hasKeyDown = true
        },
        onMouseDown: () => {
          state.hasMouseDown = true
        },
        onFocus: () => {
          state.hasFocus = true
        },
      }
    },
    [getOrCreate, getRef]
  )

  const isSuspicious = useCallback((): boolean => {
    for (const fieldId of config.fieldIds) {
      const state = fieldsRef.current[fieldId]
      if (!state) return true
      if (!state.hasFocus) return true
      if (!state.hasKeyDown && !state.hasMouseDown) return true
    }
    return false
  }, [config.fieldIds])

  return { registerField, isSuspicious }
}
