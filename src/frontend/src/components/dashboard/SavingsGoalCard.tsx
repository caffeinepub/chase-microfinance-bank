import { Progress } from "@/components/ui/progress";
import { Car, Home, Laptop, Plane, Shield, Target, Wallet } from "lucide-react";
import type React from "react";
import type { SavingsGoal } from "../../store/bankingStore";
import { bankingStore } from "../../store/bankingStore";

const GOAL_ICONS: Record<string, React.ReactNode> = {
  Plane: <Plane className="w-4 h-4" />,
  Shield: <Shield className="w-4 h-4" />,
  Laptop: <Laptop className="w-4 h-4" />,
  Target: <Target className="w-4 h-4" />,
  Home: <Home className="w-4 h-4" />,
  Car: <Car className="w-4 h-4" />,
  Wallet: <Wallet className="w-4 h-4" />,
};

const GOAL_COLORS: Record<string, string> = {
  teal: "bg-brand/15 text-brand",
  blue: "bg-chart-2/15 text-chart-2",
  purple: "bg-chart-2/15 text-chart-2",
  green: "bg-success/15 text-success",
};

interface SavingsGoalCardProps {
  goal: SavingsGoal;
  compact?: boolean;
  index: number;
}

export function SavingsGoalCard({
  goal,
  compact = false,
  index,
}: SavingsGoalCardProps) {
  const percent =
    goal.targetAmount > 0
      ? Math.round((goal.currentAmount / goal.targetAmount) * 100)
      : 0;
  const iconBg = GOAL_COLORS[goal.color] || "bg-brand/15 text-brand";
  const icon = GOAL_ICONS[goal.icon] || <Target className="w-4 h-4" />;

  if (compact) {
    return (
      <div data-ocid={`savings.item.${index}`} className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center ${iconBg}`}
            >
              {icon}
            </div>
            <span className="text-sm font-medium text-foreground">
              {goal.name}
            </span>
          </div>
          <span className="text-xs font-semibold text-muted-foreground">
            {percent}%
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand to-chart-2 rounded-full transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{bankingStore.formatCurrency(goal.currentAmount)}</span>
          <span>{bankingStore.formatCurrency(goal.targetAmount)}</span>
        </div>
      </div>
    );
  }

  return (
    <div
      data-ocid={`savings.item.${index}`}
      className="bg-card border border-border rounded-xl p-5 shadow-card hover:shadow-card-hover transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}
          >
            {icon}
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">{goal.name}</p>
            <p className="text-xs text-muted-foreground">
              {bankingStore.formatCurrency(goal.currentAmount)} of{" "}
              {bankingStore.formatCurrency(goal.targetAmount)}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-foreground">{percent}%</p>
          <p className="text-xs text-muted-foreground">complete</p>
        </div>
      </div>
      <div className="h-2.5 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-brand to-chart-2 rounded-full transition-all duration-700"
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        {bankingStore.formatCurrency(goal.targetAmount - goal.currentAmount)}{" "}
        remaining
      </p>
    </div>
  );
}
