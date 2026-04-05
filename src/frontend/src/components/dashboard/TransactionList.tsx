import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Coffee,
  Music,
  RefreshCcw,
  ShoppingBag,
  Tv2,
} from "lucide-react";
import type React from "react";
import type { Transaction } from "../../store/bankingStore";
import { bankingStore } from "../../store/bankingStore";

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Income: <ArrowDownLeft className="w-4 h-4" />,
  Transfer: <RefreshCcw className="w-4 h-4" />,
  Groceries: <ShoppingBag className="w-4 h-4" />,
  Shopping: <ShoppingBag className="w-4 h-4" />,
  Entertainment: <Tv2 className="w-4 h-4" />,
  "Food & Drink": <Coffee className="w-4 h-4" />,
  Cash: <ArrowUpRight className="w-4 h-4" />,
  Deposit: <ArrowDownLeft className="w-4 h-4" />,
};

const CATEGORY_COLORS: Record<string, string> = {
  Income: "bg-success/15 text-success",
  Transfer: "bg-chart-2/15 text-chart-2",
  Groceries: "bg-warning/15 text-warning",
  Shopping: "bg-chart-4/15 text-chart-4",
  Entertainment: "bg-chart-2/15 text-chart-2",
  "Food & Drink": "bg-warning/15 text-warning",
  Cash: "bg-muted-foreground/15 text-muted-foreground",
  Deposit: "bg-success/15 text-success",
};

interface TransactionListProps {
  transactions: Transaction[];
  limit?: number;
  showAll?: boolean;
}

export function TransactionList({
  transactions,
  limit = 5,
  showAll = false,
}: TransactionListProps) {
  const displayed = showAll ? transactions : transactions.slice(0, limit);

  if (displayed.length === 0) {
    return (
      <div
        data-ocid="transactions.empty_state"
        className="text-center py-8 text-muted-foreground text-sm"
      >
        No transactions found
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {displayed.map((tx, i) => {
        const isPositive = tx.amount > 0;
        const iconBg =
          CATEGORY_COLORS[tx.category] || "bg-muted text-muted-foreground";
        const icon = CATEGORY_ICONS[tx.category] || (
          <RefreshCcw className="w-4 h-4" />
        );

        return (
          <div
            key={tx.id}
            data-ocid={`transactions.item.${i + 1}`}
            className="flex items-center gap-4 p-3 rounded-xl hover:bg-accent/50 transition-colors group"
          >
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}
            >
              {icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {tx.description}
              </p>
              <p className="text-xs text-muted-foreground">
                {tx.category} ·{" "}
                {formatDistanceToNow(new Date(tx.date), { addSuffix: true })}
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <p
                className={cn(
                  "text-sm font-semibold font-mono-data",
                  isPositive ? "text-success" : "text-muted-foreground",
                )}
              >
                {isPositive ? "+" : ""}
                {bankingStore.formatCurrency(tx.amount)}
              </p>
              <p
                className={cn(
                  "text-[10px] font-medium capitalize",
                  tx.status === "completed"
                    ? "text-success/70"
                    : tx.status === "pending"
                      ? "text-warning/70"
                      : "text-destructive/70",
                )}
              >
                {tx.status}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
