import { createFileRoute } from "@tanstack/react-router";
import { MeltdownDetail } from "@/components/MeltdownDetail";
import type { Id } from "../../convex/_generated/dataModel";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/meltdown/$id")({
  component: MeltdownPage,
});

function MeltdownPage() {
  const { id } = Route.useParams();

  return (
    <div className="space-y-4">
      <Button variant="ghost" size="sm" asChild className="gap-1.5">
        <Link to="/">
          <ArrowLeft className="h-4 w-4" />
          Back to feed
        </Link>
      </Button>
      <MeltdownDetail id={id as Id<"meltdowns">} />
    </div>
  );
}
