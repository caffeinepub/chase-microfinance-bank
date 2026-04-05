import { CreditCard, Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";
import { bankingStore } from "../../store/bankingStore";

interface AccountCardProps {
  accountNumber: string;
  balance: number;
  username: string;
}

export function AccountCard({
  accountNumber,
  balance,
  username,
}: AccountCardProps) {
  const [showNumber, setShowNumber] = useState(false);

  const maskedNumber = showNumber
    ? accountNumber
    : accountNumber
        .split(" ")
        .map((chunk, i) => (i < 3 ? "••••" : chunk))
        .join(" ");

  return (
    <div
      data-ocid="dashboard.account_card"
      className="relative bg-gradient-to-br from-brand/20 via-chart-2/10 to-card border border-brand/20 rounded-2xl p-6 overflow-hidden shadow-card"
    >
      <div className="absolute top-0 right-0 w-40 h-40 bg-brand/5 rounded-full -translate-y-12 translate-x-12 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-chart-2/5 rounded-full translate-y-8 -translate-x-8 pointer-events-none" />

      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <CreditCard className="w-6 h-6 text-brand" />
          <span className="text-sm font-semibold text-foreground">
            Checking Account
          </span>
        </div>
        <span className="text-xs font-medium text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
          Active
        </span>
      </div>

      <div className="mb-6">
        <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">
          Account Number
        </p>
        <div className="flex items-center gap-3">
          <p className="text-base font-mono-data font-medium text-foreground tracking-widest">
            {maskedNumber}
          </p>
          <button
            type="button"
            onClick={() => setShowNumber(!showNumber)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            {showNumber ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">
            Available Balance
          </p>
          <p className="text-2xl font-bold font-mono-data text-foreground">
            {bankingStore.formatCurrency(balance)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">
            Account Holder
          </p>
          <p className="text-sm font-semibold text-foreground capitalize">
            {username}
          </p>
        </div>
      </div>
    </div>
  );
}
