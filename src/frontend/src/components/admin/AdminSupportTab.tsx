import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { CheckCircle, Send } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { type Conversation, bankingStore } from "../../store/bankingStore";

const PRIORITY_COLORS = {
  low: "border-muted-foreground/30 text-muted-foreground bg-muted/20",
  medium: "border-warning/30 text-warning bg-warning/10",
  high: "border-destructive/30 text-destructive bg-destructive/10",
};

const STATUS_COLORS = {
  open: "border-brand/30 text-brand bg-brand/10",
  pending: "border-warning/30 text-warning bg-warning/10",
  resolved: "border-success/30 text-success bg-success/10",
};

export function AdminSupportTab({
  conversations,
  onRefresh,
}: { conversations: Conversation[]; onRefresh: () => void }) {
  const [selected, setSelected] = useState<Conversation | null>(null);
  const [reply, setReply] = useState("");

  function handleSelect(conv: Conversation) {
    const latest = bankingStore
      .getConversations()
      .find((c) => c.id === conv.id);
    setSelected(latest || conv);
  }

  function handleSend() {
    if (!reply.trim() || !selected) return;
    bankingStore.sendChatMessage(
      selected.id,
      "admin",
      "Admin Support",
      reply.trim(),
      true,
    );
    const updated = bankingStore
      .getConversations()
      .find((c) => c.id === selected.id);
    setSelected(updated || selected);
    setReply("");
    onRefresh();
    toast.success("Reply sent");
  }

  function handleResolve(convId: string) {
    bankingStore.resolveConversation(convId);
    onRefresh();
    if (selected?.id === convId) {
      const updated = bankingStore
        .getConversations()
        .find((c) => c.id === convId);
      setSelected(updated || null);
    }
    toast.success("Conversation resolved");
  }

  function handlePriority(convId: string, priority: "low" | "medium" | "high") {
    bankingStore.updateConversationPriority(convId, priority);
    onRefresh();
    if (selected?.id === convId) {
      const updated = bankingStore
        .getConversations()
        .find((c) => c.id === convId);
      setSelected(updated || null);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-[500px]">
      <div
        className="lg:col-span-1 bg-card border border-border rounded-xl overflow-hidden"
        data-ocid="admin.support.list"
      >
        <div className="px-4 py-3 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">
            Conversations ({conversations.length})
          </h3>
        </div>
        <ScrollArea className="h-[450px]">
          {conversations.length === 0 ? (
            <div
              data-ocid="admin.support.empty_state"
              className="text-center py-12 text-muted-foreground text-sm"
            >
              No conversations
            </div>
          ) : (
            conversations.map((conv, i) => (
              <button
                key={conv.id}
                type="button"
                data-ocid={`admin.support.item.${i + 1}`}
                onClick={() => handleSelect(conv)}
                className={cn(
                  "w-full text-left px-4 py-3 border-b border-border/50 last:border-0 hover:bg-accent/30 transition-colors",
                  selected?.id === conv.id && "bg-accent/40",
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-brand/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-brand">
                        {conv.username[0].toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {conv.username}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {conv.messages[
                          conv.messages.length - 1
                        ]?.message?.slice(0, 35)}
                        ...
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 items-end">
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[10px] rounded-full",
                        STATUS_COLORS[conv.status],
                      )}
                    >
                      {conv.status}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[10px] rounded-full",
                        PRIORITY_COLORS[conv.priority],
                      )}
                    >
                      {conv.priority}
                    </Badge>
                  </div>
                </div>
              </button>
            ))
          )}
        </ScrollArea>
      </div>

      <div className="lg:col-span-2 bg-card border border-border rounded-xl overflow-hidden flex flex-col">
        {!selected ? (
          <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
            Select a conversation to view
          </div>
        ) : (
          <>
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-brand/20 flex items-center justify-center">
                  <span className="text-xs font-bold text-brand">
                    {selected.username[0].toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {selected.username}
                  </p>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[10px] rounded-full",
                      STATUS_COLORS[selected.status],
                    )}
                  >
                    {selected.status}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Select
                  value={selected.priority}
                  onValueChange={(v) =>
                    handlePriority(selected.id, v as "low" | "medium" | "high")
                  }
                >
                  <SelectTrigger
                    data-ocid="admin.support.priority.select"
                    className="w-28 h-7 text-xs rounded-lg"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
                {selected.status !== "resolved" && (
                  <Button
                    size="sm"
                    variant="outline"
                    data-ocid="admin.support.resolve_button"
                    onClick={() => handleResolve(selected.id)}
                    className="h-7 text-xs rounded-lg text-success border-success/30 hover:bg-success/10"
                  >
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Resolve
                  </Button>
                )}
              </div>
            </div>

            <ScrollArea className="flex-1 px-4 py-3">
              <div className="space-y-3">
                {selected.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex items-end gap-2",
                      msg.isSupport ? "justify-start" : "justify-end",
                    )}
                  >
                    {msg.isSupport && (
                      <div className="w-6 h-6 rounded-full bg-brand/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-[10px] font-bold text-brand">
                          {msg.senderName[0]}
                        </span>
                      </div>
                    )}
                    <div
                      className={cn(
                        "px-3 py-2 rounded-xl max-w-xs",
                        msg.isSupport
                          ? "bg-secondary rounded-tl-sm"
                          : "bg-brand/20 rounded-tr-sm",
                      )}
                    >
                      <p className="text-xs text-foreground">{msg.message}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">
                        {msg.senderName} ·{" "}
                        {formatDistanceToNow(new Date(msg.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {selected.status !== "resolved" && (
              <div className="px-4 py-3 border-t border-border">
                <div className="flex gap-2">
                  <Input
                    data-ocid="admin.support.reply.input"
                    placeholder="Type a reply..."
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    className="text-sm rounded-xl"
                  />
                  <Button
                    size="icon"
                    data-ocid="admin.support.send_button"
                    onClick={handleSend}
                    disabled={!reply.trim()}
                    className="w-9 h-9 bg-brand hover:bg-brand/90 text-brand-foreground rounded-xl"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
