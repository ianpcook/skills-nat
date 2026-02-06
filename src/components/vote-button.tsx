"use client";

import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

const getVoterId = (): string => {
  const key = "skills-nat-voter-id";
  const existing = localStorage.getItem(key);
  if (existing) return existing;
  const id = crypto.randomUUID();
  localStorage.setItem(key, id);
  return id;
};

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

  useEffect(() => {
    const checkVoteStatus = async () => {
      try {
        const voterId = getVoterId();
        const res = await fetch(`/api/skills/${slug}/vote?voterId=${encodeURIComponent(voterId)}`);
        if (res.ok) {
          const data = await res.json();
          setVoted(data.voted);
          setStars(data.stars);
        }
      } catch {
        // Silently degrade — vote status check is non-critical
      } finally {
        setInitialized(true);
      }
    };
    checkVoteStatus();
  }, [slug]);

  const handleVote = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (loading) return;
    setLoading(true);

    try {
      const voterId = getVoterId();
      const res = await fetch(`/api/skills/${slug}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voterId }),
      });

      if (res.ok) {
        const data = await res.json();
        setVoted(data.voted);
        setStars(data.stars);
      }
    } catch {
      // Vote failed silently — user can retry
    } finally {
      setLoading(false);
    }
  };

  const iconSize = size === "sm" ? "h-4 w-4" : "h-5 w-5";
  const textSize = size === "sm" ? "text-sm" : "text-base";
  const padding = size === "sm" ? "px-2 py-1" : "px-3 py-1.5";

  return (
    <button
      onClick={handleVote}
      disabled={loading || !initialized}
      className={cn(
        "inline-flex items-center gap-1.5 border-2 border-foreground transition-all",
        padding,
        textSize,
        voted
          ? "bg-pop-yellow/20 text-foreground"
          : "bg-card text-muted-foreground hover:bg-pop-yellow/10 hover:text-foreground",
        loading && "opacity-50 cursor-wait",
        className
      )}
    >
      <Star
        className={cn(
          iconSize,
          "transition-all",
          voted && "fill-pop-yellow text-pop-yellow"
        )}
      />
      <span className="font-medium">{stars}</span>
    </button>
  );
}
