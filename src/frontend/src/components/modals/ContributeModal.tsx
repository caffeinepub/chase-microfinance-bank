import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, PiggyBank } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { useBanking } from "../../contexts/BankingContext";
import type { SavingsGoal } from "../../store/bankingStore";
import { bankingStore } from "../../store/bankingStore";

interface ContributeModalProps {
  open: boolean;
  goal: SavingsGoal | null;
  onClose: () => void;
}

export function ContributeModal({ open, goal, onClose }: ContributeModalProps) {
  const { contributeToGoal, balance } = useBanking();
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  function handleClose() {
    setAmount("");
    setError("");
    onClose();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!goal) return;
    const parsed = Number.parseFloat(amount);
    if (!amount || Number.isNaN(parsed) || parsed <= 0) {
      setError("Please enter a valid amount");
      return;
    }
    if (parsed > balance) {
      setError(
        `Insufficient funds. Available: ${bankingStore.formatCurrency(balance)}`,
      );
      return;
    }
    const remaining = goal.targetAmount - goal.currentAmount;
    if (parsed > remaining) {
      setError(
        `Amount exceeds remaining ${bankingStore.formatCurrency(remaining)}`,
      );
      return;
    }

    setIsLoading(true);
    setError("");
    try {
      const result = await contributeToGoal(goal.id, parsed);
      if (result.success) {
        toast.success("Contribution added!");
        handleClose();
      } else {
        setError(result.message);
      }
    } finally {
      setIsLoading(false);
    }
  }

  if (!goal) return null;

  const percent = Math.round((goal.currentAmount / goal.targetAmount) * 100);
  const remaining = goal.targetAmount - goal.currentAmount;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent
        data-ocid="contribute.modal"
        className="sm:max-w-sm bg-card border-border"
      >
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-brand/15 text-brand flex items-center justify-center">
              <PiggyBank className="w-5 h-5" />
            </div>
            <DialogTitle className="text-lg font-bold">
              Add Contribution
            </DialogTitle>
          </div>
          <DialogDescription>{goal.name}</DialogDescription>
        </DialogHeader>

        <div className="bg-muted/50 rounded-xl p-4 mt-2">
          <div className="flex justify-between text-xs text-muted-foreground mb-2">
            <span>{bankingStore.formatCurrency(goal.currentAmount)}</span>
            <span>{bankingStore.formatCurrency(goal.targetAmount)}</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand to-chart-2 rounded-full transition-all"
              style={{ width: `${percent}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {percent}% complete · {bankingStore.formatCurrency(remaining)}{" "}
            remaining
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="contribute-amount">Amount to Add</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                $
              </span>
              <Input
                id="contribute-amount"
                data-ocid="contribute.input"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={`pl-7 ${error ? "border-destructive" : ""}`}
                min="0.01"
              />
            </div>
            {error && (
              <p
                data-ocid="contribute.error_state"
                className="text-xs text-destructive"
              >
                {error}
              </p>
            )}
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              data-ocid="contribute.cancel_button"
              onClick={handleClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              data-ocid="contribute.submit_button"
              disabled={isLoading}
              className="flex-1 bg-brand hover:bg-brand/90 text-brand-foreground font-semibold"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Add Funds"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
