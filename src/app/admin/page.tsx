import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { hasValidSession } from "@/lib/auth";
import PageHeader from "@/components/ui/PageHeader";
import AdminClient from "./AdminClient";
import { serializeTrade } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  // Server-side check — runs before any data is fetched or sent to
  // the browser. If there's no valid session cookie, redirect to the
  // login page instead of rendering anything from this page.
  if (!hasValidSession()) {
    redirect("/admin/login");
  }

  const [trades, holdings] = await Promise.all([
    prisma.trade.findMany({ orderBy: { date: "desc" } }),
    prisma.holding.findMany({ orderBy: { ticker: "asc" } }),
  ]);

  return (
    <>
      <PageHeader
        title="Admin"
        description="Manage holdings and trades."
      />
      <AdminClient trades={trades.map(serializeTrade)} holdings={holdings} />
    </>
  );
}
