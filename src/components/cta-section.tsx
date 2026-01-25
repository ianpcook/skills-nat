import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";

export function CTASection() {
  return (
    <section className="border-t border-foreground/10 bg-secondary/30 px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl text-center">
        <h2 className="mb-4 font-serif text-3xl font-bold text-foreground md:text-4xl">
          Ready to share your skill?
        </h2>
        <p className="mb-8 text-lg text-foreground/80">
          Join our growing community of developers building the future of AI
          tooling. Submit your skill and help others extend their AI agents.
        </p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            size="lg"
            className="w-full bg-foreground px-8 text-background hover:bg-foreground/90 sm:w-auto"
          >
            Submit Your Skill
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="w-full border-foreground bg-transparent text-foreground hover:bg-foreground hover:text-background sm:w-auto"
          >
            <Github className="mr-2 h-4 w-4" />
            Star on GitHub
          </Button>
        </div>
      </div>
    </section>
  );
}
