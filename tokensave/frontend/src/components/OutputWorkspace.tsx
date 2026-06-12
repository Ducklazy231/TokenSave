import { useState } from "react"
import { Check, Copy, Download, FileText, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/lib/toast"
import { type UploadResult } from "@/lib/api"
import { formatNumber } from "@/lib/utils"

const PREVIEW_CHAR_LIMIT = 50_000

interface OutputWorkspaceProps {
  result: UploadResult
}

export function OutputWorkspace({ result }: OutputWorkspaceProps) {
  const { toast } = useToast()

  const fullText = result.markdown

  function handleDownload(filename: string, content: string, type: string) {
    const blob = new Blob([content], { type })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
    toast({
      title: "File downloaded",
      description: `Saved as ${filename}`,
      type: "success",
    })
  }

  return (
    <Card className="glass-card shadow-lg border-border/60 overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between border-b border-border/40 bg-card/20 px-6 py-4 space-y-0">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <FileText className="h-4 w-4 text-primary" />
          Extracted Content
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <OutputBlock fullText={fullText} mono={true} />
        
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <CopyButton text={fullText} label="Copy Content" />
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              handleDownload(
                "tokensave-output.txt",
                result.optimized_text,
                "text/plain",
              )
            }
          >
            <Download className="mr-1.5 h-3.5 w-3.5" /> Download TXT
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              handleDownload(
                "tokensave-output.md",
                result.markdown,
                "text/markdown",
              )
            }
          >
            <Download className="mr-1.5 h-3.5 w-3.5" /> Download Markdown
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function OutputBlock({ fullText, mono }: { fullText: string; mono?: boolean }) {
  const isTruncated = fullText.length > PREVIEW_CHAR_LIMIT
  const displayText = isTruncated
    ? fullText.slice(0, PREVIEW_CHAR_LIMIT)
    : fullText

  return (
    <div>
      <pre
        className={`max-h-[480px] min-h-[200px] overflow-auto whitespace-pre-wrap rounded-lg border border-border/80 bg-muted/20 p-4 text-sm leading-relaxed text-foreground/90 selection:bg-primary/20 focus:outline-none focus:ring-1 focus:ring-primary/20 ${
          mono ? "font-mono text-xs" : ""
        }`}
      >
        {displayText || "(No content extracted)"}
      </pre>
      {isTruncated && (
        <div className="mt-2 flex items-start gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 px-3.5 py-2.5 text-xs text-amber-600 dark:text-amber-400 leading-relaxed">
          <Info className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
          <span>
            Preview truncated — showing first {formatNumber(PREVIEW_CHAR_LIMIT)} of{" "}
            {formatNumber(fullText.length)} characters. Use <strong>Copy</strong> or{" "}
            <strong>Download</strong> to get the full content.
          </span>
        </div>
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
    <Button variant="default" size="sm" onClick={handleCopy} className="gap-1.5">
      {copied ? <Check className="h-3.5 w-3.5 animate-pulse" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? "Copied" : label}
    </Button>
  )
}
