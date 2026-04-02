import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { useConvexAuth } from "convex/react";
import { useAuth } from "@clerk/tanstack-react-start";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { REACTIONS } from "@/lib/reactions";
import { cn } from "@/lib/utils";
import { SignInButton } from "@clerk/tanstack-react-start";

interface MeltdownReactionsProps {
  meltdownId: Id<"meltdowns">;
  reactionCounts: { been_there: number; laughing: number };
}

export function MeltdownReactions({
  meltdownId,
  reactionCounts,
}: MeltdownReactionsProps) {
  const { isSignedIn } = useAuth();
  const { isAuthenticated } = useConvexAuth();
  const toggle = useMutation(api.reactions.toggle);
  const userReactions = useQuery(
    api.reactions.getUserReactions,
    isAuthenticated ? { meltdownId } : "skip"
  );
  const [animating, setAnimating] = useState<string | null>(null);

  const handleReaction = async (type: "been_there" | "laughing") => {
    if (!isAuthenticated) return;

    setAnimating(type);
    setTimeout(() => setAnimating(null), 400);

    try {
      await toggle({ meltdownId, type });
    } catch (err) {
      console.error("Failed to toggle reaction:", err);
    }
  };

  return (
    <div className="flex items-center gap-1.5">
      {REACTIONS.map((reaction) => {
        const isActive = userReactions?.includes(reaction.key) ?? false;
        const count = reactionCounts[reaction.key];
        const isAnimating = animating === reaction.key;

        if (!isSignedIn) {
          return (
            <SignInButton key={reaction.key} mode="modal">
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-full border border-transparent px-2.5 py-1 text-sm text-muted-foreground transition-all hover:border-border hover:bg-accent"
              >
                <span className="text-base">{reaction.emoji}</span>
                <span className="min-w-[1ch] tabular-nums">{count}</span>
              </button>
            </SignInButton>
          );
        }

        return (
          <button
            key={reaction.key}
            type="button"
            onClick={() => handleReaction(reaction.key)}
            className={cn(
              "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-sm transition-all",
              isActive
                ? cn(
                    reaction.activeBg,
                    reaction.activeColor,
                    "border-current/20 font-semibold"
                  )
                : "border-transparent text-muted-foreground hover:border-border hover:bg-accent"
            )}
          >
            <span
              className={cn(
                "inline-block text-base transition-transform",
                isAnimating && "animate-wobble"
              )}
            >
              {reaction.emoji}
            </span>
            <span className="min-w-[1ch] tabular-nums">{count}</span>
          </button>
        );
      })}
    </div>
  );
}
