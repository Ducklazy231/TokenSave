import { useEffect, useRef } from "react"

interface TurnstileProps {
  onVerify: (token: string) => void
  onExpire?: () => void
  onError?: () => void
}

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement | string,
        options: {
          sitekey: string
          callback: (token: string) => void
          "expired-callback"?: () => void
          "error-callback"?: () => void
          theme?: "light" | "dark" | "auto"
        }
      ) => string
      remove: (widgetId: string) => void
    }
  }
}

export function Turnstile({ onVerify, onExpire, onError }: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string | null>(null)

  const sitekey =
    (import.meta.env.VITE_TURNSTILE_SITEKEY as string) || "1x00000000000000000000AA"

  useEffect(() => {
    let active = true

    const initTurnstile = () => {
      if (!active || !containerRef.current || !window.turnstile) return

      try {
        // Remove existing widget if any
        if (widgetIdRef.current) {
          window.turnstile.remove(widgetIdRef.current)
          widgetIdRef.current = null
        }

        const id = window.turnstile.render(containerRef.current, {
          sitekey,
          callback: onVerify,
          "expired-callback": onExpire,
          "error-callback": onError,
          theme: "auto",
        })
        widgetIdRef.current = id
      } catch (e) {
        console.error("Turnstile render error:", e)
      }
    }

    // Set a small interval to wait for the script to load if it hasn't yet
    const checkInterval = setInterval(() => {
      if (window.turnstile) {
        clearInterval(checkInterval)
        initTurnstile()
      }
    }, 100)

    // Run immediately if already loaded
    if (window.turnstile) {
      clearInterval(checkInterval)
      initTurnstile()
    }

    return () => {
      active = false
      clearInterval(checkInterval)
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current)
        } catch (e) {
          // ignore cleanup errors on fast transitions
        }
        widgetIdRef.current = null
      }
    }
  }, [sitekey, onVerify, onExpire, onError])

  return (
    <div className="flex items-center justify-center py-2">
      <div ref={containerRef} className="mx-auto" />
    </div>
  )
}
