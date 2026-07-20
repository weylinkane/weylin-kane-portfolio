import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { TRADE_TYPES } from "@/types";

// GET /api/trades — returns all trades, newest first
export async function GET() {
  const unauthorized = requireAuth();
  if (unauthorized) return unauthorized;

  try {
    const trades = await prisma.trade.findMany({
      orderBy: { date: "desc" },
    });
    return NextResponse.json(trades);
  } catch (error) {
    console.error("GET /api/trades failed:", error);
    return NextResponse.json(
      { error: "Failed to load trades" },
      { status: 500 },
    );
  }
}

// POST /api/trades — create a trade
// Expects: { date, ticker, type, shares, price, company?, notes? }
export async function POST(request: Request) {
  const unauthorized = requireAuth();
  if (unauthorized) return unauthorized;

  try {
    const body = await request.json();

    // Validation
    if (!body.date || !body.ticker || !body.type) {
      return NextResponse.json(
        { error: "date, ticker, and type are required" },
        { status: 400 },
      );
    }
    if (!TRADE_TYPES.includes(body.type)) {
      return NextResponse.json(
        { error: "type must be BUY or SELL" },
        { status: 400 },
      );
    }
    const shares = Number(body.shares);
    const price = Number(body.price);
    if (!Number.isFinite(shares) || shares <= 0) {
      return NextResponse.json(
        { error: "shares must be a positive number" },
        { status: 400 },
      );
    }
    if (!Number.isFinite(price) || price <= 0) {
      return NextResponse.json(
        { error: "price must be a positive number" },
        { status: 400 },
      );
    }

    const trade = await prisma.trade.create({
      data: {
        date: new Date(body.date),
        ticker: String(body.ticker).toUpperCase().trim(),
        company: body.company ? String(body.company).trim() : null,
        type: body.type,
        shares,
        price,
        notes: body.notes ? String(body.notes).trim() : null,
      },
    });

    return NextResponse.json(trade, { status: 201 });
  } catch (error) {
    console.error("POST /api/trades failed:", error);
    return NextResponse.json(
      { error: "Failed to create trade" },
      { status: 500 },
    );
  }
}
