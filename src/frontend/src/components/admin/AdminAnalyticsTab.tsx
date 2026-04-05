import { ArrowLeftRight, DollarSign, MessageCircle, Users } from "lucide-react";
import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  type BankUser,
  type Conversation,
  bankingStore,
} from "../../store/bankingStore";

interface AdminAnalyticsTabProps {
  users: BankUser[];
  conversations: Conversation[];
}

const COLORS = [
  "oklch(0.76 0.14 185)",
  "oklch(0.6 0.2 264)",
  "oklch(0.65 0.18 145)",
  "oklch(0.75 0.16 70)",
  "oklch(0.58 0.22 27)",
];

export function AdminAnalyticsTab({
  users,
  conversations,
}: AdminAnalyticsTabProps) {
  const totalFunds = users.reduce((sum, u) => sum + u.balance, 0);
  const totalTx = users.reduce((sum, u) => sum + u.transactions.length, 0);
  const activeConvs = conversations.filter(
    (c) => c.status === "open" || c.status === "pending",
  ).length;
  const activeUsers = users.filter((u) => !u.isFrozen).length;

  const roleData = [
    { name: "Users", value: users.filter((u) => u.role === "user").length },
    { name: "Admins", value: users.filter((u) => u.role === "admin").length },
  ];

  const balanceRanges = [
    { range: "$0–$50K", count: users.filter((u) => u.balance < 50000).length },
    {
      range: "$50K–$100K",
      count: users.filter((u) => u.balance >= 50000 && u.balance < 100000)
        .length,
    },
    {
      range: "$100K–$500K",
      count: users.filter((u) => u.balance >= 100000 && u.balance < 500000)
        .length,
    },
    { range: "$500K+", count: users.filter((u) => u.balance >= 500000).length },
  ];

  const kpis = [
    {
      label: "Total Users",
      value: users.length.toString(),
      icon: <Users className="w-5 h-5" />,
      color: "bg-brand/15 text-brand",
      sub: `${activeUsers} active`,
    },
    {
      label: "Total Funds",
      value: bankingStore.formatCurrency(totalFunds),
      icon: <DollarSign className="w-5 h-5" />,
      color: "bg-success/15 text-success",
      sub: "across all accounts",
    },
    {
      label: "Transactions",
      value: totalTx.toLocaleString(),
      icon: <ArrowLeftRight className="w-5 h-5" />,
      color: "bg-chart-2/15 text-chart-2",
      sub: "total processed",
    },
    {
      label: "Active Chats",
      value: activeConvs.toString(),
      icon: <MessageCircle className="w-5 h-5" />,
      color: "bg-warning/15 text-warning",
      sub: `${conversations.length} total`,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            data-ocid="admin.analytics.card.1"
            className="bg-card border border-border rounded-xl p-4 shadow-card"
          >
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${kpi.color}`}
            >
              {kpi.icon}
            </div>
            <p className="text-xs text-muted-foreground mb-1">{kpi.label}</p>
            <p className="text-xl font-bold text-foreground">{kpi.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{kpi.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-xl p-5 shadow-card">
          <h3 className="text-sm font-semibold text-foreground mb-4">
            Balance Distribution
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={balanceRanges}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="oklch(0.24 0.025 238 / 0.6)"
                vertical={false}
              />
              <XAxis
                dataKey="range"
                tick={{ fontSize: 10, fill: "oklch(0.58 0.03 230)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "oklch(0.58 0.03 230)" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "oklch(0.17 0.022 238)",
                  border: "1px solid oklch(0.24 0.025 238)",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                labelStyle={{ color: "oklch(0.94 0.01 220)" }}
              />
              <Bar
                dataKey="count"
                fill="oklch(0.76 0.14 185)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 shadow-card">
          <h3 className="text-sm font-semibold text-foreground mb-4">
            User Roles
          </h3>
          <div className="flex items-center justify-center gap-8">
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie
                  data={roleData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  dataKey="value"
                  paddingAngle={3}
                >
                  {roleData.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={COLORS[roleData.indexOf(entry) % COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3">
              {roleData.map((entry) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-sm"
                    style={{ background: COLORS[roleData.indexOf(entry)] }}
                  />
                  <span className="text-sm text-foreground">{entry.name}</span>
                  <span className="text-sm font-bold text-foreground ml-auto">
                    {entry.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
