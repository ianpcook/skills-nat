import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-foreground/10 px-6 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 md:flex-row">
        <div className="logo-box">
          <span>AI@Skills</span>
        </div>
        <nav className="flex items-center gap-6">
          <Link
            href="/skills"
            className="text-sm text-foreground/60 transition-colors hover:text-foreground hover:underline"
          >
            Browse Skills
          </Link>
          <Link
            href="/submit"
            className="text-sm text-foreground/60 transition-colors hover:text-foreground hover:underline"
          >
            Submit
          </Link>
          <Link
            href="https://github.com/ai-at-skills"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-foreground/60 transition-colors hover:text-foreground hover:underline"
          >
            GitHub
          </Link>
        </nav>
        <p className="text-xs text-foreground/40">
          © {new Date().getFullYear()} AI@Skills. Open source.
        </p>
      </div>
    </footer>
  );
}

// Also export as default for compatibility
export default Footer;
