import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="section-alt border-t border-border px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl text-center">
        <h2 className="mb-4 font-serif text-3xl font-bold text-foreground md:text-4xl">
          Ready to empower your agents?
        </h2>
        <p className="mb-8 text-lg text-muted-foreground max-w-2xl mx-auto">
          Join our growing community of developers building the future of AI
          tooling.
        </p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="w-full btn-accent sm:w-auto gap-2"
          >
            <Link href="/skills">
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="w-full btn-outline sm:w-auto"
          >
            <Link href="/submit">Submit Your Skill</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
