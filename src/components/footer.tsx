import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-foreground/10 px-6 py-8">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="bg-foreground px-2 py-1">
          <span className="font-serif text-sm font-bold text-background">
            AI@Skills
          </span>
        </div>
        <nav className="flex items-center gap-6">
          {/* TODO: /about page doesn't exist yet */}
          <Link
            href="/about"
            className="text-sm text-foreground/60 hover:text-foreground hover:underline"
          >
            About
          </Link>
          {/* TODO: /docs page doesn't exist yet */}
          <Link
            href="/docs"
            className="text-sm text-foreground/60 hover:text-foreground hover:underline"
          >
            Documentation
          </Link>
          <Link
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-foreground/60 hover:text-foreground hover:underline"
          >
            GitHub
          </Link>
        </nav>
      </div>
    </footer>
  );
}

// Also export as default for compatibility
export default Footer;
