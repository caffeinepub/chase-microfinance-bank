import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import {
  type Conversation,
  type Notification,
  type SavingsGoal,
  type Transaction,
  bankingStore,
} from "../store/bankingStore";
import { useAuth } from "./AuthContext";

interface BankingContextType {
  balance: number;
  transactions: Transaction[];
  savingsGoals: SavingsGoal[];
  notifications: Notification[];
  conversations: Conversation[];
  monthlyIncome: number;
  monthlyExpenses: number;
  accountNumber: string;
  unreadCount: number;
  refreshAll: () => void;
  deposit: (amount: number) => Promise<{ success: boolean; message: string }>;
  withdraw: (amount: number) => Promise<{ success: boolean; message: string }>;
  transfer: (
    to: string,
    amount: number,
    note: string,
  ) => Promise<{ success: boolean; message: string }>;
  addSavingsGoal: (
    name: string,
    target: number,
    initial: number,
    color: string,
    icon: string,
  ) => Promise<{ success: boolean; message: string }>;
  contributeToGoal: (
    goalId: string,
    amount: number,
  ) => Promise<{ success: boolean; message: string }>;
  deleteSavingsGoal: (goalId: string) => void;
  markNotificationsRead: () => void;
}

const BankingContext = createContext<BankingContextType | null>(null);

export function BankingProvider({ children }: { children: ReactNode }) {
  const { session, refreshUser } = useAuth();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [monthlyExpenses, setMonthlyExpenses] = useState(0);
  const [accountNumber, setAccountNumber] = useState("");

  const refreshAll = useCallback(() => {
    if (!session) return;
    const user = bankingStore.getUser(session.username);
    if (!user) return;
    setBalance(user.balance);
    setTransactions(user.transactions);
    setSavingsGoals(user.savingsGoals);
    setNotifications(user.notifications);
    setMonthlyIncome(user.monthlyIncome);
    setMonthlyExpenses(user.monthlyExpenses);
    setAccountNumber(user.accountNumber);
    setConversations(bankingStore.getConversations());
    refreshUser();
  }, [session, refreshUser]);

  useEffect(() => {
    if (session) refreshAll();
  }, [session, refreshAll]);

  // Poll for notifications every 10 seconds
  useEffect(() => {
    if (!session) return;
    const interval = setInterval(() => {
      const user = bankingStore.getUser(session.username);
      if (user) {
        setNotifications([...user.notifications]);
        // Simulate occasional new notification (5% chance)
        if (Math.random() < 0.05) {
          const alerts = [
            "Your account statement is ready to view.",
            "Don't forget to review your monthly budget.",
            "Tip: Set up automatic savings goals to build wealth faster.",
          ];
          const store = bankingStore.getStore();
          const u = store.users[session.username];
          if (u) {
            u.notifications.unshift({
              id: bankingStore.generateId(),
              title: "Account Update",
              message: alerts[Math.floor(Math.random() * alerts.length)],
              type: "info",
              read: false,
              createdAt: new Date().toISOString(),
            });
            setNotifications([...u.notifications]);
          }
        }
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [session]);

  const deposit = useCallback(
    async (amount: number) => {
      if (!session) return { success: false, message: "Not authenticated" };
      const result = bankingStore.deposit(session.username, amount);
      if (result.success) refreshAll();
      return result;
    },
    [session, refreshAll],
  );

  const withdraw = useCallback(
    async (amount: number) => {
      if (!session) return { success: false, message: "Not authenticated" };
      const result = bankingStore.withdraw(session.username, amount);
      if (result.success) refreshAll();
      return result;
    },
    [session, refreshAll],
  );

  const transfer = useCallback(
    async (to: string, amount: number, note: string) => {
      if (!session) return { success: false, message: "Not authenticated" };
      const result = bankingStore.transfer(session.username, to, amount, note);
      if (result.success) refreshAll();
      return result;
    },
    [session, refreshAll],
  );

  const addSavingsGoal = useCallback(
    async (
      name: string,
      target: number,
      initial: number,
      color: string,
      icon: string,
    ) => {
      if (!session) return { success: false, message: "Not authenticated" };
      const user = bankingStore.getUser(session.username);
      if (!user) return { success: false, message: "User not found" };
      if (initial > 0 && user.balance < initial)
        return {
          success: false,
          message: "Insufficient funds for initial deposit",
        };
      bankingStore.addSavingsGoal(session.username, {
        name,
        targetAmount: target,
        currentAmount: initial,
        color,
        icon,
      });
      refreshAll();
      return { success: true, message: "Savings goal created" };
    },
    [session, refreshAll],
  );

  const contributeToGoal = useCallback(
    async (goalId: string, amount: number) => {
      if (!session) return { success: false, message: "Not authenticated" };
      const result = bankingStore.contributeToGoal(
        session.username,
        goalId,
        amount,
      );
      if (result.success) refreshAll();
      return result;
    },
    [session, refreshAll],
  );

  const deleteSavingsGoalFn = useCallback(
    (goalId: string) => {
      if (!session) return;
      bankingStore.deleteSavingsGoal(session.username, goalId);
      refreshAll();
    },
    [session, refreshAll],
  );

  const markNotificationsRead = useCallback(() => {
    if (!session) return;
    bankingStore.markNotificationsRead(session.username);
    refreshAll();
  }, [session, refreshAll]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <BankingContext.Provider
      value={{
        balance,
        transactions,
        savingsGoals,
        notifications,
        conversations,
        monthlyIncome,
        monthlyExpenses,
        accountNumber,
        unreadCount,
        refreshAll,
        deposit,
        withdraw,
        transfer,
        addSavingsGoal,
        contributeToGoal,
        deleteSavingsGoal: deleteSavingsGoalFn,
        markNotificationsRead,
      }}
    >
      {children}
    </BankingContext.Provider>
  );
}

export function useBanking(): BankingContextType {
  const ctx = useContext(BankingContext);
  if (!ctx) throw new Error("useBanking must be used within BankingProvider");
  return ctx;
}
