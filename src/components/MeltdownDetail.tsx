import { useQuery, useMutation } from "convex/react";
import { useAuth } from "@clerk/tanstack-react-start";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MeltdownReactions } from "./MeltdownReactions";
import { MeltdownScore } from "./MeltdownScore";
import { CategoryBadge } from "./CategoryBadge";
import { CommentList } from "./CommentList";
import { getCategoryByKey } from "@/lib/categories";
import { Trash2 } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

interface MeltdownDetailProps {
  id: Id<"meltdowns">;
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

export function MeltdownDetail({ id }: MeltdownDetailProps) {
  const meltdown = useQuery(api.meltdowns.get, { id });
  const { isSignedIn } = useAuth();
  const currentUser = useQuery(
    api.users.current,
    isSignedIn ? {} : "skip"
  );
  const removeMeltdown = useMutation(api.meltdowns.remove);
  const navigate = useNavigate();

  if (meltdown === undefined) {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl border border-border/50 bg-white p-6 shadow-sm">
          <div className="animate-pulse space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-muted" />
              <div className="h-4 w-32 rounded bg-muted" />
            </div>
            <div className="h-5 w-full rounded bg-muted" />
            <div className="h-5 w-3/4 rounded bg-muted" />
            <div className="h-5 w-1/2 rounded bg-muted" />
          </div>
        </div>
      </div>
    );
  }

  if (meltdown === null) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-white/50 py-16 text-center">
        <p className="text-4xl">🤔</p>
        <p
          className="mt-3 text-lg font-semibold"
          style={{ fontFamily: "Fredoka, sans-serif" }}
        >
          Meltdown not found
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Maybe it calmed down and disappeared.
        </p>
      </div>
    );
  }

  const cat = getCategoryByKey(meltdown.category as any);
  const isOwn = currentUser?._id === meltdown.authorId;

  const handleDelete = async () => {
    try {
      await removeMeltdown({ id });
      toast.success("Meltdown deleted");
      navigate({ to: "/" });
    } catch (err) {
      toast.error("Failed to delete meltdown");
    }
  };

  return (
    <div className="animate-in space-y-4">
      <Card className="overflow-hidden rounded-2xl border-border/50 bg-white shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={meltdown.authorAvatarUrl}
                alt={meltdown.authorName}
              />
              <AvatarFallback className="bg-[#FFE66D] font-medium text-[#2D3436]">
                {getInitials(meltdown.authorName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{meltdown.authorName}</div>
              <div className="text-xs text-muted-foreground">
                {timeAgo(meltdown._creationTime)}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <MeltdownScore totalScore={meltdown.totalScore} />
            {isOwn && (
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={handleDelete}
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent>
          <p className="text-lg leading-relaxed">
            <span className="text-muted-foreground">Today my </span>
            <span
              className="font-bold uppercase tracking-wide text-[#FF6B6B]"
              style={{ fontFamily: "Fredoka, sans-serif" }}
            >
              {meltdown.childType}
            </span>
            <span className="text-muted-foreground">
              {" "}
              had a meltdown because{" "}
            </span>
            <span>{meltdown.story}</span>
          </p>

          {cat && (
            <div className="mt-3">
              <CategoryBadge category={cat} />
            </div>
          )}
        </CardContent>

        <CardFooter className="border-t border-border/30 pt-3">
          <MeltdownReactions
            meltdownId={meltdown._id}
            reactionCounts={meltdown.reactionCounts}
          />
        </CardFooter>
      </Card>

      <CommentList
        meltdownId={meltdown._id}
        commentCount={meltdown.commentCount}
      />
    </div>
  );
}
