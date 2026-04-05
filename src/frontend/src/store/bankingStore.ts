// Banking Demo Store - manages all demo banking data in memory + localStorage

export type TransactionType =
  | "deposit"
  | "withdrawal"
  | "transfer_in"
  | "transfer_out"
  | "payment";
export type TransactionStatus = "completed" | "pending" | "failed";

export interface Transaction {
  id: string;
  type: TransactionType;
  description: string;
  amount: number;
  date: string;
  status: TransactionStatus;
  category: string;
  counterparty?: string;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  createdAt: string;
  color: string;
  icon: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "transaction" | "security" | "info" | "alert";
  read: boolean;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  isSupport: boolean;
  message: string;
  createdAt: string;
  isRead: boolean;
}

export interface Conversation {
  id: string;
  userId: string;
  username: string;
  status: "open" | "resolved" | "pending";
  priority: "low" | "medium" | "high";
  createdAt: string;
  lastMessageAt: string;
  messages: ChatMessage[];
}

export interface BankUser {
  username: string;
  passwordHash: string;
  role: "admin" | "user";
  balance: number;
  accountNumber: string;
  isFrozen: boolean;
  isFlagged: boolean;
  createdAt: string;
  transactions: Transaction[];
  savingsGoals: SavingsGoal[];
  notifications: Notification[];
  monthlyIncome: number;
  monthlyExpenses: number;
}

export interface BankStore {
  users: Record<string, BankUser>;
  conversations: Conversation[];
}

const STORE_KEY = "chase_bank_store";

function generateId(): string {
  return Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
}

function generateAccountNumber(): string {
  return Array.from(
    { length: 16 },
    (_, i) =>
      (i > 0 && i % 4 === 0 ? " " : "") + Math.floor(Math.random() * 10),
  ).join("");
}

function hashPassword(password: string): string {
  // Simple hash for demo - not for production
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return `demo_${Math.abs(hash).toString(16)}`;
}

function daysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

function createDemoTransactions(): Transaction[] {
  return [
    {
      id: generateId(),
      type: "deposit",
      description: "Salary Deposit - Chase Corp",
      amount: 8500,
      date: daysAgo(2),
      status: "completed",
      category: "Income",
      counterparty: "Chase Corp",
    },
    {
      id: generateId(),
      type: "payment",
      description: "Netflix Subscription",
      amount: -15.99,
      date: daysAgo(3),
      status: "completed",
      category: "Entertainment",
      counterparty: "Netflix",
    },
    {
      id: generateId(),
      type: "payment",
      description: "Whole Foods Market",
      amount: -127.43,
      date: daysAgo(4),
      status: "completed",
      category: "Groceries",
      counterparty: "Whole Foods",
    },
    {
      id: generateId(),
      type: "transfer_out",
      description: "Transfer to Sarah Johnson",
      amount: -500,
      date: daysAgo(5),
      status: "completed",
      category: "Transfer",
      counterparty: "sarah_j",
    },
    {
      id: generateId(),
      type: "transfer_in",
      description: "Transfer from Michael Chen",
      amount: 250,
      date: daysAgo(6),
      status: "completed",
      category: "Transfer",
      counterparty: "mike_chen",
    },
    {
      id: generateId(),
      type: "payment",
      description: "Amazon Prime",
      amount: -14.99,
      date: daysAgo(8),
      status: "completed",
      category: "Shopping",
      counterparty: "Amazon",
    },
    {
      id: generateId(),
      type: "withdrawal",
      description: "ATM Withdrawal - Downtown Branch",
      amount: -200,
      date: daysAgo(9),
      status: "completed",
      category: "Cash",
    },
    {
      id: generateId(),
      type: "payment",
      description: "Starbucks Coffee",
      amount: -6.75,
      date: daysAgo(10),
      status: "completed",
      category: "Food & Drink",
      counterparty: "Starbucks",
    },
    {
      id: generateId(),
      type: "deposit",
      description: "Freelance Payment - Design Work",
      amount: 1200,
      date: daysAgo(12),
      status: "completed",
      category: "Income",
      counterparty: "DesignCo",
    },
    {
      id: generateId(),
      type: "payment",
      description: "Spotify Premium",
      amount: -9.99,
      date: daysAgo(14),
      status: "completed",
      category: "Entertainment",
      counterparty: "Spotify",
    },
  ];
}

function createDemoSavingsGoals(): SavingsGoal[] {
  return [
    {
      id: generateId(),
      name: "Dream Vacation - Maldives",
      targetAmount: 8000,
      currentAmount: 3250,
      createdAt: daysAgo(45),
      color: "teal",
      icon: "Plane",
    },
    {
      id: generateId(),
      name: "Emergency Fund",
      targetAmount: 25000,
      currentAmount: 18500,
      createdAt: daysAgo(90),
      color: "blue",
      icon: "Shield",
    },
    {
      id: generateId(),
      name: "New MacBook Pro",
      targetAmount: 3000,
      currentAmount: 1890,
      createdAt: daysAgo(30),
      color: "purple",
      icon: "Laptop",
    },
  ];
}

function createDemoNotifications(): Notification[] {
  return [
    {
      id: generateId(),
      title: "Salary Received",
      message: "Your salary of $8,500.00 has been deposited.",
      type: "transaction",
      read: false,
      createdAt: daysAgo(2),
    },
    {
      id: generateId(),
      title: "Transfer Sent",
      message: "You sent $500.00 to Sarah Johnson.",
      type: "transaction",
      read: false,
      createdAt: daysAgo(5),
    },
    {
      id: generateId(),
      title: "Security Alert",
      message: "New device logged in from New York, NY.",
      type: "security",
      read: true,
      createdAt: daysAgo(7),
    },
  ];
}

function createAdminUser(): BankUser {
  return {
    username: "admin",
    passwordHash: hashPassword("admin123"),
    role: "admin",
    balance: 9999999,
    accountNumber: generateAccountNumber(),
    isFrozen: false,
    isFlagged: false,
    createdAt: daysAgo(365),
    transactions: createDemoTransactions(),
    savingsGoals: [],
    notifications: [],
    monthlyIncome: 50000,
    monthlyExpenses: 12000,
  };
}

function createDemoUsers(): Record<string, BankUser> {
  const users: Record<string, BankUser> = {};

  const demoUsernames = ["sarah_j", "mike_chen", "emma_davis", "alex_kim"];
  const demoPasswords = ["pass123", "pass123", "pass123", "pass123"];
  const demoBalances = [45230.5, 128750.0, 22100.75, 87340.25];

  for (let i = 0; i < demoUsernames.length; i++) {
    const username = demoUsernames[i];
    users[username] = {
      username,
      passwordHash: hashPassword(demoPasswords[i]),
      role: "user",
      balance: demoBalances[i],
      accountNumber: generateAccountNumber(),
      isFrozen: false,
      isFlagged: i === 3,
      createdAt: daysAgo(30 + i * 10),
      transactions: createDemoTransactions().slice(0, 5),
      savingsGoals: i === 0 ? createDemoSavingsGoals().slice(0, 1) : [],
      notifications: [],
      monthlyIncome: 5000 + i * 1000,
      monthlyExpenses: 2000 + i * 500,
    };
  }

  users.admin = createAdminUser();

  return users;
}

function createDemoConversations(
  users: Record<string, BankUser>,
): Conversation[] {
  const usernames = Object.keys(users).filter((u) => u !== "admin");
  const conversations: Conversation[] = [];

  if (usernames.length > 0) {
    const conv1: Conversation = {
      id: generateId(),
      userId: usernames[0],
      username: usernames[0],
      status: "open",
      priority: "medium",
      createdAt: daysAgo(1),
      lastMessageAt: daysAgo(0),
      messages: [
        {
          id: generateId(),
          conversationId: "",
          senderId: usernames[0],
          senderName: usernames[0],
          isSupport: false,
          message: "Hi, I have a question about my recent transaction.",
          createdAt: daysAgo(1),
          isRead: true,
        },
        {
          id: generateId(),
          conversationId: "",
          senderId: "support",
          senderName: "Chase Support",
          isSupport: true,
          message:
            "Hello! I'd be happy to help. Could you please provide more details?",
          createdAt: daysAgo(0),
          isRead: true,
        },
      ],
    };
    for (const m of conv1.messages) {
      m.conversationId = conv1.id;
    }
    conversations.push(conv1);
  }

  if (usernames.length > 1) {
    const conv2: Conversation = {
      id: generateId(),
      userId: usernames[1],
      username: usernames[1],
      status: "pending",
      priority: "high",
      createdAt: daysAgo(2),
      lastMessageAt: daysAgo(2),
      messages: [
        {
          id: generateId(),
          conversationId: "",
          senderId: usernames[1],
          senderName: usernames[1],
          isSupport: false,
          message:
            "My account seems to have an issue with international transfers.",
          createdAt: daysAgo(2),
          isRead: false,
        },
      ],
    };
    for (const m of conv2.messages) {
      m.conversationId = conv2.id;
    }
    conversations.push(conv2);
  }

  return conversations;
}

function initializeStore(): BankStore {
  const users = createDemoUsers();
  return {
    users,
    conversations: createDemoConversations(users),
  };
}

function loadStore(): BankStore {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) {
      return JSON.parse(raw) as BankStore;
    }
  } catch {
    // ignore
  }
  const store = initializeStore();
  saveStore(store);
  return store;
}

function saveStore(store: BankStore): void {
  localStorage.setItem(STORE_KEY, JSON.stringify(store));
}

// Public API
export const bankingStore = {
  getStore(): BankStore {
    return loadStore();
  },

  getUser(username: string): BankUser | null {
    const store = loadStore();
    return store.users[username] || null;
  },

  getAllUsers(): BankUser[] {
    const store = loadStore();
    return Object.values(store.users);
  },

  validateLogin(username: string, password: string): BankUser | null {
    const user = this.getUser(username);
    if (!user) return null;
    if (user.passwordHash !== hashPassword(password)) return null;
    if (user.isFrozen) return null;
    return user;
  },

  registerUser(username: string, password: string): BankUser | null {
    const store = loadStore();
    if (store.users[username]) return null; // already exists

    const newUser: BankUser = {
      username,
      passwordHash: hashPassword(password),
      role: "user",
      balance: 1000000,
      accountNumber: generateAccountNumber(),
      isFrozen: false,
      isFlagged: false,
      createdAt: new Date().toISOString(),
      transactions: createDemoTransactions(),
      savingsGoals: createDemoSavingsGoals(),
      notifications: createDemoNotifications(),
      monthlyIncome: 9800,
      monthlyExpenses: 3241.15,
    };

    store.users[username] = newUser;
    saveStore(store);
    return newUser;
  },

  updateBalance(username: string, newBalance: number): void {
    const store = loadStore();
    if (store.users[username]) {
      store.users[username].balance = newBalance;
      saveStore(store);
    }
  },

  addTransaction(
    username: string,
    transaction: Omit<Transaction, "id">,
  ): Transaction {
    const store = loadStore();
    const tx: Transaction = { ...transaction, id: generateId() };
    if (store.users[username]) {
      store.users[username].transactions.unshift(tx);
      // Add notification
      const notif: Notification = {
        id: generateId(),
        title:
          transaction.type === "deposit"
            ? "Deposit Received"
            : transaction.type === "withdrawal"
              ? "Withdrawal Processed"
              : "Transfer Completed",
        message: `${transaction.description}: $${Math.abs(transaction.amount).toFixed(2)}`,
        type: "transaction",
        read: false,
        createdAt: new Date().toISOString(),
      };
      store.users[username].notifications.unshift(notif);
      saveStore(store);
    }
    return tx;
  },

  transfer(
    fromUsername: string,
    toUsername: string,
    amount: number,
    note: string,
  ): { success: boolean; message: string } {
    const store = loadStore();
    const sender = store.users[fromUsername];
    const receiver = store.users[toUsername];

    if (!sender) return { success: false, message: "Sender not found" };
    if (!receiver) return { success: false, message: "Recipient not found" };
    if (sender.balance < amount)
      return { success: false, message: "Insufficient funds" };
    if (receiver.isFrozen)
      return { success: false, message: "Recipient account is frozen" };

    const now = new Date().toISOString();
    sender.balance -= amount;
    receiver.balance += amount;

    const outTx: Transaction = {
      id: generateId(),
      type: "transfer_out",
      description: note || `Transfer to ${toUsername}`,
      amount: -amount,
      date: now,
      status: "completed",
      category: "Transfer",
      counterparty: toUsername,
    };

    const inTx: Transaction = {
      id: generateId(),
      type: "transfer_in",
      description: note || `Transfer from ${fromUsername}`,
      amount: amount,
      date: now,
      status: "completed",
      category: "Transfer",
      counterparty: fromUsername,
    };

    sender.transactions.unshift(outTx);
    receiver.transactions.unshift(inTx);

    // Notifications
    sender.notifications.unshift({
      id: generateId(),
      title: "Transfer Sent",
      message: `You sent $${amount.toFixed(2)} to ${toUsername}.`,
      type: "transaction",
      read: false,
      createdAt: now,
    });
    receiver.notifications.unshift({
      id: generateId(),
      title: "Transfer Received",
      message: `You received $${amount.toFixed(2)} from ${fromUsername}.`,
      type: "transaction",
      read: false,
      createdAt: now,
    });

    saveStore(store);
    return { success: true, message: "Transfer successful" };
  },

  deposit(
    username: string,
    amount: number,
  ): { success: boolean; message: string } {
    const store = loadStore();
    const user = store.users[username];
    if (!user) return { success: false, message: "User not found" };

    user.balance += amount;
    const tx: Transaction = {
      id: generateId(),
      type: "deposit",
      description: "Deposit",
      amount: amount,
      date: new Date().toISOString(),
      status: "completed",
      category: "Deposit",
    };
    user.transactions.unshift(tx);
    user.monthlyIncome += amount;
    user.notifications.unshift({
      id: generateId(),
      title: "Deposit Successful",
      message: `$${amount.toFixed(2)} has been deposited to your account.`,
      type: "transaction",
      read: false,
      createdAt: new Date().toISOString(),
    });
    saveStore(store);
    return { success: true, message: "Deposit successful" };
  },

  withdraw(
    username: string,
    amount: number,
  ): { success: boolean; message: string } {
    const store = loadStore();
    const user = store.users[username];
    if (!user) return { success: false, message: "User not found" };
    if (user.balance < amount)
      return { success: false, message: "Insufficient funds" };

    user.balance -= amount;
    const tx: Transaction = {
      id: generateId(),
      type: "withdrawal",
      description: "Withdrawal",
      amount: -amount,
      date: new Date().toISOString(),
      status: "completed",
      category: "Cash",
    };
    user.transactions.unshift(tx);
    user.monthlyExpenses += amount;
    user.notifications.unshift({
      id: generateId(),
      title: "Withdrawal Processed",
      message: `$${amount.toFixed(2)} has been withdrawn from your account.`,
      type: "transaction",
      read: false,
      createdAt: new Date().toISOString(),
    });
    saveStore(store);
    return { success: true, message: "Withdrawal successful" };
  },

  addSavingsGoal(
    username: string,
    goal: Omit<SavingsGoal, "id" | "createdAt">,
  ): SavingsGoal {
    const store = loadStore();
    const newGoal: SavingsGoal = {
      ...goal,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    if (store.users[username]) {
      store.users[username].savingsGoals.push(newGoal);
      if (goal.currentAmount > 0) {
        store.users[username].balance -= goal.currentAmount;
      }
      saveStore(store);
    }
    return newGoal;
  },

  contributeToGoal(
    username: string,
    goalId: string,
    amount: number,
  ): { success: boolean; message: string } {
    const store = loadStore();
    const user = store.users[username];
    if (!user) return { success: false, message: "User not found" };
    if (user.balance < amount)
      return { success: false, message: "Insufficient funds" };

    const goal = user.savingsGoals.find((g) => g.id === goalId);
    if (!goal) return { success: false, message: "Goal not found" };

    user.balance -= amount;
    goal.currentAmount = Math.min(
      goal.currentAmount + amount,
      goal.targetAmount,
    );
    saveStore(store);
    return { success: true, message: "Contribution added" };
  },

  deleteSavingsGoal(username: string, goalId: string): void {
    const store = loadStore();
    if (store.users[username]) {
      const goal = store.users[username].savingsGoals.find(
        (g) => g.id === goalId,
      );
      if (goal) {
        store.users[username].balance += goal.currentAmount;
        store.users[username].savingsGoals = store.users[
          username
        ].savingsGoals.filter((g) => g.id !== goalId);
        saveStore(store);
      }
    }
  },

  markNotificationsRead(username: string): void {
    const store = loadStore();
    if (store.users[username]) {
      for (const n of store.users[username].notifications) {
        n.read = true;
      }
      saveStore(store);
    }
  },

  getUnreadNotificationCount(username: string): number {
    const user = this.getUser(username);
    if (!user) return 0;
    return user.notifications.filter((n) => !n.read).length;
  },

  // Chat
  getConversations(): Conversation[] {
    return loadStore().conversations;
  },

  getOrCreateConversation(username: string): Conversation {
    const store = loadStore();
    let conv = store.conversations.find(
      (c) => c.userId === username && c.status !== "resolved",
    );
    if (!conv) {
      conv = {
        id: generateId(),
        userId: username,
        username,
        status: "open",
        priority: "low",
        createdAt: new Date().toISOString(),
        lastMessageAt: new Date().toISOString(),
        messages: [],
      };
      store.conversations.push(conv);
      saveStore(store);
    }
    return conv;
  },

  sendChatMessage(
    conversationId: string,
    senderId: string,
    senderName: string,
    message: string,
    isSupport: boolean,
  ): ChatMessage {
    const store = loadStore();
    const conv = store.conversations.find((c) => c.id === conversationId);
    if (!conv) throw new Error("Conversation not found");

    const msg: ChatMessage = {
      id: generateId(),
      conversationId,
      senderId,
      senderName,
      isSupport,
      message,
      createdAt: new Date().toISOString(),
      isRead: false,
    };
    conv.messages.push(msg);
    conv.lastMessageAt = msg.createdAt;
    if (conv.status === "resolved") conv.status = "open";
    saveStore(store);
    return msg;
  },

  resolveConversation(conversationId: string): void {
    const store = loadStore();
    const conv = store.conversations.find((c) => c.id === conversationId);
    if (conv) {
      conv.status = "resolved";
      saveStore(store);
    }
  },

  updateConversationPriority(
    conversationId: string,
    priority: "low" | "medium" | "high",
  ): void {
    const store = loadStore();
    const conv = store.conversations.find((c) => c.id === conversationId);
    if (conv) {
      conv.priority = priority;
      saveStore(store);
    }
  },

  // Admin
  freezeUser(username: string, frozen: boolean): void {
    const store = loadStore();
    if (store.users[username]) {
      store.users[username].isFrozen = frozen;
      saveStore(store);
    }
  },

  flagUser(username: string, flagged: boolean): void {
    const store = loadStore();
    if (store.users[username]) {
      store.users[username].isFlagged = flagged;
      saveStore(store);
    }
  },

  adjustBalance(username: string, adjustment: number): void {
    const store = loadStore();
    if (store.users[username]) {
      store.users[username].balance = Math.max(
        0,
        store.users[username].balance + adjustment,
      );
      saveStore(store);
    }
  },

  // Performance chart data
  generatePerformanceData(
    balance: number,
  ): Array<{ date: string; balance: number }> {
    const data: Array<{ date: string; balance: number }> = [];
    let runningBalance = balance * 0.92;
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const change = (Math.random() - 0.42) * balance * 0.01;
      runningBalance = Math.max(runningBalance + change, balance * 0.85);
      data.push({
        date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        balance: Math.round(runningBalance),
      });
    }
    // Last point = current balance
    data[data.length - 1].balance = Math.round(balance);
    return data;
  },

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  },

  generateId,
};
