import { useState, useEffect } from "react"
import {
  FileText,
  RotateCcw,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertTriangle
} from "lucide-react"
import { FileUpload } from "@/components/FileUpload"
import { OutputWorkspace } from "@/components/OutputWorkspace"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { uploadDocument, type UploadResult } from "@/lib/api"
import { useToast } from "@/lib/toast"
import { formatNumber } from "@/lib/utils"

interface BatchResult {
  filename: string
  size: number
  status: "success" | "failed"
  data?: UploadResult
  error?: string
}

export default function Converter() {
  const [loading, setLoading] = useState(false)
  const [loadingStage, setLoadingStage] = useState(0)
  const [result, setResult] = useState<UploadResult | null>(null)
  const [batchFiles, setBatchFiles] = useState<File[]>([])
  const [batchResults, setBatchResults] = useState<BatchResult[]>([])
  const [currentFileIndex, setCurrentFileIndex] = useState(0)
  const { toast } = useToast()

  function formatBytes(bytes: number): string {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
  }

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
  }, [loading, currentFileIndex])

  // Reset loading stage when moving to the next file in batch
  useEffect(() => {
    setLoadingStage(0)
  }, [currentFileIndex])

  async function handleFiles(files: File[]) {
    setLoading(true)
    setResult(null)
    setBatchResults([])
    setBatchFiles(files)
    setCurrentFileIndex(0)

    toast({
      title: "Batch conversion started",
      description: `Processing ${files.length} document${files.length > 1 ? "s" : ""}...`,
    })

    const results: BatchResult[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      setCurrentFileIndex(i)

      try {
        const data = await uploadDocument(file)
        results.push({
          filename: file.name,
          size: file.size,
          status: "success",
          data,
        })
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Something went wrong while processing your document."
        results.push({
          filename: file.name,
          size: file.size,
          status: "failed",
          error: msg,
        })
        toast({
          title: `Failed: ${file.name}`,
          description: msg,
          type: "error",
        })
      }
    }

    setBatchResults(results)

    const successful = results.filter(
      (r) => r.status === "success" && r.data
    ) as Array<BatchResult & { data: UploadResult }>

    if (successful.length > 0) {
      // Calculate totals
      const totalWordCount = successful.reduce((acc, r) => acc + r.data.word_count, 0)
      const totalCharacterCount = successful.reduce((acc, r) => acc + r.data.character_count, 0)
      const totalLineCount = successful.reduce((acc, r) => acc + r.data.line_count, 0)
      const totalEstimatedTokens = successful.reduce((acc, r) => acc + r.data.estimated_tokens, 0)
      const totalEstimatedTokensGpt = successful.reduce((acc, r) => acc + r.data.estimated_tokens_gpt, 0)
      const totalEstimatedTokensClaude = successful.reduce((acc, r) => acc + r.data.estimated_tokens_claude, 0)
      const totalEstimatedTokensGemini = successful.reduce((acc, r) => acc + r.data.estimated_tokens_gemini, 0)
      const totalOptimizedTokens = successful.reduce((acc, r) => acc + r.data.optimized_tokens, 0)
      const totalSavedTokens = successful.reduce((acc, r) => acc + r.data.saved_tokens, 0)
      const totalFileSize = successful.reduce((acc, r) => acc + r.data.file_size_bytes, 0)
      const totalProcessingTime = successful.reduce((acc, r) => acc + r.data.processing_time_sec, 0)

      const combinedSavingPercentage = totalEstimatedTokensGpt > 0
        ? Math.round((totalSavedTokens / totalEstimatedTokensGpt) * 100 * 10) / 10
        : 0

      const formatContent = (filename: string, content: string) => {
        const trimmed = content.trim()
        const label = `FILE: ${filename}`
        const underline = "=".repeat(label.length)
        const topSeparator = "=".repeat(49)
        return `${topSeparator}\n${label}\n${underline}\n${trimmed}`
      }

      const combinedText = successful.map((r) => formatContent(r.filename, r.data.text)).join("\n\n")
      const combinedMarkdown = successful.map((r) => formatContent(r.filename, r.data.markdown)).join("\n\n")
      const combinedOptimizedText = successful.map((r) => formatContent(r.filename, r.data.optimized_text)).join("\n\n")

      const combinedResult: UploadResult = {
        filename: successful.map((r) => r.filename).join(", "),
        text: combinedText,
        markdown: combinedMarkdown,
        word_count: totalWordCount,
        character_count: totalCharacterCount,
        line_count: totalLineCount,
        estimated_tokens: totalEstimatedTokens,
        estimated_tokens_gpt: totalEstimatedTokensGpt,
        estimated_tokens_claude: totalEstimatedTokensClaude,
        estimated_tokens_gemini: totalEstimatedTokensGemini,
        optimized_text: combinedOptimizedText,
        optimized_tokens: totalOptimizedTokens,
        saved_tokens: totalSavedTokens,
        saving_percentage: combinedSavingPercentage,
        file_size_bytes: totalFileSize,
        processing_time_sec: totalProcessingTime,
        extraction_status: "success",
      }

      setResult(combinedResult)

      const failedCount = results.filter((r) => r.status === "failed").length
      if (failedCount > 0) {
        toast({
          title: "Batch Complete with warnings",
          description: `Successfully converted ${successful.length} of ${files.length} files.`,
          type: "info",
        })
      } else {
        toast({
          title: "Batch Success",
          description: `Successfully converted all ${files.length} files!`,
          type: "success",
        })
      }
    } else {
      toast({
        title: "Batch Conversion Failed",
        description: "All uploaded files failed to convert. Please check details in summary.",
        type: "error",
      })
    }

    setLoading(false)
  }

  const loadingMessages = [
    "Uploading data stream to backend...",
    "Microsoft MarkItDown extracting document layout...",
    "Running token compression models...",
    "Finalizing document workspace...",
  ]

  return (
    <div className="container max-w-6xl animate-fade-in py-10 px-4 md:py-14 space-y-8">
      {/* Header Info */}
      <div>
        <h1 className="text-3xl font-black tracking-tight text-gradient sm:text-4xl">
          Convert documents to AI-ready text
        </h1>
        <p className="mt-2 text-sm text-muted-foreground max-w-xl leading-relaxed">
          Drop any PDF, Word, PowerPoint, Excel, Text, or HTML file to extract clean markdown, view side-by-side token estimates, and collapse spacing noise to save context budget.
        </p>
      </div>

      {/* Upload Drop Zone & Warning Section */}
      <div className="mx-auto max-w-4xl space-y-4">
        <FileUpload onFiles={handleFiles} loading={loading} />

        {/* PDF warning notice */}
        {!loading && (
          <div className="flex items-start gap-2.5 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3.5 text-xs text-amber-600 dark:text-amber-500/90 leading-relaxed max-w-2xl mx-auto shadow-sm">
            <span className="flex-shrink-0 text-sm mt-0.8">⚠️</span>
            <span>Only text-based PDFs are supported. Scanned or image-only PDFs may not be converted correctly.</span>
          </div>
        )}
      </div>

      {/* Loading Skeletons */}
      {loading && (
        <div className="mx-auto max-w-3xl space-y-6 py-12 text-center animate-pulse-glow">
          <div className="flex flex-col items-center justify-center gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <h3 className="text-lg font-semibold text-foreground">
              {batchFiles.length > 0
                ? `Converting ${currentFileIndex + 1} of ${batchFiles.length}: ${batchFiles[currentFileIndex]?.name}`
                : "Processing..."}
            </h3>
            <p className="text-xs text-muted-foreground max-w-xs leading-relaxed animate-pulse">
              {loadingMessages[loadingStage]}
            </p>
          </div>
          <div className="mx-auto max-w-sm">
            <Progress
              value={((currentFileIndex) / batchFiles.length) * 100 + ((loadingStage + 1) * 25) / batchFiles.length}
              className="h-1.5 bg-muted"
            />
          </div>
        </div>
      )}

      {/* Conversion Output Panel / Summary */}
      {!loading && (result || batchResults.length > 0) && (
        <div className="space-y-8 border-t border-border/40 pt-8 animate-fade-in">
          {/* Header file details */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-sm border border-primary/10">
                <FileText className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-semibold text-foreground leading-none">
                  {result ? "Conversion Output" : "Conversion Failed"}
                </h3>
                <span className="text-xs text-muted-foreground leading-none mt-1.5 block">
                  {result
                    ? `Processed ${batchResults.filter((r) => r.status === "success").length} of ${batchResults.length} files successfully`
                    : "No files were converted successfully"}
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setResult(null)
                setBatchResults([])
                setBatchFiles([])
                toast({
                  title: "Results cleared",
                  description: "Dashboard has been reset.",
                })
              }}
              className="h-9 hover:bg-muted"
            >
              <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> Clear results
            </Button>
          </div>

          {/* Summary Checklist Card */}
          <Card className="glass-card border-border/60 bg-card/5 overflow-hidden">
            <CardHeader className="border-b border-border/40 bg-muted/10 px-6 py-4 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                Conversion Summary ({batchResults.filter((r) => r.status === "success").length} of {batchResults.length} succeeded)
              </CardTitle>
              {batchResults.some((r) => r.status === "failed") && (
                <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded border border-destructive/20 bg-destructive/10 text-destructive flex items-center gap-1">
                  <AlertTriangle className="h-2.5 w-2.5" /> Some errors
                </span>
              )}
            </CardHeader>
            <CardContent className="p-0 divide-y divide-border/40">
              {batchResults.map((item, idx) => (
                <div key={idx} className="flex flex-wrap items-center justify-between px-6 py-3.5 text-sm gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    {item.status === "success" ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                    ) : (
                      <XCircle className="h-4 w-4 text-destructive flex-shrink-0" />
                    )}
                    <div className="truncate">
                      <span className="font-medium text-foreground text-xs block truncate">{item.filename}</span>
                      <span className="text-[10px] text-muted-foreground font-mono">
                        {formatBytes(item.size)}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    {item.status === "success" ? (
                      <div className="text-xs font-medium text-muted-foreground">
                        <span className="text-emerald-500 font-semibold">{formatNumber(item.data?.optimized_tokens ?? 0)}</span> tokens{" "}
                        <span className="text-[10px] text-muted-foreground">
                          (saved {item.data?.saving_percentage}%)
                        </span>
                      </div>
                    ) : (
                      <div className="text-xs font-semibold text-destructive max-w-xs sm:max-w-md truncate">
                        {item.error || "Unknown conversion error"}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {result && (
            <>
              {/* Statistics Grid */}
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <Card className="glass-card bg-card/30 p-4 border-border/60">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Characters</span>
                  <span className="text-2xl font-black mt-1.5 block text-foreground">{formatNumber(result.character_count)}</span>
                </Card>
                <Card className="glass-card bg-card/30 p-4 border-border/60">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Words</span>
                  <span className="text-2xl font-black mt-1.5 block text-foreground">{formatNumber(result.word_count)}</span>
                </Card>
                <Card className="glass-card bg-card/30 p-4 border-border/60">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Estimated Tokens</span>
                  <span className="text-2xl font-black mt-1.5 block text-foreground">{formatNumber(result.estimated_tokens)}</span>
                </Card>
                <Card className="glass-card bg-card/30 p-4 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">Token Savings</span>
                  <span className="text-2xl font-black mt-1.5 block text-gradient-primary">{result.saving_percentage}%</span>
                </Card>
              </div>

              {/* Main workspace layout */}
              <div className="w-full">
                <OutputWorkspace result={result} />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
