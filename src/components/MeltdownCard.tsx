import { Link } from "@tanstack/react-router";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MeltdownReactions } from "./MeltdownReactions";
import { MeltdownScore } from "./MeltdownScore";
import { CategoryBadge } from "./CategoryBadge";
import { getCategoryByKey } from "@/lib/categories";
import type { Id } from "../../convex/_generated/dataModel";

interface MeltdownCardProps {
  id: Id<"meltdowns">;
  authorName: string;
  authorAvatarUrl?: string;
  childType: "toddler" | "baby" | "kid";
  story: string;
  category: string;
  reactionCounts: { been_there: number; laughing: number };
  totalScore: number;
  commentCount: number;
  creationTime: number;
  truncate?: boolean;
}

function timeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString();
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function MeltdownCard({
  id,
  authorName,
  authorAvatarUrl,
  childType,
  story,
  category,
  reactionCounts,
  totalScore,
  commentCount,
  creationTime,
  truncate = true,
}: MeltdownCardProps) {
  const cat = getCategoryByKey(category as any);

  return (
    <Card className="animate-fade-in-up overflow-hidden rounded-2xl border-border/50 bg-white shadow-sm transition-shadow hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0 pb-2">
        <div className="flex items-center gap-2.5">
          <Avatar className="h-8 w-8">
            <AvatarImage src={authorAvatarUrl} alt={authorName} />
            <AvatarFallback className="bg-[#FFE66D] text-xs font-medium text-[#2D3436]">
              {getInitials(authorName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-1.5 text-sm">
            <span className="font-medium">{authorName}</span>
            <span className="text-muted-foreground">·</span>
            <span className="text-muted-foreground">
              {timeAgo(creationTime)}
            </span>
          </div>
        </div>
        <MeltdownScore totalScore={totalScore} />
      </CardHeader>

      <CardContent className="pb-3">
        {/* The meltdown template */}
        <Link
          to="/meltdown/$id"
          params={{ id }}
          className="group block"
        >
          <p className="text-[15px] leading-relaxed">
            <span className="text-muted-foreground">Today my </span>
            <span
              className="font-bold uppercase tracking-wide text-[#FF6B6B]"
              style={{ fontFamily: "Fredoka, sans-serif" }}
            >
              {childType}
            </span>
            <span className="text-muted-foreground">
              {" "}
              had a meltdown because{" "}
            </span>
            <span
              className={
                truncate
                  ? "line-clamp-3 group-hover:text-foreground/80"
                  : "group-hover:text-foreground/80"
              }
            >
              {story}
            </span>
          </p>
        </Link>

        {/* Category badge */}
        {cat && (
          <div className="mt-2.5">
            <CategoryBadge category={cat} />
          </div>
        )}
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t border-border/30 pt-2.5">
        <MeltdownReactions
          meltdownId={id}
          reactionCounts={reactionCounts}
        />
        <Link
          to="/meltdown/$id"
          params={{ id }}
          className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <span>💬</span>
          <span className="tabular-nums">{commentCount}</span>
        </Link>
      </CardFooter>
    </Card>
  );
}
