import { DollarSign, TrendingDown, TrendingUp } from "lucide-react";
import React from "react";
import { bankingStore } from "../../store/bankingStore";

interface BalanceCardProps {
  title: string;
  amount: number;
  type: "balance" | "income" | "expense";
  index: number;
}

export function BalanceCard({ title, amount, type, index }: BalanceCardProps) {
  const configs = {
    balance: {
      icon: <DollarSign className="w-5 h-5" />,
      iconBg: "bg-brand/15 text-brand",
      valueClass: "text-foreground",
      trend: null,
    },
    income: {
      icon: <TrendingUp className="w-5 h-5" />,
      iconBg: "bg-success/15 text-success",
      valueClass: "text-success",
      trend: "+12.5%",
    },
    expense: {
      icon: <TrendingDown className="w-5 h-5" />,
      iconBg: "bg-destructive/15 text-destructive",
      valueClass: "text-destructive",
      trend: "-3.2%",
    },
  };

  const config = configs[type];

  return (
    <div
      data-ocid={`dashboard.balance_card.${index}`}
      className="bg-card border border-border rounded-xl p-5 shadow-card hover:shadow-card-hover transition-shadow duration-200"
    >
      <div className="flex items-center justify-between mb-4">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${config.iconBg}`}
        >
          {config.icon}
        </div>
        {config.trend && (
          <span
            className={`text-xs font-semibold px-2 py-1 rounded-full ${type === "income" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}
          >
            {config.trend}
          </span>
        )}
      </div>
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
        {title}
      </p>
      <p className={`text-2xl font-bold font-mono-data ${config.valueClass}`}>
        {bankingStore.formatCurrency(amount)}
      </p>
    </div>
  );
}
