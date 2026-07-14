interface ApiKeysHeaderProps {
    title: string
    description: string
  }
  
  export function ApiKeysHeader({ title, description }: ApiKeysHeaderProps) {
    return (
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">{title}</h1>
        <p className="text-[var(--muted-foreground)]">{description}</p>
      </div>
    )
  }