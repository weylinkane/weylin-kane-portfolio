import type { Holding, Trade } from "@prisma/client";

/**
 * Combine class names while filtering out falsy values.
 * Lets us write conditional Tailwind classes cleanly.
 *   cn("p-4", isActive && "bg-surface", !disabled && "hover:opacity-80")
 */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Format a number as USD currency.
 * 1234.5 -> "$1,234.50"
 *
 * NOTE: kept for the Admin page (which needs real dollar figures to manage
 * data), but intentionally NOT used on any public-facing page anymore.
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Format a number as a percentage with a leading sign.
 * 0.1234 -> "+12.34%"
 */
export function formatPercent(value: number): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${(value * 100).toFixed(2)}%`;
}

/**
 * Format a number as an unsigned percentage (no +/- prefix).
 * Used for allocation share, which is never negative.
 * 0.1234 -> "12.34%"
 */
export function formatUnsignedPercent(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

/**
 * Format a number as a signed currency value.
 * 1234.5 -> "+$1,234.50"
 * -1234.5 -> "-$1,234.50"
 *
 * NOTE: Admin-only, same reasoning as formatCurrency above.
 */
export function formatSignedCurrency(value: number): string {
  const sign = value >= 0 ? "+" : "-";
  const abs = Math.abs(value);
  return `${sign}${formatCurrency(abs)}`;
}

/**
 * Format a date for display.
 * new Date("2025-03-15") -> "Mar 15, 2025"
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// ---------- Portfolio aggregations ----------
// These take an array of holdings and return summary numbers
// for the dashboard. Dollar totals are still computed internally
// (some math needs them), but public pages only ever render the
// percentage fields.

export interface PortfolioStats {
  totalValue: number;
  totalCost: number;
  totalGain: number;
  totalGainPercent: number;
  holdingsCount: number;
  largestPosition: { ticker: string; percent: number } | null;
}

export function calculatePortfolioStats(holdings: Holding[]): PortfolioStats {
  if (holdings.length === 0) {
    return {
      totalValue: 0,
      totalCost: 0,
      totalGain: 0,
      totalGainPercent: 0,
      holdingsCount: 0,
      largestPosition: null,
    };
  }

  let totalValue = 0;
  let totalCost = 0;
  let largestTicker = "";
  let largestValue = -Infinity;

  for (const h of holdings) {
    const marketValue = h.shares * h.currentPrice;
    const costBasis = h.shares * h.avgCost;
    totalValue += marketValue;
    totalCost += costBasis;
    if (marketValue > largestValue) {
      largestValue = marketValue;
      largestTicker = h.ticker;
    }
  }

  const totalGain = totalValue - totalCost;
  const totalGainPercent = totalCost > 0 ? totalGain / totalCost : 0;
  const largestPosition =
    totalValue > 0
      ? { ticker: largestTicker, percent: largestValue / totalValue }
      : null;

  return {
    totalValue,
    totalCost,
    totalGain,
    totalGainPercent,
    holdingsCount: holdings.length,
    largestPosition,
  };
}

/**
 * Build allocation data for the pie chart.
 * Returns each holding's share of total portfolio value.
 * `value` is kept internally (drives slice size) but never rendered
 * as a dollar figure on public pages — only `percent` is displayed.
 */
export interface AllocationSlice {
  ticker: string;
  value: number;
  percent: number;
}

export function calculateAllocation(holdings: Holding[]): AllocationSlice[] {
  const total = holdings.reduce((sum, h) => sum + h.shares * h.currentPrice, 0);
  if (total === 0) return [];
  return holdings
    .map((h) => {
      const value = h.shares * h.currentPrice;
      return { ticker: h.ticker, value, percent: value / total };
    })
    .sort((a, b) => b.value - a.value);
}

/**
 * Per-holding computed metrics used in the holdings table.
 * marketValue is kept for internal math (e.g. deriving % of portfolio)
 * but the public Holdings table only ever displays gainPercent and
 * percentOfPortfolio — never marketValue or gain in dollars.
 */
export interface HoldingMetrics {
  marketValue: number;
  gain: number;
  gainPercent: number;
}

export function calculateHoldingMetrics(h: Holding): HoldingMetrics {
  const marketValue = h.shares * h.currentPrice;
  const cost = h.shares * h.avgCost;
  const gain = marketValue - cost;
  const gainPercent = cost > 0 ? gain / cost : 0;
  return { marketValue, gain, gainPercent };
}

// Serializable trade type — Prisma's Date objects can't be sent from
// server components to client components directly, so we convert to ISO strings.
export type SerializableTrade = Omit<Trade, "date" | "createdAt" | "updatedAt"> & {
  date: string;
  createdAt: string;
  updatedAt: string;
};

export function serializeTrade(t: Trade): SerializableTrade {
  return {
    ...t,
    date: t.date.toISOString(),
    createdAt: t.createdAt.toISOString(),
    updatedAt: t.updatedAt.toISOString(),
  };
}
