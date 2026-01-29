/**
 * Agent definitions for Skills N'at
 * Maps agent IDs to display names and colors
 */

export interface Agent {
  id: string;
  name: string;
  color: string;
}

export const AGENTS: Agent[] = [
  { id: "claude-code", name: "Claude Code", color: "#0D0D0D" },
  { id: "cursor", name: "Cursor", color: "#D4940F" },
  { id: "codex", name: "Codex", color: "#0D0D0D" },
  { id: "clawdbot", name: "Clawdbot", color: "#D4940F" },
  { id: "antigravity", name: "Antigravity", color: "#0D0D0D" },
  { id: "gemini", name: "Gemini", color: "#D4940F" },
] as const;

/**
 * Get display name for an agent ID
 * Falls back to the ID if not found
 */
export function getAgentName(id: string): string {
  const agent = AGENTS.find(a => a.id === id);
  return agent?.name || id;
}

/**
 * Get color for an agent ID
 * Falls back to black if not found
 */
export function getAgentColor(id: string): string {
  const agent = AGENTS.find(a => a.id === id);
  return agent?.color || "#0D0D0D";
}

/**
 * Categories for skills
 */
export const CATEGORIES = [
  "Developer Tools",
  "Productivity",
  "Communication",
  "Utilities",
  "Data & Analytics",
  "AI & Machine Learning",
  "Social Media",
  "Entertainment",
  "Other",
] as const;

export type Category = typeof CATEGORIES[number];
