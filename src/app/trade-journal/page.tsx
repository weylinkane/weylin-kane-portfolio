import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/ui/PageHeader";
import EmptyState from "@/components/ui/EmptyState";
import TradeTimeline from "@/components/trades/TradeTimeline";
import { BookOpen } from "lucide-react";
import { serializeTrade } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function TradeJournalPage() {
  const trades = await prisma.trade.findMany({
    orderBy: { date: "desc" },
  });

  return (
    <>
      <PageHeader
        title="Trade Journal"
        description="A chronological record of every trade — with thesis, rationale, or context where applicable."
      />

      {trades.length === 0 ? (
        <EmptyState
          icon={<BookOpen className="h-5 w-5" />}
          title="No trades recorded"
          description="Add your first trade from the Admin page to start the journal."
        />
      ) : (
        <TradeTimeline trades={trades.map(serializeTrade)} />
      )}
    </>
  );
}
