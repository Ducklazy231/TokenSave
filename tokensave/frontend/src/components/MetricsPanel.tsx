import { CheckCircle2, AlertTriangle, Cpu, HardDrive, Clock } from "lucide-react"
import { type UploadResult } from "@/lib/api"
import { Badge } from "@/components/ui/badge"

interface MetricsPanelProps {
  result: UploadResult
}

export function MetricsPanel({ result }: MetricsPanelProps) {
  // Size Formatter
  function formatBytes(bytes: number): string {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const isSuccess = result.extraction_status === "success"

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-card/20 px-6 py-4 shadow-sm">
      <div className="flex flex-wrap items-center gap-6">
        {/* Metric 1: Size */}
        <div className="flex items-center gap-2.5">
          <HardDrive className="h-4 w-4 text-muted-foreground" />
          <div>
            <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider leading-none">
              File Size
            </div>
            <div className="mt-1 text-sm font-semibold text-foreground leading-none">
              {formatBytes(result.file_size_bytes)}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="hidden h-8 w-px bg-border sm:block" />

        {/* Metric 2: Time */}
        <div className="flex items-center gap-2.5">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <div>
            <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider leading-none">
              Latency
            </div>
            <div className="mt-1 text-sm font-semibold text-foreground leading-none">
              {result.processing_time_sec < 1
                ? `${(result.processing_time_sec * 1000).toFixed(0)} ms`
                : `${result.processing_time_sec.toFixed(2)} s`}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="hidden h-8 w-px bg-border sm:block" />

        {/* Metric 3: Processor */}
        <div className="flex items-center gap-2.5">
          <Cpu className="h-4 w-4 text-muted-foreground" />
          <div>
            <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider leading-none">
              Engine
            </div>
            <div className="mt-1 text-sm font-semibold text-foreground leading-none">
              MarkItDown
            </div>
          </div>
        </div>
      </div>

      {/* Extraction Status */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Extraction:</span>
        {isSuccess ? (
          <Badge className="gap-1 bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/15">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Completed
          </Badge>
        ) : (
          <Badge className="gap-1 bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/15">
            <AlertTriangle className="h-3.5 w-3.5" />
            Warning
          </Badge>
        )}
      </div>
    </div>
  )
}
