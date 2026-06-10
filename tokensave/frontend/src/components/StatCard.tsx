import { Card } from "@/components/ui/card"
import { cn, formatNumber } from "@/lib/utils"

interface StatCardProps {
  label: string
  value: number | string
  icon?: React.ReactNode
  accent?: string
  hint?: string
}

export function StatCard({ label, value, icon, accent, hint }: StatCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">
          {label}
        </span>
        {icon && (
          <span className={cn("text-muted-foreground", accent)}>{icon}</span>
        )}
      </div>
      <div className="mt-2 text-2xl font-bold tracking-tight">
        {typeof value === "number" ? formatNumber(value) : value}
      </div>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </Card>
  )
}
