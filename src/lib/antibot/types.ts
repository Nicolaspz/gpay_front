export interface RateLimitConfig {
  maxAttempts: number
  lockoutMs: number
}

export interface RateLimitState {
  attempts: number
  isLocked: boolean
  lockoutSecondsLeft: number
}

export interface HoneypotProps {
  name: string
  type: string
  tabIndex: number
  "aria-hidden": true
  autoComplete: "off"
  className: string
  style: React.CSSProperties
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export interface FieldRegistration {
  ref: React.RefObject<HTMLInputElement | null>
  onKeyDown: () => void
  onMouseDown: () => void
  onFocus: () => void
}

export interface BotBehaviorConfig {
  fieldIds: string[]
}
