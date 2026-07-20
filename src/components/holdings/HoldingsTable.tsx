"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  cn,
  calculateHoldingMetrics,
  formatPercent,
  formatUnsignedPercent,
} from "@/lib/utils";
import type { Holding } from "@/types";

interface HoldingsTableProps {
  holdings: Holding[];
}

type SortKey = "ticker" | "company" | "percentOfPortfolio" | "gainPercent";
type SortDir = "asc" | "desc";

interface HoldingRow extends Holding {
  percentOfPortfolio: number;
  gainPercent: number;
}

const columns: { key: SortKey; label: string; align: "left" | "right" }[] = [
  { key: "ticker", label: "Ticker", align: "left" },
  { key: "company", label: "Company", align: "left" },
  { key: "percentOfPortfolio", label: "% of portfolio", align: "right" },
  { key: "gainPercent", label: "Gain / loss %", align: "right" },
];

export default function HoldingsTable({ holdings }: HoldingsTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("percentOfPortfolio");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const rows: HoldingRow[] = useMemo(() => {
    const totalValue = holdings.reduce(
      (sum, h) => sum + h.shares * h.currentPrice,
      0,
    );

    const enriched = holdings.map((h) => {
      const { marketValue, gainPercent } = calculateHoldingMetrics(h);
      const percentOfPortfolio = totalValue > 0 ? marketValue / totalValue : 0;
      return { ...h, percentOfPortfolio, gainPercent };
    });

    enriched.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      let cmp: number;
      if (typeof av === "string" && typeof bv === "string") {
        cmp = av.localeCompare(bv);
      } else {
        cmp = (av as number) - (bv as number);
      }
      return sortDir === "asc" ? cmp : -cmp;
    });

    return enriched;
  }, [holdings, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "ticker" || key === "company" ? "asc" : "desc");
    }
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-surface text-xs uppercase tracking-wider text-muted">
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className={cn(
                  "px-4 py-3 font-medium",
                  col.align === "right" ? "text-right" : "text-left",
                )}
              >
                <button
                  type="button"
                  onClick={() => toggleSort(col.key)}
                  className={cn(
                    "inline-flex items-center gap-1 transition-colors hover:text-primary",
                    col.align === "right" && "flex-row-reverse",
                  )}
                >
                  {col.label}
                  {sortKey === col.key &&
                    (sortDir === "asc" ? (
                      <ChevronUp className="h-3 w-3" />
                    ) : (
                      <ChevronDown className="h-3 w-3" />
                    ))}
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((r) => {
            const isGain = r.gainPercent >= 0;
            return (
              <tr key={r.id} className="hover:bg-surface/60">
                <td className="px-4 py-3 font-medium text-primary">{r.ticker}</td>
                <td className="px-4 py-3 text-secondary">{r.company}</td>
                <td className="nums px-4 py-3 text-right text-primary">
                  {formatUnsignedPercent(r.percentOfPortfolio)}
                </td>
                <td
                  className={cn(
                    "nums px-4 py-3 text-right",
                    isGain ? "text-gain" : "text-loss",
                  )}
                >
                  {formatPercent(r.gainPercent)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
