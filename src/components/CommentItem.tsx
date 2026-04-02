import { useMutation, useQuery } from "convex/react";
import { useConvexAuth } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface CommentItemProps {
  id: Id<"comments">;
  authorId: Id<"users">;
  authorName: string;
  authorAvatarUrl?: string;
  body: string;
  creationTime: number;
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

export function CommentItem({
  id,
  authorId,
  authorName,
  authorAvatarUrl,
  body,
  creationTime,
}: CommentItemProps) {
  const { isAuthenticated } = useConvexAuth();
  const currentUser = useQuery(
    api.users.current,
    isAuthenticated ? {} : "skip"
  );
  const removeComment = useMutation(api.comments.remove);

  const isOwn = currentUser?._id === authorId;

  const handleDelete = async () => {
    try {
      await removeComment({ id });
    } catch (err) {
      console.error("Failed to delete comment:", err);
    }
  };

  return (
    <div className="group flex gap-3 py-3">
      <Avatar className="h-7 w-7 shrink-0">
        <AvatarImage src={authorAvatarUrl} alt={authorName} />
        <AvatarFallback className="bg-[#4ECDC4]/20 text-[10px] font-medium">
          {getInitials(authorName)}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5 text-sm">
          <span className="font-medium">{authorName}</span>
          <span className="text-muted-foreground">·</span>
          <span className="text-xs text-muted-foreground">
            {timeAgo(creationTime)}
          </span>
          {isOwn && (
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={handleDelete}
              className="ml-auto opacity-0 transition-opacity group-hover:opacity-100"
            >
              <Trash2 className="h-3 w-3 text-muted-foreground" />
            </Button>
          )}
        </div>
        <p className="mt-0.5 text-sm leading-relaxed text-foreground/90">
          {body}
        </p>
      </div>
    </div>
  );
}
