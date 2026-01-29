import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SkillCard, toDisplaySkill } from "@/components/skill-card";
import { getFeaturedSkills } from "@/lib/api";

export async function FeaturedSkills() {
  const skills = await getFeaturedSkills();

  // Transform backend skills to frontend format
  const displaySkills = skills.map(toDisplaySkill);

  return (
    <section className="section-alt px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="section-title">Featured Skills</h2>
            <p className="section-subtitle">
              Hand-picked skills loved by the community
            </p>
          </div>
          <Link
            href="/skills"
            className="hidden items-center gap-1 text-sm font-medium text-foreground hover:text-[--teal] transition-colors md:flex"
          >
            View all skills
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {displaySkills.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {displaySkills.map((skill) => (
              <Link key={skill.id || skill.name} href={`/skills/${skill.slug}`}>
                <SkillCard skill={skill} featured />
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">
              No featured skills yet. Be the first to submit one!
            </p>
            <Link
              href="/submit"
              className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-foreground hover:text-[--teal] transition-colors"
            >
              Submit a skill
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}

        <Link
          href="/skills"
          className="mt-8 flex items-center justify-center gap-1 text-sm font-medium text-foreground hover:text-[--teal] transition-colors md:hidden"
        >
          View all skills
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
