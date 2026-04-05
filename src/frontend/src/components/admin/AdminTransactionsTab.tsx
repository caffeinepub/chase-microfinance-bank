import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  ArrowDownLeft,
  ArrowUpRight,
  RefreshCcw,
  Search as SearchIcon,
} from "lucide-react";
import React, { useState, useMemo } from "react";
import {
  type BankUser,
  type Transaction,
  bankingStore,
} from "../../store/bankingStore";

interface AdminTransactionsTabProps {
  users: BankUser[];
}

export function AdminTransactionsTab({ users }: AdminTransactionsTabProps) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const allTransactions = useMemo(() => {
    const txs: Array<Transaction & { username: string }> = [];
    for (const user of users) {
      for (const tx of user.transactions) {
        txs.push({ ...tx, username: user.username });
      }
    }
    return txs.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }, [users]);

  const filtered = useMemo(() => {
    let result = allTransactions;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (tx) =>
          tx.description.toLowerCase().includes(q) ||
          tx.username.toLowerCase().includes(q) ||
          tx.category.toLowerCase().includes(q),
      );
    }
    if (typeFilter !== "all") {
      result = result.filter((tx) => tx.type === typeFilter);
    }
    return result.slice(0, 50);
  }, [allTransactions, search, typeFilter]);

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            data-ocid="admin.transactions.search_input"
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 rounded-xl"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger
            data-ocid="admin.transactions.type.select"
            className="w-44 rounded-xl"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="deposit">Deposits</SelectItem>
            <SelectItem value="withdrawal">Withdrawals</SelectItem>
            <SelectItem value="transfer_in">Transfers In</SelectItem>
            <SelectItem value="transfer_out">Transfers Out</SelectItem>
            <SelectItem value="payment">Payments</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div
        className="bg-card border border-border rounded-xl overflow-hidden"
        data-ocid="admin.transactions.table"
      >
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-xs text-muted-foreground uppercase tracking-wide">
                User
              </TableHead>
              <TableHead className="text-xs text-muted-foreground uppercase tracking-wide">
                Description
              </TableHead>
              <TableHead className="text-xs text-muted-foreground uppercase tracking-wide hidden md:table-cell">
                Date
              </TableHead>
              <TableHead className="text-xs text-muted-foreground uppercase tracking-wide text-right">
                Amount
              </TableHead>
              <TableHead className="text-xs text-muted-foreground uppercase tracking-wide">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5}>
                  <div
                    data-ocid="admin.transactions.empty_state"
                    className="text-center py-8 text-muted-foreground text-sm"
                  >
                    No transactions found
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((tx, i) => (
                <TableRow
                  key={`${tx.username}-${tx.id}`}
                  data-ocid={`admin.transactions.row.${i + 1}`}
                  className="border-border hover:bg-accent/30"
                >
                  <TableCell>
                    <span className="text-xs font-medium text-brand">
                      {tx.username}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {tx.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {tx.category}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground hidden md:table-cell">
                    {format(new Date(tx.date), "MMM d, yyyy HH:mm")}
                  </TableCell>
                  <TableCell className="text-right">
                    <span
                      className={cn(
                        "text-sm font-semibold font-mono-data",
                        tx.amount > 0
                          ? "text-success"
                          : "text-muted-foreground",
                      )}
                    >
                      {tx.amount > 0 ? "+" : ""}
                      {bankingStore.formatCurrency(tx.amount)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[10px] rounded-full",
                        tx.status === "completed"
                          ? "border-success/30 text-success bg-success/10"
                          : "border-warning/30 text-warning bg-warning/10",
                      )}
                    >
                      {tx.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <p className="text-xs text-muted-foreground">
        Showing latest 50 transactions across all accounts
      </p>
    </div>
  );
}
