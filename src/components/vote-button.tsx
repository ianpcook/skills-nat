"use client";

import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface VoteButtonProps {
  slug: string;
  initialStars?: number;
  size?: "sm" | "md";
  className?: string;
}

export function VoteButton({ slug, initialStars = 0, size = "md", className }: VoteButtonProps) {
  const [stars, setStars] = useState(initialStars);
  const [voted, setVoted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Check initial vote status
  useEffect(() => {
    async function checkVoteStatus() {
      try {
        const res = await fetch(`/api/skills/${slug}/vote`);
        if (res.ok) {
          const data = await res.json();
          setVoted(data.voted);
          setStars(data.stars);
        }
      } catch (error) {
        console.error("Failed to check vote status:", error);
      } finally {
        setInitialized(true);
      }
    }
    checkVoteStatus();
  }, [slug]);

  async function handleVote(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    
    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/skills/${slug}/vote`, {
        method: "POST",
      });

      if (res.status === 401) {
        // Not logged in - could show a login prompt
        alert("Please sign in to vote");
        return;
      }

      if (res.ok) {
        const data = await res.json();
        setVoted(data.voted);
        setStars(data.stars);
      }
    } catch (error) {
      console.error("Vote failed:", error);
    } finally {
      setLoading(false);
    }
  }

  const iconSize = size === "sm" ? "h-4 w-4" : "h-5 w-5";
  const textSize = size === "sm" ? "text-sm" : "text-base";
  const padding = size === "sm" ? "px-2 py-1" : "px-3 py-1.5";

  return (
    <button
      onClick={handleVote}
      disabled={loading || !initialized}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border transition-all",
        padding,
        textSize,
        voted
          ? "border-amber-500/50 bg-amber-500/10 text-amber-500"
          : "border-foreground/20 bg-background/50 text-foreground/70 hover:border-amber-500/30 hover:text-amber-500",
        loading && "opacity-50 cursor-wait",
        className
      )}
    >
      <Star
        className={cn(
          iconSize,
          "transition-all",
          voted && "fill-amber-500"
        )}
      />
      <span className="font-medium">{stars}</span>
    </button>
  );
}
