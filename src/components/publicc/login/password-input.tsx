import { Eye, EyeOff } from "lucide-react"
import { Input } from "@/components/ui/input"
import { forwardRef } from "react"

interface PasswordInputProps extends React.ComponentProps<typeof Input> {
  visible: boolean
  onToggleVisibility: () => void
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ visible, onToggleVisibility, className, ...props }, ref) => (
    <div className="relative">
      <Input
        ref={ref}
        type={visible ? "text" : "password"}
        className={`pl-10 pr-10 h-11 bg-[var(--card)] border-[var(--border)] text-[var(--foreground)] ${className ?? ""}`}
        {...props}
      />
      <button
        type="button"
        onClick={onToggleVisibility}
        className="absolute inset-y-0 right-0 flex items-center pr-3 text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
      >
        {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  )
)

PasswordInput.displayName = "PasswordInput"
