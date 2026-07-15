interface PageSpinnerProps {
  text?: string
  className?: string
}

export function PageSpinner({ text, className }: PageSpinnerProps) {
  return (
    <div className={`flex items-center justify-center min-h-screen ${className ?? ""}`}>
      <div className="flex flex-col items-center space-y-4">
        <div className="w-12 h-12 border-4 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin" />
        {text && <p className="text-[var(--muted-foreground)] text-sm">{text}</p>}
      </div>
    </div>
  )
}
