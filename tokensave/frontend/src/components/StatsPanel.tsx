import { Hash, AlignLeft, Sparkles, MessageSquare, Brain } from "lucide-react"
import { type UploadResult } from "@/lib/api"
import { formatNumber } from "@/lib/utils"

interface StatsPanelProps {
  result: UploadResult
}

export function StatsPanel({ result }: StatsPanelProps) {
  const stats = [
    {
      label: "Characters",
      value: result.character_count,
      icon: <Hash className="h-4 w-4 text-slate-400 dark:text-slate-500" />,
      desc: "Total character count of raw text",
    },
    {
      label: "Words",
      value: result.word_count,
      icon: <AlignLeft className="h-4 w-4 text-slate-400 dark:text-slate-500" />,
      desc: "Total word count of raw text",
    },
    {
      label: "Lines",
      value: result.line_count,
      icon: <AlignLeft className="h-4 w-4 rotate-90 text-slate-400 dark:text-slate-500" />,
      desc: "Total lines in output text",
    },
    {
      label: "GPT Tokens",
      value: result.estimated_tokens_gpt,
      icon: <Sparkles className="h-4 w-4 text-indigo-400 dark:text-indigo-500" />,
      desc: "Estimated count using GPT tokenizer (cl100k_base)",
      badge: "OpenAI",
    },
    {
      label: "Claude Tokens",
      value: result.estimated_tokens_claude,
      icon: <MessageSquare className="h-4 w-4 text-violet-400 dark:text-violet-500" />,
      desc: "Estimated count using Anthropic tokenizer",
      badge: "Anthropic",
    },
    {
      label: "Gemini Tokens",
      value: result.estimated_tokens_gemini,
      icon: <Brain className="h-4 w-4 text-purple-400 dark:text-purple-500" />,
      desc: "Estimated count using Google SentencePiece tokenizer",
      badge: "Google",
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      {stats.map((s) => (
        <div
          key={s.label}
          className="group relative flex flex-col justify-between rounded-xl border border-border bg-card/40 p-4 transition-all duration-200 hover:border-primary/20 hover:bg-card/70 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {s.label}
            </span>
            {s.icon}
          </div>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-2xl font-bold tracking-tight">
              {formatNumber(s.value)}
            </span>
          </div>
          <p className="mt-1.5 text-[10px] text-muted-foreground/85 leading-normal">
            {s.desc}
          </p>
          {s.badge && (
            <span className="absolute bottom-3 right-3 rounded bg-muted px-1.5 py-0.5 text-[9px] font-medium text-muted-foreground opacity-50 group-hover:opacity-100 transition-opacity">
              {s.badge}
            </span>
          )}
        </div>
      ))}
    </div>
  )
}
