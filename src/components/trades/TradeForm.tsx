"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import type { Trade, TradeType } from "@/types";

interface TradeFormProps {
  trade?: Trade | null; // when set, the form is in edit mode
  onDone: () => void; // called after successful submit or cancel
}

const inputClass =
  "w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-primary placeholder:text-muted focus:border-border-strong focus:outline-none focus:ring-1 focus:ring-border-strong";

const labelClass = "mb-1.5 block text-xs font-medium text-secondary";

export default function TradeForm({ trade, onDone }: TradeFormProps) {
  const router = useRouter();
  const editing = Boolean(trade);

  const [date, setDate] = useState("");
  const [ticker, setTicker] = useState("");
  const [company, setCompany] = useState("");
  const [type, setType] = useState<TradeType>("BUY");
  const [shares, setShares] = useState("");
  const [price, setPrice] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // When editing, pre-fill the form with the trade's existing values
  useEffect(() => {
    if (trade) {
      const d = new Date(trade.date);
      setDate(d.toISOString().slice(0, 10));
      setTicker(trade.ticker);
      setCompany(trade.company ?? "");
      setType(trade.type as TradeType);
      setShares(String(trade.shares));
      setPrice(String(trade.price));
      setNotes(trade.notes ?? "");
    } else {
      // Default new-trade date to today
      setDate(new Date().toISOString().slice(0, 10));
      setTicker("");
      setCompany("");
      setType("BUY");
      setShares("");
      setPrice("");
      setNotes("");
    }
  }, [trade]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const body = {
      date,
      ticker,
      company: company || undefined,
      type,
      shares: Number(shares),
      price: Number(price),
      notes: notes || undefined,
    };

    try {
      const url = editing ? `/api/trades/${trade!.id}` : "/api/trades";
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
          <label className={labelClass} htmlFor="trade-date">
            Date
          </label>
          <input
            id="trade-date"
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="trade-type">
            Type
          </label>
          <select
            id="trade-type"
            value={type}
            onChange={(e) => setType(e.target.value as TradeType)}
            className={inputClass}
          >
            <option value="BUY">Buy</option>
            <option value="SELL">Sell</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass} htmlFor="trade-ticker">
            Ticker
          </label>
          <input
            id="trade-ticker"
            type="text"
            required
            value={ticker}
            onChange={(e) => setTicker(e.target.value.toUpperCase())}
            placeholder="AAPL"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="trade-company">
            Company (optional)
          </label>
          <input
            id="trade-company"
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Apple Inc."
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass} htmlFor="trade-shares">
            Shares
          </label>
          <input
            id="trade-shares"
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
        <div>
          <label className={labelClass} htmlFor="trade-price">
            Price per share
          </label>
          <input
            id="trade-price"
            type="number"
            step="any"
            min="0"
            required
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0.00"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="trade-notes">
          Notes (optional)
        </label>
        <textarea
          id="trade-notes"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Thesis, catalyst, or anything worth remembering..."
          className={inputClass + " resize-none"}
        />
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
          {submitting ? "Saving..." : editing ? "Save changes" : "Add trade"}
        </Button>
      </div>
    </form>
  );
}
