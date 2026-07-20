interface PaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  currentCount: number
  onPageChange: (page: number) => void
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  currentCount,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null

  return (
    <div className="flex justify-between items-center bg-[var(--muted)] p-4 rounded-xl border border-[var(--border)]">
      <p className="text-sm text-[var(--muted-foreground)]">
        Mostrando <strong>{currentCount}</strong> de <strong>{totalItems}</strong>
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-[var(--card)] border border-[var(--border)] rounded-lg text-sm disabled:opacity-50"
        >
          Anterior
        </button>
        <div className="flex items-center px-4 text-sm font-medium">
          Página {currentPage} de {totalPages}
        </div>
        <button
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-[var(--card)] border border-[var(--border)] rounded-lg text-sm disabled:opacity-50"
        >
          Próximo
        </button>
      </div>
    </div>
  )
}
