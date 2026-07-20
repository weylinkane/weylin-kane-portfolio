"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { formatUnsignedPercent } from "@/lib/utils";
import type { AllocationSlice } from "@/lib/utils";

interface AllocationChartProps {
  data: AllocationSlice[];
}

// A muted, professional palette. Recharts doesn't read CSS variables,
// so we hardcode hex values here.
const COLORS = [
  "#fafafa",
  "#a3a3a3",
  "#737373",
  "#525252",
  "#404040",
  "#d4d4d4",
  "#737373",
  "#262626",
];

// Recharts uses a loose payload shape — we read it carefully and fall back gracefully.
interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{ payload?: AllocationSlice }>;
}

function ChartTooltip({ active, payload }: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  const slice = payload[0]?.payload;
  if (!slice) return null;
  return (
    <div className="rounded-md border border-border-strong bg-background px-3 py-2 text-xs shadow-lg">
      <p className="font-medium text-primary">{slice.ticker}</p>
      <p className="nums mt-1 text-secondary">
        {formatUnsignedPercent(slice.percent)}
      </p>
    </div>
  );
}

export default function AllocationChart({ data }: AllocationChartProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:items-center">
      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="ticker"
              cx="50%"
              cy="50%"
              innerRadius={56}
              outerRadius={96}
              stroke="#0a0a0a"
              strokeWidth={2}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={(props) => <ChartTooltip {...(props as ChartTooltipProps)} />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend — percentage only, no dollar values */}
      <ul className="space-y-2">
        {data.map((slice, i) => (
          <li
            key={slice.ticker}
            className="flex items-center justify-between gap-3 border-b border-border pb-2 text-sm last:border-b-0"
          >
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="h-2.5 w-2.5 rounded-sm"
                style={{ backgroundColor: COLORS[i % COLORS.length] }}
              />
              <span className="font-medium text-primary">{slice.ticker}</span>
            </div>
            <span className="nums text-secondary">
              {formatUnsignedPercent(slice.percent)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
