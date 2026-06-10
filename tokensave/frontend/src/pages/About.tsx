import { Link } from "react-router-dom"
import { ArrowRight, Github, Sparkles, BookOpen, Layers, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const steps = [
  {
    n: "01",
    title: "Upload File Stream",
    desc: "Drag and drop any PDF, DOCX, PPTX, XLSX, TXT, or HTML file. Size guards block objects >10MB.",
    icon: <Layers className="h-4.5 w-4.5 text-blue-500" />,
    color: "bg-blue-500/10"
  },
  {
    n: "02",
    title: "MarkItDown Parsing",
    desc: "Microsoft's extraction engine converts formatting nodes into clean Markdown and plain text.",
    icon: <Sparkles className="h-4.5 w-4.5 text-indigo-500" />,
    color: "bg-indigo-500/10"
  },
  {
    n: "03",
    title: "Token Analysis",
    desc: "Estimates token counts using tiktoken (cl100k_base) for GPT/Claude and customized weights for Gemini.",
    icon: <BookOpen className="h-4.5 w-4.5 text-purple-500" />,
    color: "bg-purple-500/10"
  },
  {
    n: "04",
    title: "Whitespace Optimization",
    desc: "Collapses double line feeds, strips redundant spaces, and drops empty layout noise losslessly.",
    icon: <ShieldCheck className="h-4.5 w-4.5 text-emerald-500" />,
    color: "bg-emerald-500/10"
  },
]

export default function About() {
  return (
    <div className="container max-w-4xl animate-fade-in py-16 px-4 md:py-24 relative">
      {/* Background blur orb */}
      <div className="absolute right-1/4 top-1/4 -z-10 h-[280px] w-[280px] rounded-full bg-primary/10 blur-[100px]" />

      <div className="space-y-4 text-center sm:text-left">
        <h1 className="text-4xl font-black tracking-tight text-gradient sm:text-5xl">
          About TokenSave
        </h1>
        <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-3xl">
          LLM providers charge per token consumed in the context window. Most document sheets contain massive layout and spacing noise that inflates your bills. TokenSave resolves this: converting any doc into clean, AI-ready text and providing side-by-side token estimates before prompting.
        </p>
      </div>

      {/* Grid Timeline steps */}
      <div className="mt-14 space-y-4">
        <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider text-center sm:text-left">
          Processing Workflow
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {steps.map((s) => (
            <Card key={s.n} className="glass-card bg-card/20 border-border/60 hover:bg-card/40 transition-colors">
              <CardContent className="p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-primary">{s.n}</span>
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${s.color}`}>
                    {s.icon}
                  </div>
                </div>
                <h3 className="text-base font-bold text-foreground tracking-tight">{s.title}</h3>
                <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Open source stack info */}
      <div className="mt-16 border-t border-border/40 pt-10 space-y-4">
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          Built on Open Source
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
          TokenSave relies on{" "}
          <a
            href="https://github.com/microsoft/markitdown"
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-primary underline underline-offset-4 hover:text-primary/90 transition-colors"
          >
            Microsoft MarkItDown
          </a>
          , a document extraction library designed for LLM workflows. The frontend compiles with React 18, TypeScript, Vite, Tailwind CSS, and Radix UI primitives. The backend is powered by FastAPI, Pydantic, and tiktoken running under Python 3.13.
        </p>
      </div>

      {/* Token estimates disclaimer */}
      <div className="mt-10 border-l-2 border-primary/20 bg-primary/5 rounded-r-lg p-5 space-y-2">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
          <BookOpen className="h-4 w-4 text-primary" /> Note on Token Estimation
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Token counts are computed directly using tiktoken for GPT/Claude and customized SentencePiece multipliers for Gemini. Estimates are intended for budget planning and developer workflow comparisons. For final billing values, reference each vendor's official live API tokenizer.
        </p>
      </div>

      {/* Button Triggers */}
      <div className="mt-12 flex flex-col gap-3 sm:flex-row justify-center sm:justify-start">
        <Button asChild size="lg" className="glow bg-primary hover:bg-primary/95 text-primary-foreground font-semibold px-6 shadow-md">
          <Link to="/converter" className="gap-1.5">
            Open the converter <ArrowRight className="h-4.5 w-4.5" />
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="glass-card hover:bg-muted font-medium px-6 border-border/80">
          <a
            href="https://github.com/microsoft/markitdown"
            target="_blank"
            rel="noreferrer"
            className="gap-2"
          >
            <Github className="h-4 w-4" /> View MarkItDown
          </a>
        </Button>
      </div>
    </div>
  )
}
