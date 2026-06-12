import { useState } from "react"
import { Sparkles, Brain, Cpu, MessageSquare, ClipboardList, ListPlus, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/lib/toast"
import {
  summarizeText,
  analyzeBrd,
  generateUserStories,
  type AISummaryResult,
  type AIBrdResult,
  type AIUserStoryResult,
  type AIRequirementItem,
  type AIUserStoryItem,
  type AIAcceptanceCriteria,
} from "@/lib/api"

interface AIExtensionsWorkspaceProps {
  sourceText: string
}

export function AIExtensionsWorkspace({ sourceText }: AIExtensionsWorkspaceProps) {
  const { toast } = useToast()
  
  // Tab states
  const [activeTab, setActiveTab] = useState("summarize")
  const [loading, setLoading] = useState(false)
  
  // Results states
  const [summaryResult, setSummaryResult] = useState<AISummaryResult | null>(null)
  const [brdResult, setBrdResult] = useState<AIBrdResult | null>(null)
  const [storiesResult, setStoriesResult] = useState<AIUserStoryResult | null>(null)

  // Summarize preferences
  const [style, setStyle] = useState<"bullet" | "paragraph">("bullet")
  const [length, setLength] = useState<"short" | "medium" | "long">("medium")

  async function handleSummarize() {
    setLoading(true)
    try {
      const res = await summarizeText(sourceText, style, length)
      setSummaryResult(res)
      toast({
        title: "Summary generated",
        description: `Successfully processed in ${res.processing_time_sec}s`,
        type: "success",
      })
    } catch (e) {
      toast({
        title: "Generation failed",
        description: e instanceof Error ? e.message : "Internal error occurred",
        type: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  async function handleAnalyzeBrd() {
    setLoading(true)
    try {
      const res = await analyzeBrd(sourceText)
      setBrdResult(res)
      toast({
        title: "BRD Analyzed",
        description: `Successfully extracted requirements in ${res.processing_time_sec}s`,
        type: "success",
      })
    } catch (e) {
      toast({
        title: "Analysis failed",
        description: e instanceof Error ? e.message : "Internal error occurred",
        type: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  async function handleGenerateStories() {
    setLoading(true)
    try {
      const res = await generateUserStories(sourceText)
      setStoriesResult(res)
      toast({
        title: "Stories generated",
        description: `Successfully generated stories in ${res.processing_time_sec}s`,
        type: "success",
      })
    } catch (e) {
      toast({
        title: "Generation failed",
        description: e instanceof Error ? e.message : "Internal error occurred",
        type: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="glass-card shadow-lg border-border/60">
      <CardHeader className="border-b border-border/40 bg-card/20 px-6 py-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-indigo-500 animate-pulse" />
          <CardTitle className="text-base font-semibold">AI Assistant Workspace</CardTitle>
          <Badge variant="outline" className="bg-primary/5 text-primary border-primary/10 ml-2">
            AI Extensions Preview
          </Badge>
        </div>
        <CardDescription>
          Run structural analytics directly on top of your extracted document content. These utilities utilize the mock AI service backend framework.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-muted/50 p-1 border border-border/50 grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="summarize" className="gap-1.5">
              <MessageSquare className="h-3.5 w-3.5" />
              Summarizer
            </TabsTrigger>
            <TabsTrigger value="brd" className="gap-1.5">
              <ClipboardList className="h-3.5 w-3.5" />
              BRD Analyst
            </TabsTrigger>
            <TabsTrigger value="stories" className="gap-1.5">
              <ListPlus className="h-3.5 w-3.5" />
              Story Generator
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Summarize */}
          <TabsContent value="summarize" className="focus-visible:outline-none space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border/60 bg-muted/10 p-4">
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground mr-2 font-medium">Style:</span>
                  <select
                    value={style}
                    onChange={(e) => setStyle(e.target.value as any)}
                    className="rounded-md border border-border bg-background px-2 py-1 text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                  >
                    <option value="bullet">Bullet List</option>
                    <option value="paragraph">Paragraph narrative</option>
                  </select>
                </div>
                <div>
                  <span className="text-muted-foreground mr-2 font-medium">Length:</span>
                  <select
                    value={length}
                    onChange={(e) => setLength(e.target.value as any)}
                    className="rounded-md border border-border bg-background px-2 py-1 text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                  >
                    <option value="short">Short</option>
                    <option value="medium">Medium</option>
                    <option value="long">Long</option>
                  </select>
                </div>
              </div>
              <Button onClick={handleSummarize} disabled={loading} size="sm" className="gap-1">
                {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Brain className="h-3.5 w-3.5" />}
                Generate Summary
              </Button>
            </div>

            {summaryResult ? (
              <div className="space-y-3 rounded-lg border border-border/80 bg-muted/10 p-4">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground flex items-center gap-1">
                    <Cpu className="h-3 w-3 text-indigo-400" />
                    AI Output
                  </span>
                  <span>
                    Tokens: {summaryResult.estimated_tokens} | Latency: {summaryResult.processing_time_sec}s
                  </span>
                </div>
                <div className="prose prose-sm dark:prose-invert max-w-none text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
                  {summaryResult.summary}
                </div>
              </div>
            ) : (
              <div className="flex min-h-[140px] flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/5 text-center p-6">
                <MessageSquare className="h-8 w-8 text-muted-foreground/40" />
                <h4 className="mt-2 text-sm font-semibold">No summary generated yet</h4>
                <p className="mt-1 text-xs text-muted-foreground">Click the button above to run the summarization engine.</p>
              </div>
            )}
          </TabsContent>

          {/* Tab 2: BRD Analyzer */}
          <TabsContent value="brd" className="focus-visible:outline-none space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/10 p-4">
              <span className="text-xs text-muted-foreground">Extract structured requirements from document body</span>
              <Button onClick={handleAnalyzeBrd} disabled={loading} size="sm" className="gap-1">
                {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ClipboardList className="h-3.5 w-3.5" />}
                Analyze BRD
              </Button>
            </div>

            {brdResult ? (
              <div className="space-y-4">
                <div className="rounded-lg border border-border/80 bg-muted/10 p-4 space-y-2">
                  <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">Business Context</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{brdResult.summary}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">Extracted Requirements</h4>
                  <div className="grid gap-3">
                    {brdResult.requirements.map((req: AIRequirementItem) => (
                      <div key={req.id} className="rounded-lg border border-border bg-card/60 p-4 shadow-sm flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-primary">{req.id}</span>
                            <h5 className="text-sm font-semibold text-foreground">{req.title}</h5>
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">{req.description}</p>
                        </div>
                        <div className="flex items-center gap-1.5 flex-shrink-0 self-start sm:self-auto">
                          <Badge variant="outline" className="text-[10px] bg-muted/50 border-border font-medium">
                            {req.category}
                          </Badge>
                          <Badge
                            className={`text-[10px] font-medium border-transparent ${
                              req.priority === "High"
                                ? "bg-red-500/10 text-red-500 hover:bg-red-500/15"
                                : req.priority === "Medium"
                                ? "bg-amber-500/10 text-amber-500 hover:bg-amber-500/15"
                                : "bg-blue-500/10 text-blue-500 hover:bg-blue-500/15"
                            }`}
                          >
                            {req.priority}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex min-h-[140px] flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/5 text-center p-6">
                <ClipboardList className="h-8 w-8 text-muted-foreground/40" />
                <h4 className="mt-2 text-sm font-semibold">No analysis performed yet</h4>
                <p className="mt-1 text-xs text-muted-foreground">Click the button above to run the BRD requirement extractor.</p>
              </div>
            )}
          </TabsContent>

          {/* Tab 3: Agile User Stories */}
          <TabsContent value="stories" className="focus-visible:outline-none space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/10 p-4">
              <span className="text-xs text-muted-foreground">Generate complete User Stories with Gherkin Acceptance Criteria</span>
              <Button onClick={handleGenerateStories} disabled={loading} size="sm" className="gap-1">
                {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ListPlus className="h-3.5 w-3.5" />}
                Generate Stories
              </Button>
            </div>

            {storiesResult ? (
              <div className="space-y-4">
                {storiesResult.user_stories.map((story: AIUserStoryItem) => (
                  <div key={story.id} className="rounded-lg border border-border bg-card/65 p-5 shadow-sm space-y-4">
                    {/* Story Header */}
                    <div className="border-b border-border pb-3 flex items-center justify-between gap-3">
                      <div>
                        <span className="font-mono text-xs font-bold text-primary">{story.id}</span>
                        <h4 className="text-sm font-semibold text-foreground mt-0.5">{story.title}</h4>
                      </div>
                      <Badge className="bg-indigo-500/10 text-indigo-500 border-transparent">Agile Story</Badge>
                    </div>

                    {/* Story Body */}
                    <div className="space-y-2 text-sm">
                      <div className="grid grid-cols-[80px_1fr] gap-2">
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">As a</span>
                        <span className="text-foreground/90 font-medium">{story.as_a}</span>
                      </div>
                      <div className="grid grid-cols-[80px_1fr] gap-2">
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">I want to</span>
                        <span className="text-foreground/90 font-medium">{story.i_want_to}</span>
                      </div>
                      <div className="grid grid-cols-[80px_1fr] gap-2">
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">So that</span>
                        <span className="text-foreground/90 font-medium">{story.so_that}</span>
                      </div>
                    </div>

                    {/* Acceptance Criteria */}
                    <div className="space-y-2">
                      <h5 className="text-[10px] font-bold text-foreground uppercase tracking-wider">Acceptance Criteria</h5>
                      <div className="space-y-3 pl-3 border-l border-primary/20">
                        {story.acceptance_criteria.map((ac: AIAcceptanceCriteria, index: number) => (
                          <div key={index} className="text-xs space-y-1">
                            <span className="font-semibold text-foreground block">Scenario: {ac.scenario}</span>
                            <div className="grid grid-cols-[60px_1fr] gap-1 pl-2 text-muted-foreground">
                              <span className="font-semibold text-foreground/80">Given</span>
                              <span>{ac.given}</span>
                              <span className="font-semibold text-foreground/80">When</span>
                              <span>{ac.when}</span>
                              <span className="font-semibold text-foreground/80">Then</span>
                              <span>{ac.then}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Suggested Test Cases */}
                    <div className="space-y-2">
                      <h5 className="text-[10px] font-bold text-foreground uppercase tracking-wider">Suggested UAT Test Cases</h5>
                      <ul className="text-xs text-muted-foreground list-disc pl-4 space-y-1">
                        {story.uat_test_cases.map((tc, index) => (
                          <li key={index}>{tc}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex min-h-[140px] flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/5 text-center p-6">
                <ListPlus className="h-8 w-8 text-muted-foreground/40" />
                <h4 className="mt-2 text-sm font-semibold">No stories generated yet</h4>
                <p className="mt-1 text-xs text-muted-foreground">Click the button above to run the user story generator.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
