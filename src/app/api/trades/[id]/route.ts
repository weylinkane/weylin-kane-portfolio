import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { TRADE_TYPES } from "@/types";

interface RouteContext {
  params: { id: string };
}

// GET /api/trades/[id]
export async function GET(_request: Request, { params }: RouteContext) {
  const id = Number(params.id);
  if (!Number.isFinite(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  try {
    const trade = await prisma.trade.findUnique({ where: { id } });
    if (!trade) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(trade);
  } catch (error) {
    console.error(`GET /api/trades/${id} failed:`, error);
    return NextResponse.json(
      { error: "Failed to load trade" },
      { status: 500 },
    );
  }
}

// PATCH /api/trades/[id] — update one or more fields
export async function PATCH(request: Request, { params }: RouteContext) {
  const id = Number(params.id);
  if (!Number.isFinite(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  try {
    const body = await request.json();

    // Build a partial update object — only include fields that were provided
    const data: Record<string, unknown> = {};

    if (body.date !== undefined) data.date = new Date(body.date);
    if (body.ticker !== undefined) data.ticker = String(body.ticker).toUpperCase().trim();
    if (body.company !== undefined)
      data.company = body.company ? String(body.company).trim() : null;
    if (body.notes !== undefined)
      data.notes = body.notes ? String(body.notes).trim() : null;

    if (body.type !== undefined) {
      if (!TRADE_TYPES.includes(body.type)) {
        return NextResponse.json(
          { error: "type must be BUY or SELL" },
          { status: 400 },
        );
      }
      data.type = body.type;
    }

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

    if (body.price !== undefined) {
      const price = Number(body.price);
      if (!Number.isFinite(price) || price <= 0) {
        return NextResponse.json(
          { error: "price must be a positive number" },
          { status: 400 },
        );
      }
      data.price = price;
    }

    const updated = await prisma.trade.update({ where: { id }, data });
    return NextResponse.json(updated);
  } catch (error) {
    console.error(`PATCH /api/trades/${id} failed:`, error);
    return NextResponse.json(
      { error: "Failed to update trade" },
      { status: 500 },
    );
  }
}

// DELETE /api/trades/[id]
export async function DELETE(_request: Request, { params }: RouteContext) {
  const id = Number(params.id);
  if (!Number.isFinite(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  try {
    await prisma.trade.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(`DELETE /api/trades/${id} failed:`, error);
    return NextResponse.json(
      { error: "Failed to delete trade" },
      { status: 500 },
    );
  }
}
