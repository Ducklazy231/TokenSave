import { Link } from "react-router-dom"
import {
  ArrowRight,
  FileText,
  Gauge,
  Scissors,
  Sparkles,
  Zap,
  Shield,
  Coins,
  Cpu
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

const features = [
  {
    icon: FileText,
    title: "Universal Document Support",
    desc: "Seamlessly drop PDF, DOCX, PPTX, XLSX, TXT, or HTML. Extract structured copy instantly.",
    color: "text-blue-500 bg-blue-500/10"
  },
  {
    icon: Sparkles,
    title: "AI-Ready Clean Extraction",
    desc: "Uses Microsoft's MarkItDown engine to produce pristine plain text and standard markdown.",
    color: "text-indigo-500 bg-indigo-500/10"
  },
  {
    icon: Gauge,
    title: "Token Optimizer Analytics",
    desc: "Compare character density and token metrics for GPT, Claude, and Gemini side by side.",
    color: "text-purple-500 bg-purple-500/10"
  },
  {
    icon: Scissors,
    title: "Lossless Smart Compression",
    desc: "Collapse double line breaks, remove spacing logs, and drop empty noise to shrink token usage.",
    color: "text-violet-500 bg-violet-500/10"
  },
  {
    icon: Coins,
    title: "Budget Optimizer",
    desc: "Trim token volume by up to ~40%, directly reducing your API bills and inference overhead.",
    color: "text-emerald-500 bg-emerald-500/10"
  },
  {
    icon: Shield,
    title: "Security & Privacy First",
    desc: "Local validations, stream guards, and no persistent file storage. Your files are never cached.",
    color: "text-rose-500 bg-rose-500/10"
  },
]

export default function Landing() {
  return (
    <div className="animate-fade-in relative min-h-screen">
      {/* Background radial grid */}
      <div className="absolute inset-0 -z-20 grid-bg opacity-75" />
      
      {/* Large glowing orbs */}
      <div className="absolute left-1/4 top-1/4 -z-10 h-[320px] w-[320px] rounded-full bg-primary/15 blur-[120px] animate-pulse-glow" />
      <div className="absolute right-1/4 top-1/3 -z-10 h-[380px] w-[380px] rounded-full bg-violet-500/10 blur-[130px] animate-pulse-glow" />

      {/* Hero Section */}
      <section className="container relative pt-20 pb-16 text-center md:pt-32 md:pb-24">
        <Badge className="mb-6 bg-primary/10 text-primary border-primary/25 hover:bg-primary/15 py-1 px-3 text-xs gap-1 font-semibold">
          <Sparkles className="h-3.5 w-3.5" /> Powered by Microsoft MarkItDown
        </Badge>
        <h1 className="mx-auto max-w-4xl text-4xl font-black tracking-tight text-gradient sm:text-6xl md:text-7xl leading-tight">
          Convert documents into <br />
          <span className="text-gradient-primary">AI-ready text</span> while saving tokens
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base md:text-lg text-muted-foreground leading-relaxed">
          TokenSave extracts structured markdown and raw text from complex file formats, computes token density, and compresses whitespaces so you pay less for LLM inference.
        </p>
        
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild size="lg" className="glow bg-primary hover:bg-primary/95 text-primary-foreground font-semibold px-8 shadow-lg">
            <Link to="/converter" className="gap-2">
              Start converting <ArrowRight className="h-4.5 w-4.5" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="glass-card hover:bg-muted font-medium px-8 border-border/80">
            <Link to="/about">Learn more</Link>
          </Button>
        </div>

        {/* Bullet features summary */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs md:text-sm text-muted-foreground/80 font-medium">
          <span className="flex items-center gap-1.5">
            <Zap className="h-4 w-4 text-primary" /> No sign-up required
          </span>
          <span className="h-1.5 w-1.5 rounded-full bg-border" />
          <span className="flex items-center gap-1.5">
            <Cpu className="h-4 w-4 text-violet-500" /> 6 formatting engines
          </span>
          <span className="h-1.5 w-1.5 rounded-full bg-border" />
          <span className="flex items-center gap-1.5">
            <Coins className="h-4 w-4 text-emerald-500" /> Shrink context up to ~40%
          </span>
        </div>
      </section>

      {/* Visual Workspace Mockup */}
      <section className="container max-w-5xl px-4 pb-20">
        <div className="rounded-2xl border border-border/70 bg-card/40 p-3 shadow-xl backdrop-blur-sm shadow-primary/2">
          <div className="rounded-xl border border-border/80 bg-background/90 overflow-hidden shadow-sm">
            {/* Header toolbar */}
            <div className="flex items-center justify-between border-b border-border/50 bg-muted/40 px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-rose-500/80" />
                <span className="h-3 w-3 rounded-full bg-amber-500/80" />
                <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
              </div>
              <div className="rounded border border-border/60 bg-background px-8 py-0.5 text-[10px] text-muted-foreground font-mono">
                workspace.tokensave.app
              </div>
              <div className="w-14" />
            </div>
            
            {/* Workspace Demo */}
            <div className="p-6 grid md:grid-cols-3 gap-6 bg-card/10">
              <div className="md:col-span-2 space-y-4">
                <div className="rounded-lg border border-border bg-background p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-border/50 pb-2">
                    <span className="text-xs font-bold text-foreground">optimized-output.txt</span>
                    <span className="text-[10px] text-emerald-500 font-semibold bg-emerald-500/10 px-1.5 py-0.5 rounded">AI Ready</span>
                  </div>
                  <pre className="text-[11px] font-mono text-muted-foreground leading-normal whitespace-pre-wrap">
                    {"# Project Requirements Document\n\n- Strict validation checks on headers to prevent spoofing.\n- Double space collapsing models trim tokens lossless.\n- Sidebar renders telemetry (size, engine, status, time).\n- Integrated mock extension endpoints for BRD summary."}
                  </pre>
                </div>
              </div>
              <div className="space-y-4">
                <div className="rounded-lg border border-border bg-background p-4 space-y-3">
                  <span className="text-xs font-bold text-foreground block">Compression Metrics</span>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-muted-foreground">Original Tokens</span>
                      <span className="font-bold font-mono">1,480</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-muted-foreground">Optimized Tokens</span>
                      <span className="font-bold font-mono text-primary">890</span>
                    </div>
                    <div className="h-1 bg-muted rounded-full overflow-hidden mt-1">
                      <div className="h-full bg-primary w-[60%]" />
                    </div>
                    <div className="text-[10px] text-emerald-500 font-medium text-right">
                      Saved 39.8% tokens
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Numerical Stats Metrics Banner */}
      <section className="border-y border-border/60 bg-card/30 backdrop-blur-sm">
        <div className="container grid grid-cols-2 gap-8 py-14 md:grid-cols-4">
          {[
            { v: "6+", l: "Document Engines" },
            { v: "3", l: "LLM Tokenizers" },
            { v: "~38%", l: "Average Token Savings" },
            { v: "0", l: "Persistent cached files" },
          ].map((s) => (
            <div key={s.l} className="text-center space-y-1">
              <div className="text-3xl font-black tracking-tight text-foreground md:text-4xl">
                {s.v}
              </div>
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Grid Features Listing */}
      <section className="container py-24 px-4 md:py-32">
        <div className="mx-auto max-w-2xl text-center space-y-3">
          <h2 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
            Everything you need to feed models efficiently
          </h2>
          <p className="text-sm md:text-base text-muted-foreground">
            A secure, professional, and zero-retention preprocessor designed for clean formatting.
          </p>
        </div>
        
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <Card key={f.title} className="glass-card glass-card-hover p-6 border-border/60 flex flex-col justify-between gap-4">
              <div className="space-y-3">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl shadow-sm ${f.color}`}>
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-foreground tracking-tight">{f.title}</h3>
                <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Call To Action Block */}
      <section className="container pb-28 px-4">
        <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-primary/10 via-card/60 to-transparent p-8 text-center sm:p-16 glass-card">
          <div className="absolute right-0 top-0 -z-10 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl leading-tight">
            Stop paying for raw layout noise
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm text-muted-foreground leading-relaxed">
            Drop a PDF, Docx, or HTML sheet. Instantly review token saving estimates and copy clean summaries free.
          </p>
          <Button asChild size="lg" className="mt-8 glow bg-primary hover:bg-primary/95 text-primary-foreground font-semibold px-8">
            <Link to="/converter" className="gap-2">
              Try TokenSave free <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </Card>
      </section>
    </div>
  )
}
