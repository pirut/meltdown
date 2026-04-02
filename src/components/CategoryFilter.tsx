import { useRef, useEffect, useState } from "react";
import { CATEGORIES, type CategoryKey } from "@/lib/categories";
import { CategoryBadge } from "./CategoryBadge";

interface CategoryFilterProps {
  selected: CategoryKey | null;
  onSelect: (category: CategoryKey | null) => void;
}

export function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showRightFade, setShowRightFade] = useState(false);
  const [showLeftFade, setShowLeftFade] = useState(false);

  const updateFades = () => {
    const el = scrollRef.current;
    if (!el) return;
    setShowLeftFade(el.scrollLeft > 4);
    setShowRightFade(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  };

  useEffect(() => {
    updateFades();

    // Nudge animation: briefly scroll right then back to hint at scrollability
    const el = scrollRef.current;
    if (!el || el.scrollWidth <= el.clientWidth) return;

    const timer = setTimeout(() => {
      el.scrollTo({ left: 48, behavior: "smooth" });
      setTimeout(() => {
        el.scrollTo({ left: 0, behavior: "smooth" });
      }, 400);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative">
      {/* Left fade */}
      <div
        className={`pointer-events-none absolute left-0 top-0 z-10 h-full w-8 bg-gradient-to-r from-[#FFF8F0] to-transparent transition-opacity duration-200 ${
          showLeftFade ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Scrollable row */}
      <div
        ref={scrollRef}
        onScroll={updateFades}
        className="flex gap-2 overflow-x-auto pb-1 scrollbar-none"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <button
          type="button"
          onClick={() => onSelect(null)}
          className={`shrink-0 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-all ${
            selected === null
              ? "border-[#FF6B6B]/40 bg-[#FF6B6B]/10 text-[#FF6B6B]"
              : "border-transparent bg-muted text-muted-foreground hover:border-border hover:bg-accent"
          }`}
        >
          All
        </button>
        {CATEGORIES.map((cat) => (
          <div key={cat.key} className="shrink-0">
            <CategoryBadge
              category={cat}
              active={selected === cat.key}
              onClick={() => onSelect(selected === cat.key ? null : cat.key)}
            />
          </div>
        ))}
      </div>

      {/* Right fade */}
      <div
        className={`pointer-events-none absolute right-0 top-0 z-10 h-full w-8 bg-gradient-to-l from-[#FFF8F0] to-transparent transition-opacity duration-200 ${
          showRightFade ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}
