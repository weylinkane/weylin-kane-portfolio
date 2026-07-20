// Re-export Prisma's generated types so other files can import from
// "@/types" rather than reaching directly into @prisma/client.
export type { Trade, Holding } from "@prisma/client";

// Allowed trade type values — kept as a const tuple so TypeScript
// can narrow it where needed.
export const TRADE_TYPES = ["BUY", "SELL"] as const;
export type TradeType = (typeof TRADE_TYPES)[number];

// The shape the Admin form submits when creating or editing a trade.
export interface TradeFormData {
  date: string; // YYYY-MM-DD
  ticker: string;
  company?: string;
  type: TradeType;
  shares: number;
  price: number;
  notes?: string;
}

// The shape used for creating or editing holdings.
export interface HoldingFormData {
  ticker: string;
  company: string;
  shares: number;
  avgCost: number;
  currentPrice: number;
}
