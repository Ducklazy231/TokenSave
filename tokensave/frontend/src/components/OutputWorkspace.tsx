import { useState } from "react"
import { Check, Copy, Download, FileText, BadgeCheck } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/lib/toast"
import { type UploadResult } from "@/lib/api"

interface OutputWorkspaceProps {
  result: UploadResult
}

export function OutputWorkspace({ result }: OutputWorkspaceProps) {
  const { toast } = useToast()

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
          Extracted workspace
        </CardTitle>
        <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 gap-1 font-medium hover:bg-emerald-500/15">
          <BadgeCheck className="h-3.5 w-3.5" />
          AI-ready
        </Badge>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs defaultValue="optimized" className="w-full">
          <div className="flex items-center justify-between border-b border-border/40 pb-3 mb-4">
            <TabsList className="bg-muted/50 p-1 border border-border/50">
              <TabsTrigger
                value="optimized"
                className="data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                Optimized
              </TabsTrigger>
              <TabsTrigger
                value="plain"
                className="data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                Plain text
              </TabsTrigger>
              <TabsTrigger
                value="markdown"
                className="data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                Markdown
              </TabsTrigger>
            </TabsList>
            
            <div className="text-xs text-muted-foreground hidden sm:block">
              Double blank lines, extra whitespaces, and noise stripped.
            </div>
          </div>

          <TabsContent value="optimized" className="mt-0 focus-visible:outline-none">
            <OutputBlock text={result.optimized_text} />
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <CopyButton text={result.optimized_text} label="Copy optimized text" />
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  handleDownload(
                    "tokensave-optimized.txt",
                    result.optimized_text,
                    "text/plain",
                  )
                }
              >
                <Download className="mr-1.5 h-3.5 w-3.5" /> Download TXT
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="plain" className="mt-0 focus-visible:outline-none">
            <OutputBlock text={result.text} />
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <CopyButton text={result.text} label="Copy raw plain text" />
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  handleDownload(
                    "tokensave-text.txt",
                    result.text,
                    "text/plain",
                  )
                }
              >
                <Download className="mr-1.5 h-3.5 w-3.5" /> Download TXT
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="markdown" className="mt-0 focus-visible:outline-none">
            <OutputBlock text={result.markdown} mono />
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <CopyButton text={result.markdown} label="Copy markdown" />
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  handleDownload(
                    "tokensave.md",
                    result.markdown,
                    "text/markdown",
                  )
                }
              >
                <Download className="mr-1.5 h-3.5 w-3.5" /> Download Markdown
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

function OutputBlock({ text, mono }: { text: string; mono?: boolean }) {
  return (
    <pre
      className={`max-h-96 min-h-[160px] overflow-auto whitespace-pre-wrap rounded-lg border border-border/80 bg-muted/20 p-4 text-sm leading-relaxed text-foreground/90 selection:bg-primary/20 focus:outline-none focus:ring-1 focus:ring-primary/20 ${
        mono ? "font-mono text-xs" : ""
      }`}
    >
      {text || "(No content extracted)"}
    </pre>
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
        description: "Text content successfully copied to clipboard",
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
