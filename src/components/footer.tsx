import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Logo column */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-block">
              <div className="logo-box">
                <span>Skills N'at</span>
              </div>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground max-w-xs">
              The marketplace for AI agent skills. Built for developers, by developers.
            </p>
          </div>

          {/* Links column */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Links</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/docs"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/skills"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Browse Skills
                </Link>
              </li>
              <li>
                <Link
                  href="/submit"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Submit a Skill
                </Link>
              </li>
            </ul>
          </div>

          {/* Services column */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Services</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/docs"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="https://github.com/ianpcook/skills-nat"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  GitHub
                </Link>
              </li>
              <li>
                <span className="text-sm text-muted-foreground">
                  Privacy
                </span>
              </li>
            </ul>
          </div>

          {/* Connect column */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Connect</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="https://github.com/ianpcook/skills-nat"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  GitHub
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground text-center">
            &copy; {new Date().getFullYear()} Skills N'at. Built with care in Pittsburgh.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
