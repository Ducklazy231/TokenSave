import { useState, useEffect } from "react"
import {
  FileText,
  RotateCcw,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Check,
  Copy,
  Download
} from "lucide-react"
import JSZip from "jszip"
import { FileUpload } from "@/components/FileUpload"
import { OutputWorkspace } from "@/components/OutputWorkspace"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { uploadDocument, type UploadResult } from "@/lib/api"
import { useToast } from "@/lib/toast"
import { formatNumber, cn } from "@/lib/utils"

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

  useEffect(() => {
    setLoadingStage(0)
  }, [currentFileIndex])

  async function handleFiles(files: File[], fastMode: boolean) {
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
        const data = await uploadDocument(file, fastMode)
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
        warnings: successful.reduce((acc, r) => [...acc, ...(r.data.warnings || [])], [] as string[]),
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
      <div>
        <h1 className="text-3xl font-black tracking-tight text-gradient sm:text-4xl">
          Convert documents to AI-ready text
        </h1>
        <p className="mt-2 text-sm text-muted-foreground max-w-xl leading-relaxed">
          Drop any PDF, Word, PowerPoint, Excel, Text, or HTML file to extract clean markdown, view side-by-side token estimates, and collapse spacing noise to save context budget.
        </p>
      </div>

      <div className="mx-auto max-w-4xl space-y-4">
        <FileUpload onFiles={handleFiles} loading={loading} />

        {!loading && (
          <div className="flex items-start gap-2.5 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3.5 text-xs text-amber-600 dark:text-amber-500/90 leading-relaxed max-w-2xl mx-auto shadow-sm">
            <span className="flex-shrink-0 text-sm mt-0.8">⚠️</span>
            <span>Only text-based PDFs are supported. Scanned or image-only PDFs may not be converted correctly.</span>
          </div>
        )}
      </div>

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

      {!loading && (result || batchResults.length > 0) && (
        <div className="space-y-8 border-t border-border/40 pt-8 animate-fade-in">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-sm border border-primary/10">
                <FileText className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-semibold text-foreground leading-none">
                  Conversion Output
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
                      {item.status === "success" && item.data?.warnings && item.data.warnings.length > 0 && (
                        <div className="mt-1.5 space-y-1 pl-1 border-l border-border/60">
                          {item.data?.warnings?.map((warn: string, wIdx: number) => {
                            const isWarning = warn.includes("of") && warn.includes("processed")
                            return (
                              <div key={wIdx} className={cn(
                                "text-[10px] flex items-center gap-1.5 font-medium leading-normal",
                                isWarning ? "text-amber-500 dark:text-amber-400" : "text-muted-foreground"
                              )}>
                                <span className="flex-shrink-0 text-xs">
                                  {isWarning ? "⚠️" : "✓"}
                                </span>
                                <span>{warn}</span>
                              </div>
                            )
                          })}
                        </div>
                      )}
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

              <Card className="glass-card border-border/60 bg-card/5 p-5 space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3.5">
                    AI Compatibility & Split Recommendations
                  </h4>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
                    <ModelCompCard
                      name="GPT-4o"
                      limitText="~128K"
                      limit={128000}
                      tokens={result.estimated_tokens}
                    />
                    <ModelCompCard
                      name="GPT-5.4"
                      limitText="~1M"
                      limit={1000000}
                      tokens={result.estimated_tokens}
                    />
                    <ModelCompCard
                      name="Claude Sonnet"
                      limitText="~200K"
                      limit={200000}
                      tokens={result.estimated_tokens}
                    />
                    <ModelCompCard
                      name="Claude 4.6"
                      limitText="~1M"
                      limit={1000000}
                      tokens={result.estimated_tokens}
                    />
                    <ModelCompCard
                      name="Gemini 2.5 Pro"
                      limitText="~2M"
                      limit={2000000}
                      tokens={result.estimated_tokens}
                    />
                    <ModelCompCard
                      name="Gemini 3.x Pro"
                      limitText="~1M"
                      limit={1000000}
                      tokens={result.estimated_tokens}
                    />
                  </div>
                </div>

                {result.estimated_tokens > 128000 && (
                  <SplitGenerator result={result} />
                )}
              </Card>

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

function ModelCompCard({
  name,
  limitText,
  limit,
  tokens,
}: {
  name: string
  limitText: string
  limit: number
  tokens: number
}) {
  const exceeds = tokens > limit
  const parts = Math.ceil(tokens / limit)
  return (
    <div
      className={cn(
        "rounded-xl border p-3 flex flex-col items-center justify-center text-center space-y-1 transition-all duration-200",
        exceeds ? "border-destructive/20 bg-destructive/5 dark:bg-destructive/10" : "border-border/40 bg-card/20"
      )}
    >
      <span className="text-xs font-semibold text-foreground">{name}</span>
      <span className="text-[10px] text-muted-foreground font-mono">{limitText}</span>
      {exceeds ? (
        <>
          <span className="text-[10px] font-bold text-destructive mt-1">❌ Exceeds Limit</span>
          <span className="text-[9px] font-semibold text-amber-600 dark:text-amber-500">
            Recommended Split: {parts} Parts
          </span>
        </>
      ) : (
        <span className="text-[10px] font-bold text-emerald-500 mt-1">✅ Compatible</span>
      )}
    </div>
  )
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      toast({
        title: "Copied!",
        description: "Content successfully copied to clipboard",
        type: "success",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast({
        title: "Copy failed",
        description: "Could not write to clipboard",
        type: "error",
      })
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleCopy}
      className="h-8 gap-1 hover:bg-muted text-xs px-2.5 rounded-lg"
    >
      {copied ? <Check className="h-3.5 w-3.5 animate-pulse text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? "Copied" : label}
    </Button>
  )
}

function splitContent(content: string, targetTokenLimit: number): string[] {
  const targetCharLimit = targetTokenLimit * 4
  const lines = content.split("\n")
  const blocks: string[] = []
  let currentBlock: string[] = []

  for (const line of lines) {
    const isHeading = /^#{1,6}\s+/.test(line) || line.startsWith("### Sheet:")

    if (isHeading && currentBlock.length > 0) {
      blocks.push(currentBlock.join("\n"))
      currentBlock = [line]
    } else if (line.trim() === "" && currentBlock.length > 0) {
      currentBlock.push(line)
      blocks.push(currentBlock.join("\n"))
      currentBlock = []
    } else {
      currentBlock.push(line)
    }
  }
  if (currentBlock.length > 0) {
    blocks.push(currentBlock.join("\n"))
  }

  const chunks: string[] = []
  let currentChunk: string[] = []
  let currentChunkLen = 0

  for (const block of blocks) {
    const trimmedBlock = block.trim()
    if (!trimmedBlock) continue

    const blockLen = block.length

    if (blockLen > targetCharLimit) {
      if (currentChunk.length > 0) {
        chunks.push(currentChunk.join("\n\n").trim())
        currentChunk = []
        currentChunkLen = 0
      }

      const subLines = block.split("\n")
      let subChunk: string[] = []
      let subChunkLen = 0

      for (const subLine of subLines) {
        if (subChunkLen + subLine.length > targetCharLimit && subChunk.length > 0) {
          chunks.push(subChunk.join("\n").trim())
          subChunk = [subLine]
          subChunkLen = subLine.length
        } else {
          subChunk.push(subLine)
          subChunkLen += subLine.length + 1
        }
      }
      if (subChunk.length > 0) {
        chunks.push(subChunk.join("\n").trim())
      }
    } else if (currentChunkLen + blockLen > targetCharLimit && currentChunk.length > 0) {
      chunks.push(currentChunk.join("\n\n").trim())
      currentChunk = [block]
      currentChunkLen = blockLen
    } else {
      currentChunk.push(block)
      currentChunkLen += blockLen + 2
    }
  }

  if (currentChunk.length > 0) {
    chunks.push(currentChunk.join("\n\n").trim())
  }

  return chunks
}

function SplitGenerator({ result }: { result: UploadResult }) {
  const [selectedLimit, setSelectedLimit] = useState<number>(128000)
  const [chunks, setChunks] = useState<string[]>([])
  const [splitting, setSplitting] = useState(false)
  const { toast } = useToast()

  const handleGenerateSplits = () => {
    setSplitting(true)
    // Yield to the browser so the "Generating…" UI can paint before
    // the heavy synchronous splitContent work blocks the main thread.
    setTimeout(() => {
      try {
        const splitChunks = splitContent(result.markdown, selectedLimit)
        setChunks(splitChunks)
        toast({
          title: "Split files generated",
          description: `Successfully split document into ${splitChunks.length} logical chunks.`,
          type: "success",
        })
      } finally {
        setSplitting(false)
      }
    }, 0)
  }

  const handleDownloadChunk = (chunk: string, idx: number) => {
    const blob = new Blob([chunk], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `tokensave-chunk-${idx + 1}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleDownloadAllZip = async () => {
    try {
      const zip = new JSZip()
      chunks.forEach((chunk, index) => {
        zip.file(`tokensave-chunk-${index + 1}.txt`, chunk)
      })
      const blob = await zip.generateAsync({ type: "blob" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `tokensave-split-parts.zip`
      a.click()
      URL.revokeObjectURL(url)
      toast({
        title: "ZIP downloaded",
        description: `Saved all ${chunks.length} chunks.`,
        type: "success",
      })
    } catch {
      toast({
        title: "ZIP creation failed",
        description: "Could not bundle files.",
        type: "error",
      })
    }
  }

  return (
    <div className="border-t border-border/40 pt-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-0.5">
          <h5 className="text-sm font-semibold text-foreground">Generate Split Files</h5>
          <p className="text-[10px] text-muted-foreground">
            Select a target model limit to partition the converted content at logical boundaries.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedLimit}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10)
              setSelectedLimit(val)
              setChunks([])
            }}
            className="h-9 rounded-lg border border-border/80 bg-background text-foreground dark:bg-card dark:text-foreground px-3 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary/20 cursor-pointer"
          >
            <option value={128000} className="bg-background text-foreground dark:bg-card dark:text-foreground">GPT-4o (~128K)</option>
            <option value={200000} className="bg-background text-foreground dark:bg-card dark:text-foreground">Claude Sonnet (~200K)</option>
            <option value={1000000} className="bg-background text-foreground dark:bg-card dark:text-foreground">Claude 4.6 / Gemini 1.5 Flash (~1M)</option>
            <option value={2000000} className="bg-background text-foreground dark:bg-card dark:text-foreground">Gemini 2.5 Pro (~2M)</option>
          </select>
          <Button size="sm" onClick={handleGenerateSplits} disabled={splitting} className="h-9 font-semibold gap-1.5">
            {splitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {splitting ? "Generating…" : "Generate Splits"}
          </Button>
        </div>
      </div>

      {chunks.length > 0 && (
        <div className="space-y-3.5 animate-fade-in border border-border/60 rounded-xl bg-card/10 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-foreground">Generated Chunks ({chunks.length} Files)</span>
            <Button variant="outline" size="sm" onClick={handleDownloadAllZip} className="h-8 gap-1.5">
              <Download className="h-3.5 w-3.5" /> Download ZIP Archive
            </Button>
          </div>
          <div className="max-h-60 overflow-y-auto divide-y divide-border/30 pr-1">
            {chunks.map((chunk, idx) => {
              const charCount = chunk.length
              const tokenEst = Math.ceil(charCount / 4)
              return (
                <div key={idx} className="flex items-center justify-between py-2.5 text-xs gap-3">
                  <div className="min-w-0">
                    <span className="font-semibold text-foreground block truncate">
                      Part {idx + 1} of {chunks.length}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {formatNumber(charCount)} chars · ~{formatNumber(tokenEst)} tokens
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <CopyButton text={chunk} label="Copy" />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownloadChunk(chunk, idx)}
                      className="h-8 hover:bg-muted font-medium text-xs px-2.5 rounded-lg"
                    >
                      <Download className="mr-1 h-3.5 w-3.5" /> Download
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
