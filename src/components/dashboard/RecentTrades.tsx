import Badge from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import type { SerializableTrade } from "@/lib/utils";

interface RecentTradesProps {
  trades: SerializableTrade[];
}

export default function RecentTrades({ trades }: RecentTradesProps) {
  if (trades.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted">No trades recorded yet.</p>
    );
  }

  return (
    <ul className="divide-y divide-border">
      {trades.map((t) => (
        <li
          key={t.id}
          className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
        >
          <div className="flex items-center gap-3">
            <Badge tone={t.type === "BUY" ? "gain" : "loss"}>{t.type}</Badge>
            <div>
              <p className="text-sm font-medium text-primary">{t.ticker}</p>
              {t.company && <p className="text-xs text-muted">{t.company}</p>}
            </div>
          </div>
          <p className="text-xs text-muted">{formatDate(t.date)}</p>
        </li>
      ))}
    </ul>
  );
}
