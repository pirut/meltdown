import { createFileRoute } from "@tanstack/react-router";
import { MeltdownFeed } from "@/components/MeltdownFeed";

export const Route = createFileRoute("/")({ component: HomePage });

function HomePage() {
  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="text-center">
        <h1
          className="text-3xl font-bold tracking-tight text-[#2D3436] sm:text-4xl"
          style={{ fontFamily: "Fredoka, sans-serif" }}
        >
          Today my{" "}
          <span className="text-[#FF6B6B]">toddler</span>{" "}
          had a meltdown because...
        </h1>
        <p className="mt-2 text-muted-foreground">
          The funniest parenting moments, shared with solidarity.
        </p>
      </div>

      <MeltdownFeed />
    </div>
  );
}
