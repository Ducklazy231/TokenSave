import React, { createContext, useContext, useState, useCallback, useEffect } from "react"
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react"

export interface Toast {
  id: string
  title: string
  description?: string
  type?: "success" | "error" | "info"
  duration?: number
}

interface ToastContextType {
  toasts: Toast[]
  toast: (options: Omit<Toast, "id">) => void
  dismiss: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toast = useCallback(({ title, description, type = "info", duration = 3000 }: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { id, title, description, type, duration }])
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
      <ToastContainer toasts={toasts} dismiss={dismiss} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

// Internal Toast Container Component
function ToastContainer({ toasts, dismiss }: { toasts: Toast[]; dismiss: (id: string) => void }) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex w-full max-w-sm flex-col gap-2 p-4 md:bottom-6 md:right-6">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onDismiss={dismiss} />
      ))}
    </div>
  )
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
  const { id, title, description, type, duration } = toast

  useEffect(() => {
    if (duration === Infinity) return
    const timer = setTimeout(() => {
      onDismiss(id)
    }, duration)
    return () => clearTimeout(timer)
  }, [id, duration, onDismiss])

  const icons = {
    success: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
    error: <AlertCircle className="h-5 w-5 text-destructive" />,
    info: <Info className="h-5 w-5 text-blue-500" />,
  }

  const borderColors = {
    success: "border-emerald-500/20 bg-emerald-50/10 dark:bg-emerald-950/10",
    error: "border-destructive/20 bg-destructive/5",
    info: "border-blue-500/20 bg-blue-50/10 dark:bg-blue-950/10",
  }

  return (
    <div
      className={`flex w-full animate-fade-in gap-3 rounded-lg border p-4 shadow-lg backdrop-blur-md transition-all duration-300 ${
        borderColors[type || "info"]
      } border-border bg-card/95 text-card-foreground`}
      role="alert"
    >
      <div className="flex-shrink-0 mt-0.5">{icons[type || "info"]}</div>
      <div className="flex-1">
        <h4 className="text-sm font-semibold leading-none">{title}</h4>
        {description && <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">{description}</p>}
      </div>
      <button
        onClick={() => onDismiss(id)}
        className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors self-start"
        aria-label="Dismiss notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
