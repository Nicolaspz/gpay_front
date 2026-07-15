interface SettingsHeaderProps {
    title: string
    description: string
  }
  
  export function SettingsHeader({ title, description }: SettingsHeaderProps) {
    return (
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-[var(--foreground)]" style={{ fontFamily: "var(--font-clash-display)" }}>{title}</h1>
        <p className="text-[var(--muted-foreground)]">{description}</p>
      </div>
    )
  }
