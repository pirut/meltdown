import { cn } from "@/lib/utils";
import type { Category } from "@/lib/categories";

interface CategoryBadgeProps {
  category: Category;
  active?: boolean;
  onClick?: () => void;
  size?: "sm" | "md";
}

export function CategoryBadge({
  category,
  active = false,
  onClick,
  size = "sm",
}: CategoryBadgeProps) {
  const isClickable = !!onClick;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!isClickable}
      className={cn(
        "inline-flex items-center gap-1 rounded-full border font-medium transition-all",
        size === "sm" ? "px-2.5 py-0.5 text-xs" : "px-3 py-1.5 text-sm",
        active
          ? cn(category.bgColor, category.borderColor, category.color)
          : cn(
              "border-transparent bg-muted text-muted-foreground",
              isClickable && "hover:border-border hover:bg-accent"
            ),
        !isClickable && "cursor-default"
      )}
    >
      <span>{category.emoji}</span>
      <span>{category.label}</span>
    </button>
  );
}
