import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { ShieldCheck } from "lucide-react";
import { motion } from "motion/react";
import React, { useState, useCallback } from "react";
import { AdminAnalyticsTab } from "../components/admin/AdminAnalyticsTab";
import { AdminSupportTab } from "../components/admin/AdminSupportTab";
import { AdminTransactionsTab } from "../components/admin/AdminTransactionsTab";
import { AdminUsersTab } from "../components/admin/AdminUsersTab";
import { useAuth } from "../contexts/AuthContext";
import {
  type BankUser,
  type Conversation,
  bankingStore,
} from "../store/bankingStore";

export default function AdminPage() {
  const { isAdmin } = useAuth();
  const [users, setUsers] = useState<BankUser[]>(() =>
    bankingStore.getAllUsers(),
  );
  const [conversations, setConversations] = useState<Conversation[]>(() =>
    bankingStore.getConversations(),
  );

  const refresh = useCallback(() => {
    setUsers(bankingStore.getAllUsers());
    setConversations(bankingStore.getConversations());
  }, []);

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center gap-3"
      >
        <div className="w-9 h-9 rounded-xl bg-destructive/15 flex items-center justify-center">
          <ShieldCheck className="w-5 h-5 text-destructive" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Admin Panel</h1>
          <p className="text-sm text-muted-foreground">
            System administration and monitoring
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <Tabs defaultValue="users" data-ocid="admin.tabs">
          <TabsList className="bg-muted rounded-xl mb-6">
            <TabsTrigger
              value="users"
              data-ocid="admin.users.tab"
              className="rounded-lg"
            >
              Users ({users.length})
            </TabsTrigger>
            <TabsTrigger
              value="transactions"
              data-ocid="admin.transactions.tab"
              className="rounded-lg"
            >
              Transactions
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              data-ocid="admin.analytics.tab"
              className="rounded-lg"
            >
              Analytics
            </TabsTrigger>
            <TabsTrigger
              value="support"
              data-ocid="admin.support.tab"
              className="rounded-lg"
            >
              Support (
              {conversations.filter((c) => c.status !== "resolved").length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <AdminUsersTab users={users} onRefresh={refresh} />
          </TabsContent>
          <TabsContent value="transactions">
            <AdminTransactionsTab users={users} />
          </TabsContent>
          <TabsContent value="analytics">
            <AdminAnalyticsTab users={users} conversations={conversations} />
          </TabsContent>
          <TabsContent value="support">
            <AdminSupportTab
              conversations={conversations}
              onRefresh={refresh}
            />
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
