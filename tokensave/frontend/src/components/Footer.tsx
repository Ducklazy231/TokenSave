import { Link } from "react-router-dom"
import { Zap } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border/60">
      <div className="container flex flex-col items-center justify-between gap-4 py-8 md:flex-row">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Zap className="h-3.5 w-3.5" />
          </span>
          <span className="font-medium text-foreground">TokenSave</span>
          <span>&copy; {new Date().getFullYear()}</span>
        </div>
        <nav className="flex items-center gap-6 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground">
            Home
          </Link>
          <Link to="/converter" className="hover:text-foreground">
            Converter
          </Link>
          <Link to="/about" className="hover:text-foreground">
            About
          </Link>
          <a
            href="https://github.com/microsoft/markitdown"
            target="_blank"
            rel="noreferrer"
            className="hover:text-foreground"
          >
            MarkItDown
          </a>
        </nav>
      </div>
    </footer>
  )
}
