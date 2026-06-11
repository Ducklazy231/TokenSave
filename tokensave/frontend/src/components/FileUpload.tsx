import { useCallback, useRef, useState } from "react"
import { FileText, Loader2, UploadCloud, ShieldAlert } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/lib/toast"
import { Turnstile } from "./Turnstile"

const ACCEPTED = ".pdf,.docx,.pptx,.xlsx,.txt,.html,.htm"
const MAX_SIZE_BYTES = 10 * 1024 * 1024 // 10MB

interface FileUploadProps {
  onFile: (file: File, turnstileToken: string) => void
  loading?: boolean
}

export function FileUpload({ onFile, loading }: FileUploadProps) {
  const [dragging, setDragging] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const validateAndHandleFile = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return

      // 1. Check turnstile bot protection token
      if (!turnstileToken) {
        toast({
          title: "Verification Required",
          description: "Please complete the security check before uploading.",
          type: "error",
        })
        return
      }
      
      const file = files[0]
      const ext = "." + file.name.split(".").pop()?.toLowerCase()
      
      // 2. Client-side extension validation
      const allowedExtensions = ACCEPTED.split(",")
      if (!allowedExtensions.includes(ext)) {
        toast({
          title: "Unsupported Format",
          description: `The file format '${ext}' is not supported. Please upload PDF, DOCX, PPTX, XLSX, TXT, or HTML.`,
          type: "error",
        })
        return
      }

      // 3. Client-side size guard (10MB)
      if (file.size > MAX_SIZE_BYTES) {
        toast({
          title: "Payload Too Large",
          description: `The uploaded file size exceeds the 10MB limit. Please upload a smaller document.`,
          type: "error",
        })
        return
      }

      // Valid file and bot check passed
      onFile(file, turnstileToken)
    },
    [onFile, turnstileToken, toast],
  )

  return (
    <div className="space-y-4">
      <div
        role="button"
        tabIndex={0}
        onClick={() => !loading && inputRef.current?.click()}
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === " ") && !loading)
            inputRef.current?.click()
        }}
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          if (!loading) validateAndHandleFile(e.dataTransfer.files)
        }}
        className={cn(
          "group flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-card/20 px-6 py-16 text-center transition-all duration-200 relative overflow-hidden",
          dragging && "border-primary/80 bg-primary/5 scale-[0.99] shadow-inner",
          loading && "pointer-events-none opacity-80",
          "hover:border-primary/50 hover:bg-card/40"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED}
          className="hidden"
          onChange={(e) => validateAndHandleFile(e.target.files)}
        />

        <div className={cn(
          "flex h-12 w-12 items-center justify-center rounded-xl bg-muted text-muted-foreground border border-border/50 transition-all duration-200 group-hover:scale-105 group-hover:border-primary/30 group-hover:text-primary",
          dragging && "scale-105 border-primary/50 text-primary bg-primary/10"
        )}>
          {loading ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            <UploadCloud className="h-6 w-6" />
          )}
        </div>

        <h3 className="mt-4 text-base font-semibold tracking-tight text-foreground">
          {loading ? "Optimizing document..." : "Drag & drop your document"}
        </h3>
        <p className="mt-1.5 text-xs text-muted-foreground max-w-sm">
          {loading
            ? "Converting bytes to markdown, parsing structures, and running token models"
            : "or click here to browse your files"}
        </p>

        {/* Supported Types Indicators */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-1.5">
          {["PDF", "DOCX", "PPTX", "XLSX", "TXT", "HTML"].map((t) => (
            <span
              key={t}
              className="flex items-center gap-1 rounded-md bg-muted/50 px-2 py-0.5 text-[10px] font-medium text-muted-foreground border border-border/30 transition-colors group-hover:bg-background"
            >
              <FileText className="h-2.5 w-2.5" />
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Bot Protection Widget (Clicking here shouldn't open file browse dialog) */}
      {!loading && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-border/50 bg-card/10 backdrop-blur-sm"
        >
          <span className="text-xs text-muted-foreground font-medium">
            Security check required before conversion
          </span>
          <Turnstile
            onVerify={(token) => {
              setTurnstileToken(token)
            }}
            onExpire={() => {
              setTurnstileToken(null)
              toast({
                title: "Verification Expired",
                description: "The security check expired. Please complete it again.",
                type: "info",
              })
            }}
            onError={() => {
              setTurnstileToken(null)
              toast({
                title: "Verification Error",
                description: "A security check error occurred. Please reload the page.",
                type: "error",
              })
            }}
          />
        </div>
      )}

      {/* Safety & privacy info statement */}
      <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground/80 py-2 border-t border-border/30">
        <ShieldAlert className="h-3.5 w-3.5 text-primary/80" />
        <span>Files are processed temporarily and are not permanently stored.</span>
      </div>
    </div>
  )
}
