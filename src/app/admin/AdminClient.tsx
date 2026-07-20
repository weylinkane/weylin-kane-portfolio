"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, RefreshCw, Lock, LogOut } from "lucide-react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import TradeForm from "@/components/trades/TradeForm";
import HoldingForm from "@/components/holdings/HoldingForm";
import {
  cn,
  formatCurrency,
  formatDate,
  formatPercent,
  formatSignedCurrency,
  calculateHoldingMetrics,
} from "@/lib/utils";
import type { Trade, Holding } from "@/types";
import type { SerializableTrade } from "@/lib/utils";

interface AdminClientProps {
  trades: SerializableTrade[];
  holdings: Holding[];
}

interface RefreshMessage {
  text: string;
  tone: "gain" | "loss";
}

function hydrateTrade(t: SerializableTrade): Trade {
  return {
    ...t,
    date: new Date(t.date),
    createdAt: new Date(t.createdAt),
    updatedAt: new Date(t.updatedAt),
  };
}

export default function AdminClient({ trades, holdings }: AdminClientProps) {
  const router = useRouter();

  const [tradeModalOpen, setTradeModalOpen] = useState(false);
  const [editingTrade, setEditingTrade] = useState<Trade | null>(null);

  const [holdingModalOpen, setHoldingModalOpen] = useState(false);
  const [editingHolding, setEditingHolding] = useState<Holding | null>(null);

  const [refreshing, setRefreshing] = useState(false);
  const [refreshMessage, setRefreshMessage] = useState<RefreshMessage | null>(
    null,
  );
  const [loggingOut, setLoggingOut] = useState(false);

  function openNewTrade() {
    setEditingTrade(null);
    setTradeModalOpen(true);
  }
  function openEditTrade(t: SerializableTrade) {
    setEditingTrade(hydrateTrade(t));
    setTradeModalOpen(true);
  }
  function openNewHolding() {
    setEditingHolding(null);
    setHoldingModalOpen(true);
  }
  function openEditHolding(h: Holding) {
    setEditingHolding(h);
    setHoldingModalOpen(true);
  }

  async function refreshPrices() {
    setRefreshing(true);
    setRefreshMessage(null);
    try {
      const res = await fetch("/api/holdings/refresh-prices", {
        method: "POST",
      });
      const data = await res.json();

      if (!res.ok) {
        setRefreshMessage({
          text: data.error || "Refresh failed",
          tone: "loss",
        });
      } else {
        const failedTickers = (data.failures as Array<{ ticker: string }>)
          ?.map((f) => f.ticker)
          .join(", ");
        const msg =
          data.failed > 0
            ? `Updated ${data.updated} holdings — ${data.failed} failed: ${failedTickers}`
            : `Updated ${data.updated} ${data.updated === 1 ? "holding" : "holdings"}.`;
        setRefreshMessage({
          text: msg,
          tone: data.failed > 0 ? "loss" : "gain",
        });
        router.refresh();
      }
    } catch (err) {
      setRefreshMessage({
        text: err instanceof Error ? err.message : "Network error",
        tone: "loss",
      });
    } finally {
      setRefreshing(false);
    }
  }

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch("/api/admin-logout", { method: "POST" });
      router.replace("/admin/login");
      router.refresh();
    } finally {
      setLoggingOut(false);
    }
  }

  async function deleteTrade(id: number) {
    if (!confirm("Delete this trade? This cannot be undone.")) return;
    const res = await fetch(`/api/trades/${id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
    else alert("Failed to delete trade");
  }

  async function deleteHolding(id: number) {
    if (!confirm("Delete this holding? This cannot be undone.")) return;
    const res = await fetch(`/api/holdings/${id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
    else alert("Failed to delete holding");
  }

  return (
    <div className="space-y-14">
      {/* Status note — page is now protected by a password gate.
          Dollar figures are still shown here since editing requires them. */}
      <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-surface px-4 py-3 text-sm text-secondary">
        <div className="flex items-center gap-2">
          <Lock className="h-4 w-4 text-muted" />
          <span>
            This page shows real dollar figures and requires the admin
            password to view.
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          disabled={loggingOut}
        >
          <LogOut className="h-3.5 w-3.5" />
          {loggingOut ? "Logging out..." : "Log out"}
        </Button>
      </div>

      {/* Holdings management */}
      <section>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-medium text-primary">Holdings</h2>
            <p className="mt-1 text-xs text-muted">
              Add, update prices, or remove positions.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={refreshPrices}
              disabled={refreshing || holdings.length === 0}
            >
              <RefreshCw
                className={cn("h-4 w-4", refreshing && "animate-spin")}
              />
              {refreshing ? "Refreshing..." : "Refresh prices"}
            </Button>
            <Button variant="primary" onClick={openNewHolding}>
              <Plus className="h-4 w-4" /> Add holding
            </Button>
          </div>
        </div>

        {refreshMessage && (
          <p
            className={cn(
              "mb-4 rounded-md border px-3 py-2 text-sm",
              refreshMessage.tone === "gain"
                ? "border-gain/30 bg-gain/10 text-gain"
                : "border-loss/30 bg-loss/10 text-loss",
            )}
          >
            {refreshMessage.text}
          </p>
        )}

        {holdings.length === 0 ? (
          <p className="rounded-md border border-dashed border-border bg-surface/40 px-6 py-10 text-center text-sm text-muted">
            No holdings yet.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface text-xs uppercase tracking-wider text-muted">
                  <th className="px-4 py-3 text-left font-medium">Ticker</th>
                  <th className="px-4 py-3 text-left font-medium">Company</th>
                  <th className="px-4 py-3 text-right font-medium">Shares</th>
                  <th className="px-4 py-3 text-right font-medium">Avg cost</th>
                  <th className="px-4 py-3 text-right font-medium">Price</th>
                  <th className="px-4 py-3 text-right font-medium">Value</th>
                  <th className="px-4 py-3 text-right font-medium">G/L %</th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {holdings.map((h) => {
                  const { marketValue, gainPercent } =
                    calculateHoldingMetrics(h);
                  const isGain = gainPercent >= 0;
                  return (
                    <tr key={h.id} className="hover:bg-surface/60">
                      <td className="px-4 py-3 font-medium text-primary">
                        {h.ticker}
                      </td>
                      <td className="px-4 py-3 text-secondary">{h.company}</td>
                      <td className="nums px-4 py-3 text-right text-secondary">
                        {h.shares.toLocaleString()}
                      </td>
                      <td className="nums px-4 py-3 text-right text-secondary">
                        {formatCurrency(h.avgCost)}
                      </td>
                      <td className="nums px-4 py-3 text-right text-secondary">
                        {formatCurrency(h.currentPrice)}
                      </td>
                      <td className="nums px-4 py-3 text-right text-primary">
                        {formatCurrency(marketValue)}
                      </td>
                      <td
                        className={cn(
                          "nums px-4 py-3 text-right",
                          isGain ? "text-gain" : "text-loss",
                        )}
                      >
                        {formatPercent(gainPercent)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => openEditHolding(h)}
                            aria-label={`Edit ${h.ticker}`}
                            className="inline-flex h-7 w-7 items-center justify-center rounded text-secondary hover:bg-surface-2 hover:text-primary"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteHolding(h.id)}
                            aria-label={`Delete ${h.ticker}`}
                            className="inline-flex h-7 w-7 items-center justify-center rounded text-secondary hover:bg-loss/10 hover:text-loss"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Trades management */}
      <section>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium text-primary">Trades</h2>
            <p className="mt-1 text-xs text-muted">
              The journal — every buy and sell.
            </p>
          </div>
          <Button variant="primary" onClick={openNewTrade}>
            <Plus className="h-4 w-4" /> Add trade
          </Button>
        </div>

        {trades.length === 0 ? (
          <p className="rounded-md border border-dashed border-border bg-surface/40 px-6 py-10 text-center text-sm text-muted">
            No trades yet.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface text-xs uppercase tracking-wider text-muted">
                  <th className="px-4 py-3 text-left font-medium">Date</th>
                  <th className="px-4 py-3 text-left font-medium">Type</th>
                  <th className="px-4 py-3 text-left font-medium">Ticker</th>
                  <th className="px-4 py-3 text-right font-medium">Shares</th>
                  <th className="px-4 py-3 text-right font-medium">Price</th>
                  <th className="px-4 py-3 text-right font-medium">Total</th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {trades.map((t) => (
                  <tr key={t.id} className="hover:bg-surface/60">
                    <td className="px-4 py-3 text-secondary">
                      {formatDate(t.date)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge tone={t.type === "BUY" ? "gain" : "loss"}>
                        {t.type}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 font-medium text-primary">
                      {t.ticker}
                    </td>
                    <td className="nums px-4 py-3 text-right text-secondary">
                      {t.shares.toLocaleString()}
                    </td>
                    <td className="nums px-4 py-3 text-right text-secondary">
                      {formatCurrency(t.price)}
                    </td>
                    <td className="nums px-4 py-3 text-right text-primary">
                      {formatCurrency(t.shares * t.price)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => openEditTrade(t)}
                          aria-label="Edit trade"
                          className="inline-flex h-7 w-7 items-center justify-center rounded text-secondary hover:bg-surface-2 hover:text-primary"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteTrade(t.id)}
                          aria-label="Delete trade"
                          className="inline-flex h-7 w-7 items-center justify-center rounded text-secondary hover:bg-loss/10 hover:text-loss"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Modals */}
      <Modal
        open={tradeModalOpen}
        onClose={() => setTradeModalOpen(false)}
        title={editingTrade ? "Edit trade" : "Add trade"}
      >
        <TradeForm
          trade={editingTrade}
          onDone={() => setTradeModalOpen(false)}
        />
      </Modal>

      <Modal
        open={holdingModalOpen}
        onClose={() => setHoldingModalOpen(false)}
        title={editingHolding ? "Edit holding" : "Add holding"}
      >
        <HoldingForm
          holding={editingHolding}
          onDone={() => setHoldingModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
