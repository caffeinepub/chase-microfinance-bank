import React from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { bankingStore } from "../../store/bankingStore";

interface FinancialChartProps {
  balance: number;
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover border border-border rounded-xl px-3 py-2 shadow-card">
        <p className="text-xs text-muted-foreground mb-1">{label}</p>
        <p className="text-sm font-bold text-foreground font-mono-data">
          {bankingStore.formatCurrency(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
}

export function FinancialChart({ balance }: FinancialChartProps) {
  const data = React.useMemo(
    () => bankingStore.generatePerformanceData(balance),
    [balance],
  );
  const showEvery = 5;

  return (
    <div data-ocid="dashboard.chart">
      <ResponsiveContainer width="100%" height={220}>
        <LineChart
          data={data}
          margin={{ top: 5, right: 5, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="oklch(0.76 0.14 185)" />
              <stop offset="100%" stopColor="oklch(0.6 0.2 264)" />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="oklch(0.24 0.025 238 / 0.6)"
            vertical={false}
          />
          <XAxis
            dataKey="date"
            tickFormatter={(val, idx) => (idx % showEvery === 0 ? val : "")}
            tick={{ fontSize: 10, fill: "oklch(0.58 0.03 230)" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
            tick={{ fontSize: 10, fill: "oklch(0.58 0.03 230)" }}
            axisLine={false}
            tickLine={false}
            width={50}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="balance"
            stroke="url(#lineGradient)"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 5, fill: "oklch(0.76 0.14 185)", strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
