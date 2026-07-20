"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Login failed");
      }
      router.replace("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-sm flex-col justify-center">
      <h1 className="mb-2 text-xl font-medium text-primary">Admin access</h1>
      <p className="mb-6 text-sm text-secondary">
        Enter the admin password to manage holdings and trades.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="password"
          autoFocus
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-primary placeholder:text-muted focus:border-border-strong focus:outline-none focus:ring-1 focus:ring-border-strong"
        />
        {error && (
          <p className="rounded-md border border-loss/30 bg-loss/10 px-3 py-2 text-sm text-loss">
            {error}
          </p>
        )}
        <Button
          type="submit"
          variant="primary"
          disabled={submitting}
          className="w-full"
        >
          {submitting ? "Checking..." : "Enter"}
        </Button>
      </form>
    </div>
  );
}
