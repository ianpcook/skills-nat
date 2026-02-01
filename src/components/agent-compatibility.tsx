"use client"

const agents = [
  { name: "Claude Code", color: "bg-pop-pink" },
  { name: "Codex", color: "bg-pop-lime" },
  { name: "Cursor", color: "bg-pop-cyan" },
  { name: "OpenClaw", color: "bg-pop-orange" },
  { name: "Antigravity", color: "bg-pop-yellow" },
  { name: "Windsurf", color: "bg-pop-pink" },
  { name: "Aider", color: "bg-pop-lime" },
  { name: "Continue", color: "bg-pop-cyan" },
]

export function AgentCompatibility() {
  return (
    <section id="agents" className="py-8 border-y-4 border-foreground bg-foreground">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
          <span className="text-sm font-black text-pop-yellow uppercase tracking-widest">
            Works with
          </span>
          <div className="flex flex-wrap justify-center gap-0">
            {agents.map((agent) => (
              <div 
                key={agent.name} 
                className={`${agent.color} text-foreground text-sm font-black px-5 py-3 border-2 border-foreground hover:scale-105 transition-transform cursor-default uppercase`}
              >
                {agent.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
