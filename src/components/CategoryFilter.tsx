import { CATEGORIES, type CategoryKey } from "@/lib/categories";
import { CategoryBadge } from "./CategoryBadge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface CategoryFilterProps {
  selected: CategoryKey | null;
  onSelect: (category: CategoryKey | null) => void;
}

export function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex gap-2 pb-2">
        <button
          type="button"
          onClick={() => onSelect(null)}
          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-all ${
            selected === null
              ? "border-[#FF6B6B]/40 bg-[#FF6B6B]/10 text-[#FF6B6B]"
              : "border-transparent bg-muted text-muted-foreground hover:border-border hover:bg-accent"
          }`}
        >
          All
        </button>
        {CATEGORIES.map((cat) => (
          <CategoryBadge
            key={cat.key}
            category={cat}
            active={selected === cat.key}
            onClick={() => onSelect(selected === cat.key ? null : cat.key)}
          />
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
