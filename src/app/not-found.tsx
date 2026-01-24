import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center py-12">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-[#ffbc20]/20 flex items-center justify-center">
          <span className="text-5xl font-bold text-[#ffbc20]">404</span>
        </div>
        <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
        <p className="text-[#bfbfbf] text-lg mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-[#ffbc20] to-[#ffd980] hover:from-[#ffd980] hover:to-[#ffecbf] rounded-lg font-medium text-[#1a160d] transition-all"
          >
            Go Home
          </Link>
          <Link
            href="/skills"
            className="w-full sm:w-auto px-6 py-2.5 bg-[#1d1e1f] border border-[#2a2520] hover:border-[#ffbc20]/50 rounded-lg font-medium transition-colors"
          >
            Browse Skills
          </Link>
        </div>
      </div>
    </div>
  );
}
