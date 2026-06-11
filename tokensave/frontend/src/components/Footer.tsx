import { Link } from "react-router-dom"
import { Zap } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border/60">
      <div className="container flex flex-col items-center justify-between gap-6 py-10 md:flex-row">
        <div className="flex flex-col gap-2 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-muted-foreground">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Zap className="h-3.5 w-3.5" />
            </span>
            <span className="font-semibold text-foreground">TokenSave</span>
            <span>&copy; {new Date().getFullYear()}</span>
          </div>
          <span className="text-[11px] text-muted-foreground/80">
            Files are processed temporarily and are not permanently stored.
          </span>
        </div>
        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">
            Dashboard
          </Link>
          <Link to="/about" className="hover:text-foreground transition-colors">
            About
          </Link>
          <a
            href="https://github.com/microsoft/markitdown"
            target="_blank"
            rel="noreferrer"
            className="hover:text-foreground transition-colors"
          >
            MarkItDown
          </a>
        </nav>
      </div>
    </footer>
  )
}
