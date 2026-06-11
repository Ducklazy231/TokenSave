import { Zap } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-card/10">
      <div className="container max-w-6xl py-12 px-4">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Col 1: Brand & Copyright */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <Zap className="h-3.5 w-3.5" />
              </span>
              <span className="font-semibold text-foreground text-sm">TokenSave</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-xs">
              Sleek, locally-run utility designed to convert raw files into clean, AI-ready text and markdown representation.
            </p>
            <span className="text-[11px] text-muted-foreground/60 mt-2">
              &copy; {new Date().getFullYear()} TokenSave. All rights reserved.
            </span>
          </div>

          {/* Col 2: About & Support */}
          <div className="flex flex-col gap-2">
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
              Supported Formats
            </h4>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {["PDF", "DOCX", "PPTX", "XLSX", "TXT", "HTML"].map((ext) => (
                <span
                  key={ext}
                  className="rounded bg-muted/60 border border-border/40 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground"
                >
                  {ext}
                </span>
              ))}
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed mt-2">
              Powered by Microsoft MarkItDown layout parsing and token count engines.
            </p>
          </div>

          {/* Col 3: Privacy & Policy */}
          <div className="flex flex-col gap-2">
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
              Privacy Notice
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed mt-1">
              Your privacy is fully protected. Files are processed temporarily in memory on the backend for layout extraction and token statistics calculation, and are never saved or permanently stored on disk.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
