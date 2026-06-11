import { useCallback, useRef, useState } from "react"
import { FileText, Loader2, UploadCloud, ShieldAlert, Trash2, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/lib/toast"
import { Button } from "@/components/ui/button"

const ACCEPTED = ".pdf,.docx,.pptx,.xlsx,.txt,.html,.htm"
const MAX_SIZE_BYTES = 10 * 1024 * 1024
const MAX_FILES = 5

interface FileUploadProps {
  onFiles: (files: File[], fastMode: boolean) => void
  loading?: boolean
}

export function FileUpload({ onFiles, loading }: FileUploadProps) {
  const [dragging, setDragging] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [fastMode, setFastMode] = useState(true)
  const inputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  function formatBytes(bytes: number): string {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
  }

  const addFiles = useCallback(
    (filesList: FileList | null) => {
      if (!filesList || filesList.length === 0) return

      const newFiles: File[] = []
      const allowedExtensions = ACCEPTED.split(",")

      for (let i = 0; i < filesList.length; i++) {
        const file = filesList[i]
        const ext = "." + file.name.split(".").pop()?.toLowerCase()

        if (!allowedExtensions.includes(ext)) {
          toast({
            title: "Unsupported Format",
            description: `'${file.name}' format is not supported. Please upload PDF, DOCX, PPTX, XLSX, TXT, or HTML.`,
            type: "error",
          })
          continue
        }

        if (file.size > MAX_SIZE_BYTES) {
          toast({
            title: "File Too Large",
            description: `'${file.name}' exceeds the 10MB size limit.`,
            type: "error",
          })
          continue
        }

        if (selectedFiles.some((f) => f.name === file.name && f.size === file.size)) {
          continue
        }

        newFiles.push(file)
      }

      if (newFiles.length === 0) return

      if (selectedFiles.length + newFiles.length > MAX_FILES) {
        toast({
          title: "Limit Exceeded",
          description: `You can upload a maximum of ${MAX_FILES} files per conversion.`,
          type: "error",
        })
        return
      }

      setSelectedFiles((prev) => [...prev, ...newFiles])
    },
    [selectedFiles, toast],
  )

  function removeFile(index: number) {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  function handleConvert() {
    if (selectedFiles.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select or drop at least one file to convert.",
        type: "error",
      })
      return
    }
    onFiles(selectedFiles, fastMode)
  }

  return (
    <div className="space-y-6">
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
          if (!loading) addFiles(e.dataTransfer.files)
        }}
        className={cn(
          "group flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-card/20 px-6 py-14 text-center transition-all duration-200 relative overflow-hidden",
          dragging && "border-primary/80 bg-primary/5 scale-[0.99] shadow-inner",
          loading && "pointer-events-none opacity-80",
          "hover:border-primary/50 hover:bg-card/40"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED}
          multiple
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
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
          {loading ? "Batch converting documents..." : "Select or drag & drop files"}
        </h3>
        <p className="mt-1.5 text-xs text-muted-foreground max-w-sm">
          {loading
            ? "Processing your documents"
            : "Drop up to 5 documents here, or click to browse files"}
        </p>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-1.5">
          {["PDF", "DOCX", "PPTX", "XLSX", "TXT", "HTML"].map((t) => (
            <span
              key={t}
              className="flex items-center gap-1 rounded-md bg-muted/50 px-2 py-0.5 text-[10px] font-medium text-muted-foreground border border-border/30"
            >
              <FileText className="h-2.5 w-2.5" />
              {t}
            </span>
          ))}
        </div>
      </div>

      {!loading && (
        <div className="flex items-center justify-start px-2 py-1">
          <label className="flex items-center gap-2 select-none cursor-pointer">
            <input
              type="checkbox"
              id="fastModeToggle"
              checked={fastMode}
              onChange={(e) => setFastMode(e.target.checked)}
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary focus:ring-offset-0 bg-transparent cursor-pointer"
            />
            <span className="text-xs font-semibold text-foreground/80">
              Fast Mode (limit Excel to 5,000 rows, skip styles/charts)
            </span>
          </label>
        </div>
      )}

      {selectedFiles.length > 0 && (
        <div className="rounded-xl border border-border/60 bg-card/10 overflow-hidden">
          <div className="border-b border-border/40 bg-muted/30 px-4 py-2.5 flex items-center justify-between">
            <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              Queue ({selectedFiles.length} of {MAX_FILES} files)
            </span>
            {!loading && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedFiles([])}
                className="h-7 text-xs text-muted-foreground hover:text-destructive px-2"
              >
                Clear all
              </Button>
            )}
          </div>
          <div className="divide-y divide-border/40">
            {selectedFiles.map((file, idx) => (
              <div key={`${file.name}-${idx}`} className="flex items-center justify-between px-4 py-3 text-sm">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <FileText className="h-4.5 w-4.5 text-muted-foreground flex-shrink-0" />
                  <div className="truncate">
                    <p className="font-medium text-foreground truncate text-xs">{file.name}</p>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {formatBytes(file.size)}
                    </span>
                  </div>
                </div>
                {!loading && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFile(idx)}
                    className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedFiles.length > 0 && !loading && (
        <div className="flex items-center justify-center p-4 rounded-xl border border-border/50 bg-card/10 backdrop-blur-sm">
          <Button
            size="lg"
            onClick={handleConvert}
            className="w-full sm:w-auto font-semibold px-8 h-12 shadow-md bg-primary text-primary-foreground hover:bg-primary/95 animate-fade-in"
          >
            Convert {selectedFiles.length} {selectedFiles.length === 1 ? "File" : "Files"}
          </Button>
        </div>
      )}

      <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground/80 py-2 border-t border-border/30">
        <ShieldAlert className="h-3.5 w-3.5 text-primary/80" />
        <span>Files are processed temporarily and are not permanently stored.</span>
      </div>
    </div>
  )
}
