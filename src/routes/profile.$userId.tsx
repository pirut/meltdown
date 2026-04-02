import { createFileRoute, Link } from "@tanstack/react-router";
import { usePaginatedQuery, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { MeltdownCard } from "@/components/MeltdownCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/profile/$userId")({
  component: ProfilePage,
});

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function ProfilePage() {
  const { userId } = Route.useParams();
  const user = useQuery(api.users.getUser, {
    userId: userId as Id<"users">,
  });

  const { results, status, loadMore } = usePaginatedQuery(
    api.meltdowns.listByUser,
    { userId: userId as Id<"users"> },
    { initialNumItems: 10 }
  );

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" asChild className="gap-1.5">
        <Link to="/">
          <ArrowLeft className="h-4 w-4" />
          Back to feed
        </Link>
      </Button>

      {/* User header */}
      {user === undefined ? (
        <div className="flex items-center gap-3">
          <Skeleton className="h-12 w-12 rounded-full" />
          <Skeleton className="h-5 w-32" />
        </div>
      ) : user === null ? (
        <p className="text-muted-foreground">User not found</p>
      ) : (
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={user.avatarUrl} alt={user.name} />
            <AvatarFallback className="bg-[#F5C842] font-medium text-[#2D3436]">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1
              className="text-lg font-bold"
              style={{ fontFamily: "Fredoka, sans-serif" }}
            >
              {user.name}
            </h1>
            <p className="text-sm text-muted-foreground">
              {results.length} meltdown{results.length !== 1 ? "s" : ""} shared
            </p>
          </div>
        </div>
      )}

      {/* User's meltdowns */}
      {status === "LoadingFirstPage" ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-border/50 bg-white p-5 shadow-sm"
            >
              <Skeleton className="h-4 w-full" />
              <Skeleton className="mt-2 h-4 w-3/4" />
            </div>
          ))}
        </div>
      ) : results.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-white/50 py-12 text-center">
          <p className="text-4xl">🤔</p>
          <p className="mt-2 text-sm text-muted-foreground">
            No meltdowns shared yet. Either very lucky or very forgetful.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {results.map((meltdown) => (
            <MeltdownCard
              key={meltdown._id}
              id={meltdown._id}
              authorName={meltdown.authorName}
              authorAvatarUrl={meltdown.authorAvatarUrl}
              childType={meltdown.childType}
              story={meltdown.story}
              category={meltdown.category}
              reactionCounts={meltdown.reactionCounts}
              totalScore={meltdown.totalScore}
              commentCount={meltdown.commentCount}
              creationTime={meltdown._creationTime}
            />
          ))}

          {status === "CanLoadMore" && (
            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={() => loadMore(10)}
                className="rounded-full"
              >
                Load More
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
