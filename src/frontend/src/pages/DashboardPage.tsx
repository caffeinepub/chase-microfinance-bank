import { Button } from "@/components/ui/button";
import {
  ArrowLeftRight,
  Eye,
  LayoutDashboard,
  Plus,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { motion } from "motion/react";
import React, { useState } from "react";
import { AccountCard } from "../components/dashboard/AccountCard";
import { BalanceCard } from "../components/dashboard/BalanceCard";
import { FinancialChart } from "../components/dashboard/FinancialChart";
import { SavingsGoalCard } from "../components/dashboard/SavingsGoalCard";
import { TransactionList } from "../components/dashboard/TransactionList";
import { TransactionModal } from "../components/modals/TransactionModal";
import { useAuth } from "../contexts/AuthContext";
import { useBanking } from "../contexts/BankingContext";

type ModalMode = "transfer" | "deposit" | "withdraw" | null;

export default function DashboardPage() {
  const { session } = useAuth();
  const {
    balance,
    transactions,
    savingsGoals,
    monthlyIncome,
    monthlyExpenses,
    accountNumber,
  } = useBanking();
  const [modalMode, setModalMode] = useState<ModalMode>(null);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand/15 flex items-center justify-center">
            <LayoutDashboard className="w-5 h-5 text-brand" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Overview of your finances
            </p>
          </div>
        </div>

        {/* Quick actions */}
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            data-ocid="dashboard.deposit.button"
            onClick={() => setModalMode("deposit")}
            className="gap-2 rounded-xl"
          >
            <TrendingUp className="w-4 h-4 text-success" />
            <span className="hidden sm:inline">Deposit</span>
          </Button>
          <Button
            size="sm"
            variant="outline"
            data-ocid="dashboard.withdraw.button"
            onClick={() => setModalMode("withdraw")}
            className="gap-2 rounded-xl"
          >
            <TrendingDown className="w-4 h-4 text-destructive" />
            <span className="hidden sm:inline">Withdraw</span>
          </Button>
          <Button
            size="sm"
            data-ocid="dashboard.transfer.button"
            onClick={() => setModalMode("transfer")}
            className="gap-2 rounded-xl bg-brand hover:bg-brand/90 text-brand-foreground"
          >
            <ArrowLeftRight className="w-4 h-4" />
            <span className="hidden sm:inline">Transfer</span>
          </Button>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        <BalanceCard
          title="Total Balance"
          amount={balance}
          type="balance"
          index={1}
        />
        <BalanceCard
          title="Monthly Income"
          amount={monthlyIncome}
          type="income"
          index={2}
        />
        <BalanceCard
          title="Monthly Expenses"
          amount={monthlyExpenses}
          type="expense"
          index={3}
        />
      </motion.div>

      {/* Chart + Account Card */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-4"
      >
        {/* Chart */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Account Performance
              </h3>
              <p className="text-xs text-muted-foreground">Last 30 days</p>
            </div>
          </div>
          <FinancialChart balance={balance} />
        </div>

        {/* Account Card */}
        <div className="flex flex-col gap-4">
          <AccountCard
            accountNumber={accountNumber}
            balance={balance}
            username={session?.username || ""}
          />
        </div>
      </motion.div>

      {/* Transactions + Savings */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-4"
      >
        {/* Recent Transactions */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground">
              Recent Transactions
            </h3>
            <Button
              variant="ghost"
              size="sm"
              data-ocid="dashboard.view_all_transactions.button"
              onClick={() => window.location.assign("/transactions")}
              className="text-brand hover:text-brand/80 text-xs gap-1"
            >
              <Eye className="w-3 h-3" />
              View All
            </Button>
          </div>
          <TransactionList transactions={transactions} limit={5} />
        </div>

        {/* Savings Goals */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground">
              Savings Goals
            </h3>
            <Button
              variant="ghost"
              size="sm"
              data-ocid="dashboard.view_savings.button"
              onClick={() => window.location.assign("/savings")}
              className="text-brand hover:text-brand/80 text-xs gap-1"
            >
              <Eye className="w-3 h-3" />
              View All
            </Button>
          </div>
          {savingsGoals.length === 0 ? (
            <div data-ocid="savings.empty_state" className="text-center py-8">
              <p className="text-sm text-muted-foreground">
                No savings goals yet
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3 text-brand border-brand/30 hover:bg-brand/10"
                onClick={() => window.location.assign("/savings")}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Goal
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {savingsGoals.slice(0, 3).map((goal, i) => (
                <SavingsGoalCard
                  key={goal.id}
                  goal={goal}
                  compact
                  index={i + 1}
                />
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Transaction Modal */}
      {modalMode && (
        <TransactionModal
          open={true}
          mode={modalMode}
          onClose={() => setModalMode(null)}
        />
      )}
    </div>
  );
}
