import { cn } from "@/lib/utils";

type BadgeTone = "gain" | "loss" | "neutral";

interface BadgeProps {
  tone?: BadgeTone;
  children: React.ReactNode;
  className?: string;
}

const toneStyles: Record<BadgeTone, string> = {
  gain: "bg-gain/10 text-gain border-gain/20",
  loss: "bg-loss/10 text-loss border-loss/20",
  neutral: "bg-surface-2 text-secondary border-border",
};

export default function Badge({
  tone = "neutral",
  children,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded px-2 py-0.5 text-xs font-medium border",
        toneStyles[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
