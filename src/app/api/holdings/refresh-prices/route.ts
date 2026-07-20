import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { fetchQuotes } from "@/lib/prices";

// POST /api/holdings/refresh-prices
export async function POST() {
  const unauthorized = requireAuth();
  if (unauthorized) return unauthorized;

  try {
    const holdings = await prisma.holding.findMany();

    if (holdings.length === 0) {
      return NextResponse.json({
        updated: 0,
        failed: 0,
        failures: [],
      });
    }

    const tickers = holdings.map((h) => h.ticker);
    const quotes = await fetchQuotes(tickers);

    let updated = 0;
    const failures: Array<{ ticker: string; error: string }> = [];

    for (const quote of quotes) {
      if (quote.price !== null) {
        const holding = holdings.find((h) => h.ticker === quote.ticker);
        if (holding) {
          await prisma.holding.update({
            where: { id: holding.id },
            data: { currentPrice: quote.price },
          });
          updated++;
        }
      } else {
        failures.push({
          ticker: quote.ticker,
          error: quote.error ?? "Unknown error",
        });
      }
    }

    return NextResponse.json({
      updated,
      failed: failures.length,
      failures,
    });
  } catch (err) {
    console.error("POST /api/holdings/refresh-prices failed:", err);
    return NextResponse.json(
      { error: "Failed to refresh prices" },
      { status: 500 },
    );
  }
}
