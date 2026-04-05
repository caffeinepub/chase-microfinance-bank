import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  ArrowLeftRight,
  ChevronLeft,
  ChevronRight,
  Download,
  Filter,
} from "lucide-react";
import { ArrowDownLeft, ArrowUpRight, RefreshCcw } from "lucide-react";
import { motion } from "motion/react";
import type React from "react";
import { useMemo, useState } from "react";
import { useBanking } from "../contexts/BankingContext";
import {
  type Transaction,
  type TransactionType,
  bankingStore,
} from "../store/bankingStore";

const TYPE_ICONS: Record<TransactionType, React.ReactNode> = {
  deposit: <ArrowDownLeft className="w-4 h-4" />,
  withdrawal: <ArrowUpRight className="w-4 h-4" />,
  transfer_in: <ArrowDownLeft className="w-4 h-4" />,
  transfer_out: <ArrowUpRight className="w-4 h-4" />,
  payment: <RefreshCcw className="w-4 h-4" />,
};

const TYPE_COLORS: Record<TransactionType, string> = {
  deposit: "bg-success/15 text-success",
  withdrawal: "bg-destructive/15 text-destructive",
  transfer_in: "bg-brand/15 text-brand",
  transfer_out: "bg-chart-4/15 text-chart-4",
  payment: "bg-muted text-muted-foreground",
};

const PAGE_SIZE = 10;

export default function TransactionsPage() {
  const { transactions } = useBanking();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let result = [...transactions];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (tx) =>
          tx.description.toLowerCase().includes(q) ||
          tx.category.toLowerCase().includes(q) ||
          (tx.counterparty?.toLowerCase().includes(q) ?? false),
      );
    }
    if (typeFilter !== "all") {
      result = result.filter((tx) => tx.type === typeFilter);
    }
    return result;
  }, [transactions, search, typeFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handleFilterChange(value: string) {
    setTypeFilter(value);
    setPage(1);
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-chart-2/15 flex items-center justify-center">
            <ArrowLeftRight className="w-5 h-5 text-chart-2" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Transactions</h1>
            <p className="text-sm text-muted-foreground">
              {transactions.length} total transactions
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          data-ocid="transactions.export.button"
          className="gap-2 rounded-xl"
          onClick={() => alert("Export feature coming soon!")}
        >
          <Download className="w-4 h-4" />
          Export
        </Button>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex flex-wrap gap-3"
      >
        <div className="relative flex-1 min-w-48">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            data-ocid="transactions.search_input"
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-9 rounded-xl"
          />
        </div>
        <Select value={typeFilter} onValueChange={handleFilterChange}>
          <SelectTrigger
            data-ocid="transactions.type.select"
            className="w-44 rounded-xl"
          >
            <SelectValue placeholder="All Types" />
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
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="bg-card border border-border rounded-xl shadow-card overflow-hidden"
        data-ocid="transactions.table"
      >
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground text-xs uppercase tracking-wide">
                Type
              </TableHead>
              <TableHead className="text-muted-foreground text-xs uppercase tracking-wide">
                Description
              </TableHead>
              <TableHead className="text-muted-foreground text-xs uppercase tracking-wide hidden md:table-cell">
                Date
              </TableHead>
              <TableHead className="text-muted-foreground text-xs uppercase tracking-wide text-right">
                Amount
              </TableHead>
              <TableHead className="text-muted-foreground text-xs uppercase tracking-wide hidden sm:table-cell">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5}>
                  <div
                    data-ocid="transactions.empty_state"
                    className="text-center py-12 text-muted-foreground text-sm"
                  >
                    No transactions found
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((tx, i) => (
                <TableRow
                  key={tx.id}
                  data-ocid={`transactions.row.${i + 1}`}
                  className="border-border hover:bg-accent/30 transition-colors"
                >
                  <TableCell>
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${TYPE_COLORS[tx.type]}`}
                    >
                      {TYPE_ICONS[tx.type]}
                    </div>
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
                  <TableCell className="text-sm text-muted-foreground hidden md:table-cell">
                    {format(new Date(tx.date), "MMM d, yyyy")}
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
                  <TableCell className="hidden sm:table-cell">
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[10px] font-medium rounded-full border",
                        tx.status === "completed"
                          ? "border-success/30 text-success bg-success/10"
                          : tx.status === "pending"
                            ? "border-warning/30 text-warning bg-warning/10"
                            : "border-destructive/30 text-destructive bg-destructive/10",
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
      </motion.div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Showing {(page - 1) * PAGE_SIZE + 1}–
            {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              data-ocid="transactions.pagination_prev"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-8 h-8 rounded-lg"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Button
                key={p}
                variant={p === page ? "default" : "outline"}
                size="icon"
                onClick={() => setPage(p)}
                className={cn(
                  "w-8 h-8 rounded-lg",
                  p === page && "bg-brand text-brand-foreground",
                )}
              >
                {p}
              </Button>
            ))}
            <Button
              variant="outline"
              size="icon"
              data-ocid="transactions.pagination_next"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-8 h-8 rounded-lg"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
