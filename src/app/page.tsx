import { prisma } from "@/lib/prisma";
import StatCard from "@/components/dashboard/StatCard";
import AllocationChart from "@/components/dashboard/AllocationChart";
import RecentTrades from "@/components/dashboard/RecentTrades";
import EmptyState from "@/components/ui/EmptyState";
import PageHeader from "@/components/ui/PageHeader";
import { TrendingUp, Inbox } from "lucide-react";
import {
  calculatePortfolioStats,
  calculateAllocation,
  formatPercent,
  formatUnsignedPercent,
  serializeTrade,
} from "@/lib/utils";

// Always re-render with fresh data — this is a personal-use app,
// so we don't need aggressive caching.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  // Fetch in parallel
  const [holdings, recentTrades, tradeCount] = await Promise.all([
    prisma.holding.findMany(),
    prisma.trade.findMany({ orderBy: { date: "desc" }, take: 5 }),
    prisma.trade.count(),
  ]);

  const stats = calculatePortfolioStats(holdings);
  const allocation = calculateAllocation(holdings);
  const isEmpty = holdings.length === 0 && recentTrades.length === 0;
  const gainTone = stats.totalGain >= 0 ? "gain" : "loss";

  return (
    <>
      <PageHeader
        title="Welcome"
        description="A snapshot of the portfolio at a glance — return, allocation, and recent activity. Figures are shown as percentages only."
      />

      {isEmpty ? (
        <EmptyState
          icon={<Inbox className="h-5 w-5" />}
          title="Nothing here yet"
          description="Head to the Admin page to add your first holding and trade. The dashboard will populate automatically."
        />
      ) : (
        <div className="space-y-10">
          {/* Stats row — percentages and counts only, no dollar figures */}
          <section
            aria-label="Key metrics"
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            <StatCard
              label="Total return"
              value={formatPercent(stats.totalGainPercent)}
              tone={gainTone}
            />
            <StatCard
              label="Holdings"
              value={String(stats.holdingsCount)}
            />
            <StatCard
              label="Largest position"
              value={stats.largestPosition?.ticker ?? "—"}
              sublabel={
                stats.largestPosition
                  ? `${formatUnsignedPercent(stats.largestPosition.percent)} of portfolio`
                  : undefined
              }
            />
            <StatCard label="Total trades" value={String(tradeCount)} />
          </section>

          {/* Allocation + recent trades */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
            <section
              aria-labelledby="alloc-h"
              className="rounded-lg border border-border bg-surface p-6 lg:col-span-3"
            >
              <div className="mb-6 flex items-center justify-between">
                <h2
                  id="alloc-h"
                  className="text-sm font-medium uppercase tracking-wider text-secondary"
                >
                  Allocation
                </h2>
              </div>
              {allocation.length > 0 ? (
                <AllocationChart data={allocation} />
              ) : (
                <p className="py-6 text-center text-sm text-muted">
                  Add holdings to see allocation.
                </p>
              )}
            </section>

            <section
              aria-labelledby="recent-h"
              className="rounded-lg border border-border bg-surface p-6 lg:col-span-2"
            >
              <div className="mb-6 flex items-center justify-between">
                <h2
                  id="recent-h"
                  className="text-sm font-medium uppercase tracking-wider text-secondary"
                >
                  Recent trades
                </h2>
                <TrendingUp className="h-4 w-4 text-muted" aria-hidden="true" />
              </div>
              <RecentTrades trades={recentTrades.map(serializeTrade)} />
            </section>
          </div>
        </div>
      )}
    </>
  );
}
