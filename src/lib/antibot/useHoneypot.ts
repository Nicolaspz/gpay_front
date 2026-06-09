"use client"

import { useState, useCallback } from "react"
import type { HoneypotProps } from "./types"

export function useHoneypot(): {
  honeypotProps: HoneypotProps
  isTriggered: boolean
} {
  const [value, setValue] = useState("")
  const [isTriggered, setIsTriggered] = useState(false)

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
    if (e.target.value.length > 0) {
      setIsTriggered(true)
    }
  }, [])

  const honeypotProps: HoneypotProps = {
    name: "website",
    type: "text",
    tabIndex: -1,
    "aria-hidden": true,
    autoComplete: "off",
    className: "honeypot-field",
    style: {
      position: "absolute",
      left: "-9999px",
      opacity: 0,
      width: "1px",
      height: "1px",
      overflow: "hidden",
    },
    value,
    onChange,
  }

  return { honeypotProps, isTriggered }
}
