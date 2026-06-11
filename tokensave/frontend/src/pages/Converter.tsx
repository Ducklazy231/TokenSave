import { useState, useEffect } from "react"
import {
  FileText,
  RotateCcw,
  Scissors,
  Sparkles,
  Loader2
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { FileUpload } from "@/components/FileUpload"
import { StatsPanel } from "@/components/StatsPanel"
import { MetricsPanel } from "@/components/MetricsPanel"
import { OutputWorkspace } from "@/components/OutputWorkspace"
import { AIExtensionsWorkspace } from "@/components/AIExtensionsWorkspace"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { uploadDocument, type UploadResult } from "@/lib/api"
import { useToast } from "@/lib/toast"
import { formatNumber } from "@/lib/utils"

export default function Converter() {
  const [loading, setLoading] = useState(false)
  const [loadingStage, setLoadingStage] = useState(0)
  const [result, setResult] = useState<UploadResult | null>(null)
  const { toast } = useToast()

  // Simulate premium multi-stage loading descriptions
  useEffect(() => {
    if (!loading) {
      setLoadingStage(0)
      return
    }
    const timer1 = setTimeout(() => setLoadingStage(1), 800)
    const timer2 = setTimeout(() => setLoadingStage(2), 1800)
    const timer3 = setTimeout(() => setLoadingStage(3), 2800)
    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [loading])

  async function handleFile(file: File, turnstileToken?: string) {
    setLoading(true)
    setResult(null)
    toast({
      title: "Processing started",
      description: `Uploading and converting ${file.name}...`,
    })

    try {
      const data = await uploadDocument(file, turnstileToken)
      setResult(data)
      toast({
        title: "Success",
        description: `Successfully optimized ${file.name}!`,
        type: "success",
      })
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Something went wrong while processing your document."
      toast({
        title: "Conversion Failed",
        description: msg,
        type: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  const loadingMessages = [
    "Uploading data stream to backend...",
    "Microsoft MarkItDown extracting document layout...",
    "Running token compression models...",
    "Finalizing document workspace...",
  ]

  return (
    <div className="container max-w-6xl animate-fade-in py-10 px-4 md:py-14">
      {/* Header Info */}
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gradient sm:text-4xl">
            Convert documents to AI-ready text
          </h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-xl leading-relaxed">
            Drop any PDF, Word, PowerPoint, Excel, Text, or HTML file to extract clean markdown, view side-by-side token estimates, and collapse spacing noise to save context budget.
          </p>
        </div>
        
        {result && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setResult(null)
              toast({
                title: "Reset completed",
                description: "Ready to convert another document.",
              })
            }}
            className="h-9 hover:bg-muted"
          >
            <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> Convert another
          </Button>
        )}
      </div>

      {/* Upload Drop Zone (Show if not converted yet) */}
      {!result && !loading && (
        <div className="mx-auto max-w-4xl">
          <FileUpload onFile={handleFile} loading={loading} />
        </div>
      )}

      {/* Loading Skeletons */}
      {loading && (
        <div className="mx-auto max-w-3xl space-y-6 py-12 text-center animate-pulse-glow">
          <div className="flex flex-col items-center justify-center gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <h3 className="text-lg font-semibold text-foreground">
              {loadingMessages[loadingStage]}
            </h3>
            <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
              Converting layouts, cleaning unicode representations, and matching vector alignments. Please wait.
            </p>
          </div>
          <div className="mx-auto max-w-sm">
            <Progress value={(loadingStage + 1) * 25} className="h-1.5 bg-muted" />
          </div>
        </div>
      )}

      {/* Conversion Output Panel */}
      {result && (
        <div className="space-y-8">
          {/* Header file details */}
          <div className="flex flex-wrap items-center justify-between border-b border-border/40 pb-4 gap-3">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-sm border border-primary/10">
                <FileText className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-semibold text-foreground leading-none">{result.filename}</h3>
                <span className="text-xs text-muted-foreground leading-none mt-1.5 block">
                  Processed successfully with MarkItDown
                </span>
              </div>
            </div>
          </div>

          {/* Grid Layout: Savings Highlight Card + Metrics bar */}
          <div className="grid gap-6 md:grid-cols-3">
            {/* Savings gauge */}
            <Card className="glass-card md:col-span-2 overflow-hidden border-primary/15 bg-gradient-to-br from-primary/5 via-card/50 to-transparent">
              <CardContent className="flex flex-col justify-between h-full gap-6 p-6 sm:p-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <Scissors className="h-4 w-4" />
                    </span>
                    <span className="text-sm font-semibold text-foreground">
                      Layout Token Optimization
                    </span>
                  </div>
                  <Badge className="bg-primary/15 text-primary border-transparent text-[10px] uppercase font-bold tracking-wider">
                    Lossless
                  </Badge>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 my-2">
                  <div>
                    <div className="text-5xl font-black tracking-tight text-gradient-primary">
                      {result.saving_percentage}%
                    </div>
                    <div className="mt-1 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Token Volume Reduced
                    </div>
                  </div>
                  
                  <div className="w-full max-w-xs">
                    <div className="flex justify-between text-xs text-muted-foreground font-medium mb-1.5">
                      <span>Optimized</span>
                      <span>Original</span>
                    </div>
                    <Progress value={result.saving_percentage} className="h-2 bg-muted" />
                    <p className="mt-2 text-xs text-muted-foreground/80 leading-relaxed">
                      Compacted from <strong>{formatNumber(result.estimated_tokens)}</strong> to{" "}
                      <strong>{formatNumber(result.optimized_tokens)}</strong> tokens (
                      <strong>{formatNumber(result.saved_tokens)}</strong> saved).
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick action card or general info */}
            <Card className="glass-card bg-card/10 border-border/60">
              <CardContent className="p-6 flex flex-col justify-between h-full gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-indigo-400 dark:text-indigo-500 flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    AI Ready Output
                  </span>
                  <h4 className="text-sm font-semibold text-foreground">Paste Ready Text</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                    The optimized output trims formatting noise, markdown indentation tables, and padding characters. Copying it saves up to 40% on API costs.
                  </p>
                </div>
                
                <div className="text-[11px] text-muted-foreground/75 border-t border-border/40 pt-3">
                  Tested compatible with ChatGPT (GPT-4o), Anthropic Claude (3.5 Sonnet), and Google Gemini 1.5.
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Statistics Grid section */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Token & Character Breakdowns
            </h4>
            <StatsPanel result={result} />
          </div>

          {/* Engine Processing metrics */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              System Telemetry
            </h4>
            <MetricsPanel result={result} />
          </div>

          {/* Main workspace layout: Document editor + AI integrations */}
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Extracted content workspace */}
            <OutputWorkspace result={result} />

            {/* AI integrations extension point */}
            <AIExtensionsWorkspace sourceText={result.text} />
          </div>
        </div>
      )}
    </div>
  )
}
