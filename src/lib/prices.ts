// Live price fetching via Finnhub (https://finnhub.io)
// Reads the API key from process.env.FINNHUB_API_KEY.
//
// Free tier: 60 calls per minute. For typical personal portfolios
// (<50 holdings) we comfortably stay under that on every refresh.

const FINNHUB_BASE = "https://finnhub.io/api/v1";

// The shape Finnhub returns from /quote.
// We only use `c` (current price); the rest are kept here for documentation.
interface FinnhubQuote {
  c: number; // current price
  d: number | null; // change vs previous close
  dp: number | null; // change % vs previous close
  h: number; // day's high
  l: number; // day's low
  o: number; // day's open
  pc: number; // previous close
  t: number; // unix timestamp
}

export interface QuoteResult {
  ticker: string;
  price: number | null;
  error?: string;
}

/**
 * Fetch the current price for a single ticker.
 * Returns { price: null, error: "..." } on any failure so callers can
 * keep going through the rest of the list without aborting.
 */
export async function fetchQuote(ticker: string): Promise<QuoteResult> {
  const key = process.env.FINNHUB_API_KEY;
  if (!key) {
    return { ticker, price: null, error: "FINNHUB_API_KEY not set" };
  }

  try {
    const url = `${FINNHUB_BASE}/quote?symbol=${encodeURIComponent(ticker)}&token=${key}`;
    const res = await fetch(url, { cache: "no-store" });

    if (!res.ok) {
      return { ticker, price: null, error: `HTTP ${res.status}` };
    }

    const data = (await res.json()) as FinnhubQuote;

    // Finnhub returns c = 0 for unknown tickers rather than an error code
    if (!data.c || data.c <= 0) {
      return { ticker, price: null, error: "No quote returned (check ticker)" };
    }

    return { ticker, price: data.c };
  } catch (err) {
    return {
      ticker,
      price: null,
      error: err instanceof Error ? err.message : "Network error",
    };
  }
}

/**
 * Fetch quotes for many tickers in parallel.
 * Errors on individual tickers are returned in-band; this function
 * never throws on a per-ticker failure.
 */
export async function fetchQuotes(tickers: string[]): Promise<QuoteResult[]> {
  return Promise.all(tickers.map(fetchQuote));
}
