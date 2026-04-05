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
import { bankingStore } from "../../store/bankingStore";

interface NewGoalModalProps {
  open: boolean;
  onClose: () => void;
}

const GOAL_COLORS = [
  { value: "teal", label: "Teal", cls: "bg-brand" },
  { value: "blue", label: "Blue", cls: "bg-chart-2" },
  { value: "green", label: "Green", cls: "bg-success" },
  { value: "purple", label: "Purple", cls: "bg-chart-2" },
];

export function NewGoalModal({ open, onClose }: NewGoalModalProps) {
  const { addSavingsGoal, balance } = useBanking();
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [initial, setInitial] = useState("");
  const [color, setColor] = useState("teal");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function reset() {
    setName("");
    setTarget("");
    setInitial("");
    setColor("teal");
    setErrors({});
  }

  function handleClose() {
    reset();
    onClose();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    const parsedTarget = Number.parseFloat(target);
    const parsedInitial = Number.parseFloat(initial) || 0;

    if (!name.trim()) newErrors.name = "Goal name is required";
    if (!target || Number.isNaN(parsedTarget) || parsedTarget <= 0)
      newErrors.target = "Enter a valid target amount";
    if (initial && (Number.isNaN(parsedInitial) || parsedInitial < 0))
      newErrors.initial = "Enter a valid initial deposit";
    if (parsedInitial > balance)
      newErrors.initial = `Insufficient funds. Available: ${bankingStore.formatCurrency(balance)}`;
    if (initial && parsedInitial > parsedTarget)
      newErrors.initial = "Initial deposit cannot exceed target amount";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      const result = await addSavingsGoal(
        name.trim(),
        parsedTarget,
        parsedInitial,
        color,
        "Target",
      );
      if (result.success) {
        toast.success("Savings goal created!");
        handleClose();
      } else {
        setErrors({ general: result.message });
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent
        data-ocid="new_goal.modal"
        className="sm:max-w-md bg-card border-border"
      >
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-brand/15 text-brand flex items-center justify-center">
              <PiggyBank className="w-5 h-5" />
            </div>
            <DialogTitle className="text-lg font-bold">
              New Savings Goal
            </DialogTitle>
          </div>
          <DialogDescription>
            Create a new savings goal to track your financial targets
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="goal-name">Goal Name</Label>
            <Input
              id="goal-name"
              data-ocid="new_goal.input"
              placeholder="e.g. Dream Vacation"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="goal-target">Target Amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                $
              </span>
              <Input
                id="goal-target"
                data-ocid="new_goal.input"
                type="number"
                placeholder="0.00"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className={`pl-7 ${errors.target ? "border-destructive" : ""}`}
                min="1"
              />
            </div>
            {errors.target && (
              <p className="text-xs text-destructive">{errors.target}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="goal-initial">Initial Deposit (optional)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                $
              </span>
              <Input
                id="goal-initial"
                data-ocid="new_goal.input"
                type="number"
                placeholder="0.00"
                value={initial}
                onChange={(e) => setInitial(e.target.value)}
                className={`pl-7 ${errors.initial ? "border-destructive" : ""}`}
                min="0"
              />
            </div>
            {errors.initial && (
              <p className="text-xs text-destructive">{errors.initial}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Available:{" "}
              <span className="font-medium text-foreground">
                {bankingStore.formatCurrency(balance)}
              </span>
            </p>
          </div>

          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex gap-2">
              {GOAL_COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setColor(c.value)}
                  className={`w-8 h-8 rounded-full ${c.cls} transition-transform ${color === c.value ? "ring-2 ring-offset-2 ring-offset-card ring-brand scale-110" : "opacity-60"}`}
                />
              ))}
            </div>
          </div>

          {errors.general && (
            <div
              data-ocid="new_goal.error_state"
              className="bg-destructive/10 border border-destructive/30 rounded-lg px-4 py-3 text-sm text-destructive"
            >
              {errors.general}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              data-ocid="new_goal.cancel_button"
              onClick={handleClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              data-ocid="new_goal.submit_button"
              disabled={isLoading}
              className="flex-1 bg-brand hover:bg-brand/90 text-brand-foreground font-semibold"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Goal"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
