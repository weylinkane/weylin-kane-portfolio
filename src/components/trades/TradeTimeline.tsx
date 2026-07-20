import Badge from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import type { SerializableTrade } from "@/lib/utils";

interface TradeTimelineProps {
  trades: SerializableTrade[];
}

export default function TradeTimeline({ trades }: TradeTimelineProps) {
  return (
    <ol className="relative space-y-6 border-l border-border pl-6">
      {trades.map((t) => (
        <li key={t.id} className="relative">
          {/* Marker dot */}
          <span
            aria-hidden="true"
            className="absolute -left-[1.65rem] top-1.5 h-2.5 w-2.5 rounded-full border border-border-strong bg-background"
          />
          <div className="rounded-lg border border-border bg-surface p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Badge tone={t.type === "BUY" ? "gain" : "loss"}>
                  {t.type}
                </Badge>
                <p className="text-base font-medium text-primary">
                  {t.ticker}
                </p>
                {t.company && (
                  <p className="text-sm text-muted">{t.company}</p>
                )}
              </div>
              <p className="text-xs text-muted">{formatDate(t.date)}</p>
            </div>

            {t.notes && (
              <p className="mt-4 border-t border-border pt-4 text-sm leading-relaxed text-secondary">
                {t.notes}
              </p>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
