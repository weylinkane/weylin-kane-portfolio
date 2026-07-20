-- CreateTable
CREATE TABLE "Trade" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL,
    "ticker" TEXT NOT NULL,
    "company" TEXT,
    "type" TEXT NOT NULL,
    "shares" REAL NOT NULL,
    "price" REAL NOT NULL,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Holding" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ticker" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "shares" REAL NOT NULL,
    "avgCost" REAL NOT NULL,
    "currentPrice" REAL NOT NULL,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Holding_ticker_key" ON "Holding"("ticker");
