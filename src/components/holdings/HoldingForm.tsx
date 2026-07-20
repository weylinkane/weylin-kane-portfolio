"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import type { Holding } from "@/types";

interface HoldingFormProps {
  holding?: Holding | null;
  onDone: () => void;
}

const inputClass =
  "w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-primary placeholder:text-muted focus:border-border-strong focus:outline-none focus:ring-1 focus:ring-border-strong";

const labelClass = "mb-1.5 block text-xs font-medium text-secondary";

export default function HoldingForm({ holding, onDone }: HoldingFormProps) {
  const router = useRouter();
  const editing = Boolean(holding);

  const [ticker, setTicker] = useState("");
  const [company, setCompany] = useState("");
  const [shares, setShares] = useState("");
  const [avgCost, setAvgCost] = useState("");
  const [currentPrice, setCurrentPrice] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (holding) {
      setTicker(holding.ticker);
      setCompany(holding.company);
      setShares(String(holding.shares));
      setAvgCost(String(holding.avgCost));
      setCurrentPrice(String(holding.currentPrice));
    } else {
      setTicker("");
      setCompany("");
      setShares("");
      setAvgCost("");
      setCurrentPrice("");
    }
  }, [holding]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const body = {
      ticker,
      company,
      shares: Number(shares),
      avgCost: Number(avgCost),
      currentPrice: Number(currentPrice),
    };

    try {
      const url = editing ? `/api/holdings/${holding!.id}` : "/api/holdings";
      const method = editing ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Request failed");
      }
      router.refresh();
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass} htmlFor="h-ticker">
            Ticker
          </label>
          <input
            id="h-ticker"
            type="text"
            required
            value={ticker}
            onChange={(e) => setTicker(e.target.value.toUpperCase())}
            placeholder="AAPL"
            className={inputClass}
            disabled={editing}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="h-company">
            Company
          </label>
          <input
            id="h-company"
            type="text"
            required
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Apple Inc."
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="h-shares">
          Shares
        </label>
        <input
          id="h-shares"
          type="number"
          step="any"
          min="0"
          required
          value={shares}
          onChange={(e) => setShares(e.target.value)}
          placeholder="0"
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass} htmlFor="h-cost">
            Average cost
          </label>
          <input
            id="h-cost"
            type="number"
            step="any"
            min="0"
            required
            value={avgCost}
            onChange={(e) => setAvgCost(e.target.value)}
            placeholder="0.00"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="h-price">
            Current price
          </label>
          <input
            id="h-price"
            type="number"
            step="any"
            min="0"
            required
            value={currentPrice}
            onChange={(e) => setCurrentPrice(e.target.value)}
            placeholder="0.00"
            className={inputClass}
          />
        </div>
      </div>

      {error && (
        <p className="rounded-md border border-loss/30 bg-loss/10 px-3 py-2 text-sm text-loss">
          {error}
        </p>
      )}

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="ghost" onClick={onDone}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={submitting}>
          {submitting ? "Saving..." : editing ? "Save changes" : "Add holding"}
        </Button>
      </div>
    </form>
  );
}
