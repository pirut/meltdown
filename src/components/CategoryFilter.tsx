import { useRef, useEffect, useState, useCallback } from "react";
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

  // Drag-to-scroll state
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);
  const hasDragged = useRef(false);

  const updateFades = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setShowLeftFade(el.scrollLeft > 4);
    setShowRightFade(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

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
  }, [updateFades]);

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    const el = scrollRef.current;
    if (!el) return;
    isDragging.current = true;
    hasDragged.current = false;
    startX.current = e.pageX - el.offsetLeft;
    scrollLeftStart.current = el.scrollLeft;
    el.style.cursor = "grabbing";
    el.style.userSelect = "none";
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const el = scrollRef.current;
    if (!el) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = x - startX.current;
    if (Math.abs(walk) > 3) hasDragged.current = true;
    el.scrollLeft = scrollLeftStart.current - walk;
  };

  const handleMouseUp = () => {
    const el = scrollRef.current;
    if (el) {
      el.style.cursor = "grab";
      el.style.userSelect = "";
    }
    isDragging.current = false;
  };

  const handleMouseLeave = () => {
    if (isDragging.current) handleMouseUp();
  };

  // Prevent click from firing after a drag
  const handleClickCapture = (e: React.MouseEvent) => {
    if (hasDragged.current) {
      e.stopPropagation();
      e.preventDefault();
    }
  };

  return (
    <div className="relative">
      {/* Left fade */}
      <div
        className={`pointer-events-none absolute left-0 top-0 z-10 h-full w-8 bg-gradient-to-r from-[#F5F0EB] to-transparent transition-opacity duration-200 ${
          showLeftFade ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Scrollable + draggable row */}
      <div
        ref={scrollRef}
        onScroll={updateFades}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onClickCapture={handleClickCapture}
        className="flex cursor-grab gap-2 overflow-x-auto pb-1 scrollbar-none active:cursor-grabbing"
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
              ? "border-[#E8735A]/40 bg-[#E8735A]/10 text-[#E8735A]"
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
        className={`pointer-events-none absolute right-0 top-0 z-10 h-full w-8 bg-gradient-to-l from-[#F5F0EB] to-transparent transition-opacity duration-200 ${
          showRightFade ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}
