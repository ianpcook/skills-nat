import { Check } from "lucide-react";

const features = [
  {
    title: "Connect to services",
    description: "GitHub, Slack, Notion, databases, and more",
  },
  {
    title: "Automate workflows",
    description: "Schedule tasks, send notifications, manage projects",
  },
  {
    title: "Cross-agent compatible",
    description: "Skills work across multiple AI platforms",
  },
];

export function WhatAreSkills() {
  return (
    <section className="px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <h2 className="mb-6 font-serif text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
              What are <span className="text-muted-foreground">Skills</span>?
            </h2>
            <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
              Skills are modular capabilities that extend what your AI agent can
              do. Think of them as plugins that give your assistant new
              superpowers.
            </p>
            <div className="space-y-6">
              {features.map((feature) => (
                <div key={feature.title} className="flex gap-4">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center bg-[--teal] rounded">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="terminal">
            <div className="terminal-header">
              <span className="terminal-dot terminal-dot-red" />
              <span className="terminal-dot terminal-dot-yellow" />
              <span className="terminal-dot terminal-dot-green" />
            </div>
            <div className="terminal-content space-y-3">
              <p className="text-white/60">
                $ npx skills add ianpcook/weather-forecast
              </p>
              <p className="text-white/60">
                Installing weather-forecast v1.4.2...
              </p>
              <p className="text-[#27c93f]">Skill installed successfully!</p>
              <p className="mt-6 text-white/60">$ claude</p>
              <p className="text-white">
                {">"} What{"'"}s the weather in Pittsburgh?
              </p>
              <p className="mt-2 text-white/80">
                Currently 45°F and cloudy in Pittsburgh, PA. High of 52°F
                expected today with a 30% chance of rain this evening.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
