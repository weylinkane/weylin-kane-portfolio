# Weylin Kane Portfolio

A personal investment portfolio dashboard. Built with Next.js, TypeScript, Tailwind CSS, Prisma, and SQLite.

## Quick start

Requirements: Node.js 18.17+ (recommended: Node 20 LTS) and npm.

```bash
# 1. Install dependencies
npm install

# 2. Create the database and apply the schema
npx prisma migrate dev --name init

# 3. Start the dev server
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

The database starts empty. Go to `/admin` to add your first holding and trade — the dashboard, holdings table, and trade journal will populate automatically.

## Pages

| Route             | Description                                                  |
| ----------------- | ------------------------------------------------------------ |
| `/`               | Dashboard: portfolio value, total gain, allocation chart, recent trades |
| `/holdings`       | Sortable table of every current position with live computed metrics |
| `/trade-journal`  | Chronological timeline of every buy and sell                 |
| `/philosophy`     | Investment philosophy (edit `src/app/philosophy/page.tsx`)   |
| `/about`          | About page (edit `src/app/about/page.tsx`)                   |
| `/admin`          | Add / edit / delete trades and holdings                      |

## Tech stack

- **Next.js 14** (App Router) — pages, layouts, and API routes
- **React 18** — UI components
- **TypeScript** — type safety
- **Tailwind CSS** — styling via utility classes
- **Prisma** — type-safe database client
- **SQLite** — file-based database (`prisma/dev.db`)
- **Recharts** — allocation pie chart
- **Lucide React** — icon set

## Project structure

```
weylin-kane-portfolio/
├── prisma/
│   ├── schema.prisma        ← database schema
│   └── dev.db               ← created after first migration (gitignored)
├── src/
│   ├── app/
│   │   ├── layout.tsx       ← root layout + sidebar
│   │   ├── page.tsx         ← home dashboard
│   │   ├── globals.css
│   │   ├── holdings/page.tsx
│   │   ├── trade-journal/page.tsx
│   │   ├── philosophy/page.tsx
│   │   ├── about/page.tsx
│   │   ├── admin/page.tsx
│   │   ├── admin/AdminClient.tsx
│   │   └── api/             ← backend endpoints
│   │       ├── trades/route.ts
│   │       ├── trades/[id]/route.ts
│   │       ├── holdings/route.ts
│   │       └── holdings/[id]/route.ts
│   ├── components/
│   │   ├── layout/          ← Sidebar
│   │   ├── dashboard/       ← StatCard, AllocationChart, RecentTrades
│   │   ├── holdings/        ← HoldingsTable, HoldingForm
│   │   ├── trades/          ← TradeTimeline, TradeForm
│   │   └── ui/              ← Button, Card, Badge, Modal, etc.
│   ├── lib/
│   │   ├── prisma.ts        ← Prisma client singleton
│   │   └── utils.ts         ← formatters and portfolio math
│   └── types/index.ts
├── .env                     ← DATABASE_URL (gitignored)
├── .env.example             ← committed template
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## Useful commands

```bash
npm run dev           # Start dev server at localhost:3000
npm run build         # Production build (runs prisma generate first)
npm run start         # Run the production build
npm run db:migrate    # Apply a new schema change
npm run db:studio     # Open Prisma Studio (DB GUI) at localhost:5555
```

## Customizing the content pages

### About page
Edit `src/app/about/page.tsx`:
- Write your bio in the Biography section
- Update the `links` object with your real Resume / LinkedIn / GitHub URLs
- Drop a photo into `/public` and reference it in place of the placeholder square

### Philosophy page
Edit `src/app/philosophy/page.tsx`. Each entry in the `sections` array becomes its own subsection.

### Branding
Sidebar text lives in `src/components/layout/Sidebar.tsx`. The color palette is defined in `tailwind.config.ts` under `theme.extend.colors`.

## How the math works

Holdings store three numbers per position: `shares`, `avgCost`, `currentPrice`. Everything else is derived in `src/lib/utils.ts`:

- **Market value** = `shares × currentPrice`
- **Gain / loss** = `marketValue − (shares × avgCost)`
- **Gain %** = `gain ÷ (shares × avgCost)`
- **Allocation %** = `marketValue ÷ totalPortfolioValue`

In V1 you update `currentPrice` manually via the Admin page. V2 could fetch live prices from an API.

## Deploying to Vercel

SQLite isn't ideal for serverless production hosting because the filesystem is ephemeral. Two paths forward:

1. **Switch to Postgres for production.** Vercel Postgres or Neon both work well. Change `provider = "sqlite"` to `provider = "postgresql"` in `prisma/schema.prisma`, set `DATABASE_URL` in the Vercel project to your Postgres connection string, then `npx prisma migrate deploy`.
2. **Keep SQLite for now.** Fine if you only run locally and use the live site as a read-only showcase, but data won't persist across deployments.

Push to GitHub, import the repo in Vercel, and add `DATABASE_URL` as an environment variable. The build command (`prisma generate && next build`) is already wired up in `package.json`.

## License

Personal project. No license declared — fork and adapt for your own use.
