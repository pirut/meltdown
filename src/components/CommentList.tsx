import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { CommentItem } from "./CommentItem";
import { CommentForm } from "./CommentForm";
import { Separator } from "@/components/ui/separator";

interface CommentListProps {
  meltdownId: Id<"meltdowns">;
  commentCount: number;
}

export function CommentList({ meltdownId, commentCount }: CommentListProps) {
  const comments = useQuery(api.comments.list, { meltdownId });

  return (
    <div className="rounded-2xl border border-border/50 bg-white shadow-sm">
      <div className="p-4 pb-2">
        <h3
          className="text-sm font-semibold"
          style={{ fontFamily: "Fredoka, sans-serif" }}
        >
          💬 Comments {commentCount > 0 && `(${commentCount})`}
        </h3>
      </div>

      <div className="px-4">
        <CommentForm meltdownId={meltdownId} />
      </div>

      {comments === undefined ? (
        <div className="p-4 text-center text-sm text-muted-foreground opacity-60">
          Loading comments...
        </div>
      ) : comments.length === 0 ? (
        <div className="p-6 text-center">
          <p className="text-sm text-muted-foreground">
            No one has commiserated yet. You're not alone! 💬
          </p>
        </div>
      ) : (
        <div className="animate-in px-4 pb-2">
          <Separator className="my-2" />
          {comments.map((comment) => (
            <CommentItem
              key={comment._id}
              id={comment._id}
              authorId={comment.authorId}
              authorName={comment.authorName}
              authorAvatarUrl={comment.authorAvatarUrl}
              body={comment.body}
              creationTime={comment._creationTime}
            />
          ))}
        </div>
      )}
    </div>
  );
}
