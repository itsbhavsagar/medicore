import { LayoutGrid, Rows4 } from 'lucide-react'
import type { ViewMode } from '../../types'
import { cn } from '../../utils/cn'

interface ViewToggleProps {
  value: ViewMode
  onChange: (value: ViewMode) => void
}

const options: Array<{ label: string; value: ViewMode; icon: typeof LayoutGrid }> = [
  { label: 'Grid', value: 'grid', icon: LayoutGrid },
  { label: 'List', value: 'list', icon: Rows4 },
]

export function ViewToggle({ onChange, value }: ViewToggleProps) {
  return (
    <div className="inline-flex rounded-2xl border border-border bg-surface p-1">
      {options.map(({ icon: Icon, label, value: optionValue }) => {
        const active = optionValue === value

        return (
          <button
            className={cn(
              'inline-flex h-10 items-center gap-2 rounded-xl px-4 text-sm font-medium transition duration-200',
              active
                ? 'bg-primary text-white'
                : 'text-muted hover:text-foreground',
            )}
            key={optionValue}
            onClick={() => onChange(optionValue)}
            type="button"
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        )
      })}
    </div>
  )
}
