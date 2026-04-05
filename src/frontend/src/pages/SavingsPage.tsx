import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { PiggyBank, Plus, Trash2, TrendingUp } from "lucide-react";
import { motion } from "motion/react";
import React, { useState } from "react";
import { toast } from "sonner";
import { SavingsGoalCard } from "../components/dashboard/SavingsGoalCard";
import { ContributeModal } from "../components/modals/ContributeModal";
import { NewGoalModal } from "../components/modals/NewGoalModal";
import { useBanking } from "../contexts/BankingContext";
import type { SavingsGoal } from "../store/bankingStore";
import { bankingStore } from "../store/bankingStore";

export default function SavingsPage() {
  const { savingsGoals, deleteSavingsGoal } = useBanking();
  const [newGoalOpen, setNewGoalOpen] = useState(false);
  const [contributeGoal, setContributeGoal] = useState<SavingsGoal | null>(
    null,
  );
  const [deleteGoalId, setDeleteGoalId] = useState<string | null>(null);

  const totalSaved = savingsGoals.reduce((sum, g) => sum + g.currentAmount, 0);
  const totalTarget = savingsGoals.reduce((sum, g) => sum + g.targetAmount, 0);
  const overallPercent =
    totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0;

  function handleDelete(goalId: string) {
    deleteSavingsGoal(goalId);
    setDeleteGoalId(null);
    toast.success("Savings goal deleted. Funds returned to your account.");
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand/15 flex items-center justify-center">
            <PiggyBank className="w-5 h-5 text-brand" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Savings Goals
            </h1>
            <p className="text-sm text-muted-foreground">
              {savingsGoals.length} active goals
            </p>
          </div>
        </div>
        <Button
          data-ocid="savings.new_goal.button"
          onClick={() => setNewGoalOpen(true)}
          className="gap-2 rounded-xl bg-brand hover:bg-brand/90 text-brand-foreground"
        >
          <Plus className="w-4 h-4" />
          New Goal
        </Button>
      </motion.div>

      {/* Summary card */}
      {savingsGoals.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-gradient-to-br from-brand/10 to-chart-2/10 border border-brand/20 rounded-xl p-5 shadow-card"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                Total Savings Progress
              </p>
              <p className="text-2xl font-bold text-foreground">
                {bankingStore.formatCurrency(totalSaved)}{" "}
                <span className="text-muted-foreground text-base font-normal">
                  of {bankingStore.formatCurrency(totalTarget)}
                </span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold text-brand">{overallPercent}%</p>
              <p className="text-xs text-muted-foreground">overall</p>
            </div>
          </div>
          <div className="h-2.5 bg-brand/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand to-chart-2 rounded-full transition-all duration-700"
              style={{ width: `${overallPercent}%` }}
            />
          </div>
        </motion.div>
      )}

      {/* Goals grid */}
      {savingsGoals.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          data-ocid="savings.empty_state"
          className="text-center py-20"
        >
          <div className="w-16 h-16 rounded-2xl bg-brand/10 flex items-center justify-center mx-auto mb-4">
            <PiggyBank className="w-8 h-8 text-brand" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No savings goals yet
          </h3>
          <p className="text-muted-foreground text-sm mb-6">
            Create your first savings goal to start building your financial
            future
          </p>
          <Button
            data-ocid="savings.create_first.button"
            onClick={() => setNewGoalOpen(true)}
            className="gap-2 bg-brand hover:bg-brand/90 text-brand-foreground"
          >
            <Plus className="w-4 h-4" />
            Create First Goal
          </Button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
        >
          {savingsGoals.map((goal, i) => (
            <div key={goal.id} className="relative group">
              <SavingsGoalCard goal={goal} index={i + 1} />
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  data-ocid={`savings.contribute_button.${i + 1}`}
                  onClick={() => setContributeGoal(goal)}
                  className="w-7 h-7 rounded-lg bg-brand/15 text-brand hover:bg-brand/25 flex items-center justify-center transition-colors"
                  title="Add funds"
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  data-ocid={`savings.delete_button.${i + 1}`}
                  onClick={() => setDeleteGoalId(goal.id)}
                  className="w-7 h-7 rounded-lg bg-destructive/15 text-destructive hover:bg-destructive/25 flex items-center justify-center transition-colors"
                  title="Delete goal"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {/* Modals */}
      <NewGoalModal open={newGoalOpen} onClose={() => setNewGoalOpen(false)} />
      <ContributeModal
        open={!!contributeGoal}
        goal={contributeGoal}
        onClose={() => setContributeGoal(null)}
      />

      {/* Delete confirm */}
      <AlertDialog
        open={!!deleteGoalId}
        onOpenChange={(v) => !v && setDeleteGoalId(null)}
      >
        <AlertDialogContent
          data-ocid="savings.delete.dialog"
          className="bg-card border-border"
        >
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Savings Goal?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this savings goal and return the
              saved funds to your main account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="savings.delete.cancel_button">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              data-ocid="savings.delete.confirm_button"
              onClick={() => deleteGoalId && handleDelete(deleteGoalId)}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              Delete Goal
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
