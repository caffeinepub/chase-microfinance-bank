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
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeftRight,
  Loader2,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { useBanking } from "../../contexts/BankingContext";
import { bankingStore } from "../../store/bankingStore";

type Mode = "transfer" | "deposit" | "withdraw";

interface TransactionModalProps {
  open: boolean;
  mode: Mode;
  onClose: () => void;
}

const MODE_CONFIG = {
  transfer: {
    title: "Transfer Funds",
    icon: <ArrowLeftRight className="w-5 h-5" />,
    iconBg: "bg-chart-2/15 text-chart-2",
    btnLabel: "Send Transfer",
    btnClass: "bg-chart-2 hover:bg-chart-2/90 text-white",
  },
  deposit: {
    title: "Deposit Funds",
    icon: <TrendingUp className="w-5 h-5" />,
    iconBg: "bg-success/15 text-success",
    btnLabel: "Deposit",
    btnClass: "bg-success hover:bg-success/90 text-success-foreground",
  },
  withdraw: {
    title: "Withdraw Funds",
    icon: <TrendingDown className="w-5 h-5" />,
    iconBg: "bg-destructive/15 text-destructive",
    btnLabel: "Withdraw",
    btnClass:
      "bg-destructive hover:bg-destructive/90 text-destructive-foreground",
  },
};

export function TransactionModal({
  open,
  mode,
  onClose,
}: TransactionModalProps) {
  const { transfer, deposit, withdraw, balance } = useBanking();
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [note, setNote] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const config = MODE_CONFIG[mode];

  function reset() {
    setAmount("");
    setRecipient("");
    setNote("");
    setErrors({});
  }

  function handleClose() {
    reset();
    onClose();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    const parsedAmount = Number.parseFloat(amount);

    if (!amount || Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      newErrors.amount = "Please enter a valid amount";
    } else if (parsedAmount < 0.01) {
      newErrors.amount = "Minimum amount is $0.01";
    }

    if (mode === "transfer" && !recipient.trim()) {
      newErrors.recipient = "Recipient username is required";
    }

    if (
      (mode === "withdraw" || mode === "transfer") &&
      parsedAmount > balance
    ) {
      newErrors.amount = `Insufficient funds. Available: ${bankingStore.formatCurrency(balance)}`;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});
    try {
      let result: { success: boolean; message: string };
      if (mode === "transfer") {
        result = await transfer(recipient.trim(), parsedAmount, note.trim());
      } else if (mode === "deposit") {
        result = await deposit(parsedAmount);
      } else {
        result = await withdraw(parsedAmount);
      }

      if (result.success) {
        toast.success(result.message || `${config.title} successful!`);
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
        data-ocid="transaction.modal"
        className="sm:max-w-md bg-card border-border"
      >
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${config.iconBg}`}
            >
              {config.icon}
            </div>
            <DialogTitle className="text-lg font-bold">
              {config.title}
            </DialogTitle>
          </div>
          <DialogDescription className="text-muted-foreground text-sm">
            {mode === "transfer" &&
              "Send money to another Chase Microfinance Bank user"}
            {mode === "deposit" && "Add funds to your checking account"}
            {mode === "withdraw" && "Withdraw cash from your checking account"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {mode === "transfer" && (
            <div className="space-y-2">
              <Label htmlFor="tx-recipient">Recipient Username</Label>
              <Input
                id="tx-recipient"
                data-ocid="transaction.input"
                placeholder="Enter username"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className={errors.recipient ? "border-destructive" : ""}
              />
              {errors.recipient && (
                <p className="text-xs text-destructive">{errors.recipient}</p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="tx-amount">Amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                $
              </span>
              <Input
                id="tx-amount"
                data-ocid="transaction.input"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={`pl-7 ${errors.amount ? "border-destructive" : ""}`}
                min="0.01"
                step="0.01"
              />
            </div>
            {errors.amount && (
              <p className="text-xs text-destructive">{errors.amount}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Available balance:{" "}
              <span className="font-medium text-foreground">
                {bankingStore.formatCurrency(balance)}
              </span>
            </p>
          </div>

          {mode === "transfer" && (
            <div className="space-y-2">
              <Label htmlFor="tx-note">Note (optional)</Label>
              <Textarea
                id="tx-note"
                data-ocid="transaction.textarea"
                placeholder="Add a note..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="resize-none h-20"
              />
            </div>
          )}

          {errors.general && (
            <div
              data-ocid="transaction.error_state"
              className="bg-destructive/10 border border-destructive/30 rounded-lg px-4 py-3 text-sm text-destructive"
            >
              {errors.general}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              data-ocid="transaction.cancel_button"
              onClick={handleClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              data-ocid="transaction.submit_button"
              disabled={isLoading}
              className={`flex-1 font-semibold ${config.btnClass}`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                config.btnLabel
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
