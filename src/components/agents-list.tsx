// Claude Code - Orange/coral circle with "C" cutout
function ClaudeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="9" fill="#D97757" />
      <path d="M12.5 10C12.5 11.38 11.38 12.5 10 12.5C8.62 12.5 7.5 11.38 7.5 10C7.5 8.62 8.62 7.5 10 7.5" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// Cursor - Black square with cursor arrow
function CursorIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect width="20" height="20" rx="4" fill="#0D0D0D" />
      <path d="M6 5L6 14L9 11L12 15L14 14L11 10L14 10L6 5Z" fill="white" />
    </svg>
  );
}

// Codex (OpenAI) - Green hexagon
function CodexIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 1L18 5.5V14.5L10 19L2 14.5V5.5L10 1Z" fill="#10A37F" />
      <path d="M10 6V14M7 8L10 6L13 8M7 12L10 14L13 12" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Clawdbot - Lobster with claws
function ClawdbotIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      {/* Body */}
      <ellipse cx="10" cy="12" rx="4" ry="5" fill="#DC2626" />
      {/* Left claw */}
      <path d="M3 6C3 6 1 4 2 3C3 2 5 3 5 3L6 5C6 5 4 5 3 6Z" fill="#DC2626" />
      <path d="M6 5L6 9" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" />
      {/* Right claw */}
      <path d="M17 6C17 6 19 4 18 3C17 2 15 3 15 3L14 5C14 5 16 5 17 6Z" fill="#DC2626" />
      <path d="M14 5L14 9" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" />
      {/* Eyes */}
      <circle cx="8.5" cy="10" r="1" fill="white" />
      <circle cx="11.5" cy="10" r="1" fill="white" />
      {/* Antennae */}
      <path d="M8 7L7 4" stroke="#DC2626" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 7L13 4" stroke="#DC2626" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// Antigravity - Upward arrow/rocket
function AntigravityIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="9" fill="#8B5CF6" />
      <path d="M10 4L10 14M10 4L6 8M10 4L14 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Gemini - Two-tone sparkle
function GeminiIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 2C10 2 10 10 10 10C10 10 2 10 2 10C2 10 10 10 10 10C10 10 10 18 10 18" stroke="#4285F4" strokeWidth="2" strokeLinecap="round" />
      <path d="M10 2C10 2 10 10 10 10C10 10 18 10 18 10C18 10 10 10 10 10C10 10 10 18 10 18" stroke="#EA4335" strokeWidth="2" strokeLinecap="round" />
      <circle cx="10" cy="10" r="2" fill="#FBBC05" />
    </svg>
  );
}

const agents = [
  { name: "Claude Code", icon: ClaudeIcon },
  { name: "Cursor", icon: CursorIcon },
  { name: "Codex", icon: CodexIcon },
  { name: "Clawdbot", icon: ClawdbotIcon },
  { name: "Antigravity", icon: AntigravityIcon },
  { name: "Gemini", icon: GeminiIcon },
];

export function AgentsList() {
  return (
    <section className="border-y border-foreground/10 px-6 py-8">
      <div className="container mx-auto">
        <p className="mb-6 text-center font-sans text-xs font-medium uppercase tracking-widest text-foreground/60">
          Skills for your favorite AI agents
        </p>
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
          {agents.map((agent) => {
            const Icon = agent.icon;
            return (
              <div key={agent.name} className="flex items-center gap-2">
                <Icon />
                <span className="font-sans text-sm font-medium text-foreground">
                  {agent.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
