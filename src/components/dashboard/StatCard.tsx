import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  tone?: "gain" | "loss" | "neutral";
  sublabel?: string;
}

export default function StatCard({
  label,
  value,
  tone = "neutral",
  sublabel,
}: StatCardProps) {
  const toneClass =
    tone === "gain"
      ? "text-gain"
      : tone === "loss"
        ? "text-loss"
        : "text-primary";

  return (
    <div className="rounded-lg border border-border bg-surface px-6 py-5">
      <p className="text-xs uppercase tracking-wider text-muted">{label}</p>
      <p
        className={cn(
          "nums mt-3 text-2xl font-medium tracking-tight",
          toneClass,
        )}
      >
        {value}
      </p>
      {sublabel && (
        <p className={cn("nums mt-1 text-xs", toneClass)}>{sublabel}</p>
      )}
    </div>
  );
}
