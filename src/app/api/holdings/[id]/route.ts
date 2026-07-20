import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface RouteContext {
  params: { id: string };
}

// PATCH /api/holdings/[id] — update one or more fields
export async function PATCH(request: Request, { params }: RouteContext) {
  const id = Number(params.id);
  if (!Number.isFinite(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  try {
    const body = await request.json();
    const data: Record<string, unknown> = {};

    if (body.ticker !== undefined)
      data.ticker = String(body.ticker).toUpperCase().trim();
    if (body.company !== undefined) data.company = String(body.company).trim();

    if (body.shares !== undefined) {
      const shares = Number(body.shares);
      if (!Number.isFinite(shares) || shares <= 0) {
        return NextResponse.json(
          { error: "shares must be a positive number" },
          { status: 400 },
        );
      }
      data.shares = shares;
    }
    if (body.avgCost !== undefined) {
      const avgCost = Number(body.avgCost);
      if (!Number.isFinite(avgCost) || avgCost <= 0) {
        return NextResponse.json(
          { error: "avgCost must be a positive number" },
          { status: 400 },
        );
      }
      data.avgCost = avgCost;
    }
    if (body.currentPrice !== undefined) {
      const currentPrice = Number(body.currentPrice);
      if (!Number.isFinite(currentPrice) || currentPrice <= 0) {
        return NextResponse.json(
          { error: "currentPrice must be a positive number" },
          { status: 400 },
        );
      }
      data.currentPrice = currentPrice;
    }

    const updated = await prisma.holding.update({ where: { id }, data });
    return NextResponse.json(updated);
  } catch (error) {
    console.error(`PATCH /api/holdings/${id} failed:`, error);
    return NextResponse.json(
      { error: "Failed to update holding" },
      { status: 500 },
    );
  }
}

// DELETE /api/holdings/[id]
export async function DELETE(_request: Request, { params }: RouteContext) {
  const id = Number(params.id);
  if (!Number.isFinite(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  try {
    await prisma.holding.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(`DELETE /api/holdings/${id} failed:`, error);
    return NextResponse.json(
      { error: "Failed to delete holding" },
      { status: 500 },
    );
  }
}
