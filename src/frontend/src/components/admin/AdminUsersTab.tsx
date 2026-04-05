import { Badge } from "@/components/ui/badge";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { Flag, Search as SearchIcon, ShieldOff } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { type BankUser, bankingStore } from "../../store/bankingStore";

interface AdjustModalState {
  user: BankUser | null;
  adjustment: string;
  isLoading: boolean;
}

export function AdminUsersTab({
  users,
  onRefresh,
}: { users: BankUser[]; onRefresh: () => void }) {
  const [search, setSearch] = useState("");
  const [adjustState, setAdjustState] = useState<AdjustModalState>({
    user: null,
    adjustment: "",
    isLoading: false,
  });

  const filtered = users.filter((u) =>
    u.username.toLowerCase().includes(search.toLowerCase()),
  );

  function handleFreeze(username: string, frozen: boolean) {
    bankingStore.freezeUser(username, frozen);
    onRefresh();
    toast.success(`Account ${frozen ? "frozen" : "unfrozen"}: ${username}`);
  }

  function handleFlag(username: string, flagged: boolean) {
    bankingStore.flagUser(username, flagged);
    onRefresh();
    toast.success(`Account ${flagged ? "flagged" : "unflagged"}: ${username}`);
  }

  function handleAdjust() {
    if (!adjustState.user) return;
    const amount = Number.parseFloat(adjustState.adjustment);
    if (Number.isNaN(amount)) {
      toast.error("Enter a valid amount");
      return;
    }
    setAdjustState((s) => ({ ...s, isLoading: true }));
    setTimeout(() => {
      bankingStore.adjustBalance(adjustState.user!.username, amount);
      onRefresh();
      toast.success(
        `Balance adjusted by ${bankingStore.formatCurrency(amount)} for ${adjustState.user!.username}`,
      );
      setAdjustState({ user: null, adjustment: "", isLoading: false });
    }, 600);
  }

  return (
    <div className="space-y-4">
      <div className="relative max-w-sm">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          data-ocid="admin.users.search_input"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 rounded-xl"
        />
      </div>

      <div
        className="bg-card border border-border rounded-xl overflow-hidden"
        data-ocid="admin.users.table"
      >
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-xs text-muted-foreground uppercase tracking-wide">
                User
              </TableHead>
              <TableHead className="text-xs text-muted-foreground uppercase tracking-wide">
                Role
              </TableHead>
              <TableHead className="text-xs text-muted-foreground uppercase tracking-wide">
                Balance
              </TableHead>
              <TableHead className="text-xs text-muted-foreground uppercase tracking-wide">
                Status
              </TableHead>
              <TableHead className="text-xs text-muted-foreground uppercase tracking-wide">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((user, i) => (
              <TableRow
                key={user.username}
                data-ocid={`admin.users.row.${i + 1}`}
                className="border-border hover:bg-accent/30"
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-brand/20 flex items-center justify-center">
                      <span className="text-xs font-bold text-brand">
                        {user.username[0].toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {user.username}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs rounded-full",
                      user.role === "admin"
                        ? "border-brand/30 text-brand bg-brand/10"
                        : "border-border text-muted-foreground",
                    )}
                  >
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell className="font-mono-data text-sm font-medium">
                  {bankingStore.formatCurrency(user.balance)}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1.5">
                    {user.isFrozen && (
                      <Badge
                        variant="outline"
                        className="text-xs rounded-full border-blue-500/30 text-blue-400 bg-blue-500/10"
                      >
                        Frozen
                      </Badge>
                    )}
                    {user.isFlagged && (
                      <Badge
                        variant="outline"
                        className="text-xs rounded-full border-warning/30 text-warning bg-warning/10"
                      >
                        Flagged
                      </Badge>
                    )}
                    {!user.isFrozen && !user.isFlagged && (
                      <Badge
                        variant="outline"
                        className="text-xs rounded-full border-success/30 text-success bg-success/10"
                      >
                        Active
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      data-ocid={`admin.users.freeze_button.${i + 1}`}
                      onClick={() =>
                        handleFreeze(user.username, !user.isFrozen)
                      }
                      className="text-xs rounded-lg h-7 px-2"
                    >
                      <ShieldOff className="w-3 h-3 mr-1" />
                      {user.isFrozen ? "Unfreeze" : "Freeze"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      data-ocid={`admin.users.flag_button.${i + 1}`}
                      onClick={() => handleFlag(user.username, !user.isFlagged)}
                      className="text-xs rounded-lg h-7 px-2"
                    >
                      <Flag className="w-3 h-3 mr-1" />
                      {user.isFlagged ? "Unflag" : "Flag"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      data-ocid={`admin.users.adjust_button.${i + 1}`}
                      onClick={() =>
                        setAdjustState({
                          user,
                          adjustment: "",
                          isLoading: false,
                        })
                      }
                      className="text-xs rounded-lg h-7 px-2 text-brand border-brand/30 hover:bg-brand/10"
                    >
                      Adjust
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog
        open={!!adjustState.user}
        onOpenChange={(v) =>
          !v && setAdjustState({ user: null, adjustment: "", isLoading: false })
        }
      >
        <DialogContent
          data-ocid="admin.adjust.modal"
          className="sm:max-w-sm bg-card border-border"
        >
          <DialogHeader>
            <DialogTitle>Adjust Balance</DialogTitle>
            <DialogDescription>
              Adjust balance for <strong>{adjustState.user?.username}</strong>.
              Use positive to add, negative to subtract.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Adjustment Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                  $
                </span>
                <Input
                  data-ocid="admin.adjust.input"
                  type="number"
                  placeholder="0.00 (positive or negative)"
                  value={adjustState.adjustment}
                  onChange={(e) =>
                    setAdjustState((s) => ({
                      ...s,
                      adjustment: e.target.value,
                    }))
                  }
                  className="pl-7"
                />
              </div>
              {adjustState.user && (
                <p className="text-xs text-muted-foreground">
                  Current balance:{" "}
                  {bankingStore.formatCurrency(adjustState.user.balance)}
                </p>
              )}
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                data-ocid="admin.adjust.cancel_button"
                onClick={() =>
                  setAdjustState({
                    user: null,
                    adjustment: "",
                    isLoading: false,
                  })
                }
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                data-ocid="admin.adjust.submit_button"
                disabled={adjustState.isLoading}
                onClick={handleAdjust}
                className="flex-1 bg-brand hover:bg-brand/90 text-brand-foreground"
              >
                {adjustState.isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Apply"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
