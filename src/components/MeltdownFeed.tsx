import { useState, useRef } from "react";
import { usePaginatedQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { MeltdownCard } from "./MeltdownCard";
import { CategoryFilter } from "./CategoryFilter";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import type { CategoryKey } from "@/lib/categories";

function FeedSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="rounded-2xl border border-border/50 bg-white p-5 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="mt-4 h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-3/4" />
          <Skeleton className="mt-2 h-4 w-1/2" />
          <div className="mt-4 flex gap-2">
            <Skeleton className="h-7 w-16 rounded-full" />
            <Skeleton className="h-7 w-16 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function MeltdownFeed() {
  const [sortBy, setSortBy] = useState<"recent" | "top">("recent");
  const [category, setCategory] = useState<CategoryKey | null>(null);
  const hasLoadedOnce = useRef(false);

  const { results, status, loadMore } = usePaginatedQuery(
    api.meltdowns.list,
    {
      sortBy,
      category: category ?? undefined,
    },
    { initialNumItems: 10 }
  );

  // Track if we've ever loaded so we can skip the skeleton on filter changes
  if (status !== "LoadingFirstPage") {
    hasLoadedOnce.current = true;
  }

  const isInitialLoad = status === "LoadingFirstPage" && !hasLoadedOnce.current;
  const isFilterLoading =
    status === "LoadingFirstPage" && hasLoadedOnce.current;

  return (
    <div className="space-y-4">
      {/* Sort toggle */}
      <div className="flex items-center gap-3">
        <div className="flex rounded-full bg-white p-0.5 shadow-sm">
          <button
            type="button"
            onClick={() => setSortBy("recent")}
            className={`rounded-full px-3 py-1 text-sm font-medium transition-all duration-200 ${
              sortBy === "recent"
                ? "bg-[#E8735A] text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            🔥 Freshest
          </button>
          <button
            type="button"
            onClick={() => setSortBy("top")}
            className={`rounded-full px-3 py-1 text-sm font-medium transition-all duration-200 ${
              sortBy === "top"
                ? "bg-[#E8735A] text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            🏆 Top
          </button>
        </div>
      </div>

      {/* Category filter */}
      <CategoryFilter selected={category} onSelect={setCategory} />

      {/* Feed */}
      {isInitialLoad ? (
        <FeedSkeleton />
      ) : (
        <div
          className={`transition-opacity duration-200 ${
            isFilterLoading ? "pointer-events-none opacity-50" : "opacity-100"
          }`}
        >
          {results.length === 0 && !isFilterLoading ? (
            <div className="rounded-2xl border border-dashed border-border bg-white/50 py-16 text-center">
              <p className="text-4xl">🤫</p>
              <p
                className="mt-3 text-lg font-semibold text-foreground"
                style={{ fontFamily: "Fredoka, sans-serif" }}
              >
                It's suspiciously quiet...
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                No meltdowns yet. Someone's toddler must be napping.
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
                <div className="flex justify-center pt-2">
                  <Button
                    variant="outline"
                    onClick={() => loadMore(10)}
                    className="rounded-full"
                  >
                    More Meltdowns Please 😭
                  </Button>
                </div>
              )}

              {status === "LoadingMore" && (
                <div className="flex justify-center pt-2">
                  <div className="text-sm text-muted-foreground">
                    Loading more chaos...
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
