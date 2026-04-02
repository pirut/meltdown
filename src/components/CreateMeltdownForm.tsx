import { useState } from "react";
import { useMutation } from "convex/react";
import { useNavigate } from "@tanstack/react-router";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CategoryBadge } from "./CategoryBadge";
import { CATEGORIES, type CategoryKey } from "@/lib/categories";
import { toast } from "sonner";

type ChildType = "toddler" | "baby" | "kid";

export function CreateMeltdownForm() {
  const [childType, setChildType] = useState<ChildType>("toddler");
  const [story, setStory] = useState("");
  const [category, setCategory] = useState<CategoryKey | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createMeltdown = useMutation(api.meltdowns.create);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!story.trim() || !category) return;

    setIsSubmitting(true);
    try {
      const id = await createMeltdown({
        childType,
        story: story.trim(),
        category,
      });
      toast.success("Meltdown posted! 😭", {
        description: "Your tale of toddler chaos is now live.",
      });
      navigate({ to: "/meltdown/$id", params: { id } });
    } catch (err) {
      toast.error("Failed to post meltdown", {
        description:
          err instanceof Error ? err.message : "Something went wrong",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* The template */}
      <div className="rounded-2xl border border-border/50 bg-white p-6 shadow-sm">
        <div className="text-lg leading-relaxed">
          <span className="text-muted-foreground">Today my </span>
          {/* Child type picker */}
          <span className="inline-flex gap-1 align-baseline">
            {(["toddler", "baby", "kid"] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setChildType(type)}
                className={`rounded-full px-2.5 py-0.5 text-base font-bold uppercase tracking-wide transition-all ${
                  childType === type
                    ? "bg-[#FF6B6B] text-white shadow-sm"
                    : "text-muted-foreground hover:bg-accent"
                }`}
                style={{ fontFamily: "Fredoka, sans-serif" }}
              >
                {type}
              </button>
            ))}
          </span>
          <span className="text-muted-foreground">
            {" "}
            had a meltdown because...
          </span>
        </div>

        <Textarea
          value={story}
          onChange={(e) => setStory(e.target.value)}
          placeholder="...I broke his banana in half and he wanted it 'unbroken.'"
          className="mt-4 min-h-[120px] resize-none rounded-xl border-border/50 bg-[#FFF8F0] text-[15px] leading-relaxed placeholder:text-muted-foreground/50"
          maxLength={1000}
        />

        <div className="mt-2 text-right text-xs text-muted-foreground">
          <span className={story.length > 900 ? "text-[#FF6B6B]" : ""}>
            {story.length}
          </span>
          {" / 1000"}
        </div>
      </div>

      {/* Category picker */}
      <div className="rounded-2xl border border-border/50 bg-white p-6 shadow-sm">
        <h3
          className="mb-3 text-sm font-semibold"
          style={{ fontFamily: "Fredoka, sans-serif" }}
        >
          What kind of meltdown? 🏷️
        </h3>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <CategoryBadge
              key={cat.key}
              category={cat}
              size="md"
              active={category === cat.key}
              onClick={() =>
                setCategory(category === cat.key ? null : cat.key)
              }
            />
          ))}
        </div>
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={!story.trim() || !category || isSubmitting}
        className="w-full rounded-full bg-[#FF6B6B] py-5 text-base font-semibold text-white hover:bg-[#ff5252] disabled:opacity-50"
        style={{ fontFamily: "Fredoka, sans-serif" }}
      >
        {isSubmitting ? "Posting..." : "Share the Meltdown 😭"}
      </Button>
    </form>
  );
}
