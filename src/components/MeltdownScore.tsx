import { cn } from "@/lib/utils";

interface MeltdownScoreProps {
  totalScore: number;
}

export function MeltdownScore({ totalScore }: MeltdownScoreProps) {
  const color =
    totalScore >= 100
      ? "text-red-500"
      : totalScore >= 50
        ? "text-orange-500"
        : totalScore >= 10
          ? "text-amber-500"
          : "text-blue-400";

  return (
    <div
      className={cn("flex items-center gap-0.5 text-xs font-medium", color)}
      title={`Meltdown Score: ${totalScore}`}
    >
      <span>🌡️</span>
      <span className="tabular-nums">{totalScore}</span>
    </div>
  );
}
