import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

// GET /api/holdings — returns all holdings, alphabetical by ticker
export async function GET() {
  const unauthorized = requireAuth();
  if (unauthorized) return unauthorized;

  try {
    const holdings = await prisma.holding.findMany({
      orderBy: { ticker: "asc" },
    });
    return NextResponse.json(holdings);
  } catch (error) {
    console.error("GET /api/holdings failed:", error);
    return NextResponse.json(
      { error: "Failed to load holdings" },
      { status: 500 },
    );
  }
}

// POST /api/holdings — create a holding
// Expects: { ticker, company, shares, avgCost, currentPrice }
export async function POST(request: Request) {
  const unauthorized = requireAuth();
  if (unauthorized) return unauthorized;

  try {
    const body = await request.json();

    if (!body.ticker || !body.company) {
      return NextResponse.json(
        { error: "ticker and company are required" },
        { status: 400 },
      );
    }

    const shares = Number(body.shares);
    const avgCost = Number(body.avgCost);
    const currentPrice = Number(body.currentPrice);

    if (!Number.isFinite(shares) || shares <= 0) {
      return NextResponse.json(
        { error: "shares must be a positive number" },
        { status: 400 },
      );
    }
    if (!Number.isFinite(avgCost) || avgCost <= 0) {
      return NextResponse.json(
        { error: "avgCost must be a positive number" },
        { status: 400 },
      );
    }
    if (!Number.isFinite(currentPrice) || currentPrice <= 0) {
      return NextResponse.json(
        { error: "currentPrice must be a positive number" },
        { status: 400 },
      );
    }

    const ticker = String(body.ticker).toUpperCase().trim();

    const holding = await prisma.holding.create({
      data: {
        ticker,
        company: String(body.company).trim(),
        shares,
        avgCost,
        currentPrice,
      },
    });

    return NextResponse.json(holding, { status: 201 });
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code: string }).code === "P2002"
    ) {
      return NextResponse.json(
        { error: "A holding with this ticker already exists" },
        { status: 409 },
      );
    }
    console.error("POST /api/holdings failed:", error);
    return NextResponse.json(
      { error: "Failed to create holding" },
      { status: 500 },
    );
  }
}
