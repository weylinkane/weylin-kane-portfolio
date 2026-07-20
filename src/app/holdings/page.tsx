import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/ui/PageHeader";
import EmptyState from "@/components/ui/EmptyState";
import HoldingsTable from "@/components/holdings/HoldingsTable";
import { TrendingUp } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HoldingsPage() {
  const holdings = await prisma.holding.findMany({
    orderBy: { ticker: "asc" },
  });

  return (
    <>
      <PageHeader
        title="Holdings"
        description="All current positions, with computed market value and unrealized gain."
      />

      {holdings.length === 0 ? (
        <EmptyState
          icon={<TrendingUp className="h-5 w-5" />}
          title="No holdings yet"
          description="Add positions via the Admin page to populate this table."
        />
      ) : (
        <HoldingsTable holdings={holdings} />
      )}
    </>
  );
}
