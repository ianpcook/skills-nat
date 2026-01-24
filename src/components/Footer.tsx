import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-[#2a2520] bg-[#1a160d]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#ffbc20] to-[#ffd980] flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-[#1a160d]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <span className="text-xl font-bold">
                AI<span className="text-[#ffbc20]">@</span>Skills
              </span>
            </Link>
            <p className="text-[#bfbfbf] text-sm max-w-md">
              The open marketplace for AI agent skills. Extend your favorite AI agents
              with community-built capabilities.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/skills" className="text-[#bfbfbf] hover:text-[#f5f0e6] text-sm transition-colors">
                  Browse Skills
                </Link>
              </li>
              <li>
                <Link href="/submit" className="text-[#bfbfbf] hover:text-[#f5f0e6] text-sm transition-colors">
                  Submit a Skill
                </Link>
              </li>
              <li>
                <a href="#" className="text-[#bfbfbf] hover:text-[#f5f0e6] text-sm transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-[#bfbfbf] hover:text-[#f5f0e6] text-sm transition-colors">
                  API Reference
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Community</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://github.com/ai-at-skills"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#bfbfbf] hover:text-[#f5f0e6] text-sm transition-colors"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a href="#" className="text-[#bfbfbf] hover:text-[#f5f0e6] text-sm transition-colors">
                  Discord
                </a>
              </li>
              <li>
                <a href="#" className="text-[#bfbfbf] hover:text-[#f5f0e6] text-sm transition-colors">
                  Twitter
                </a>
              </li>
              <li>
                <a href="#" className="text-[#bfbfbf] hover:text-[#f5f0e6] text-sm transition-colors">
                  Blog
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[#2a2520] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[#807c73] text-sm">
            &copy; {new Date().getFullYear()} AI@Skills. Open source under MIT license.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-[#807c73] hover:text-[#bfbfbf] text-sm transition-colors">
              Privacy
            </a>
            <a href="#" className="text-[#807c73] hover:text-[#bfbfbf] text-sm transition-colors">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
