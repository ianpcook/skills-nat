import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SkillCard, type Skill } from "@/components/skill-card";

const recentSkills: Skill[] = [
  {
    name: "Notion Workspace",
    author: "notionhq",
    description: "Manage Notion pages and databases",
    stars: 412,
    agents: ["Claude Code", "Cursor", "Codex"],
    category: "Productivity",
    version: "v1.8.0",
  },
  {
    name: "AWS Cloud Manager",
    author: "cloudops",
    description: "Manage AWS cloud resources",
    stars: 256,
    agents: ["Claude Code", "Codex", "Antigravity"],
    category: "Developer Tools",
    version: "v1.2.0",
  },
  {
    name: "Gmail & Email",
    author: "mailcraft",
    description: "Send, read, and organize emails",
    stars: 678,
    agents: ["Claude Code", "Cursor", "Clawdbot"],
    category: "Communication",
    version: "v3.0.1",
  },
  {
    name: "Jira Project Manager",
    author: "agileflow",
    description: "Manage Jira issues and sprints",
    stars: 289,
    agents: ["Claude Code", "Cursor", "Codex"],
    category: "Developer Tools",
    version: "v2.0.0",
  },
];

export function RecentlyUpdated() {
  return (
    <section className="px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl">
              Recently Updated
            </h2>
            <p className="mt-2 text-foreground/70">
              The latest skill updates from the community
            </p>
          </div>
          <Link
            href="/skills"
            className="hidden items-center gap-1 text-sm font-medium text-foreground hover:underline md:flex"
          >
            View all skills
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {recentSkills.map((skill) => (
            <SkillCard key={skill.name} skill={skill} />
          ))}
        </div>
        <Link
          href="/skills"
          className="mt-8 flex items-center justify-center gap-1 text-sm font-medium text-foreground hover:underline md:hidden"
        >
          View all skills
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
