# Apex Digital Bank

## Current State
New project. Only scaffolded files exist (empty Motoko actor, no frontend logic).

## Requested Changes (Diff)

### Add
- Full authentication system: sign up, login, logout with session token (access + refresh pattern), password hashing
- On registration: auto-create bank account with $1,000,000 demo seed balance
- Role-based access control: `User` and `Admin` roles
- User dashboard: balance display, recent transactions, financial insights chart (line chart), account cards
- Fund transfer between users by username or account ID
- Deposit and withdraw (simulated)
- Savings goals tracker: create, name, set target amount, track progress
- Transaction history page with filters: date range, type, amount
- Real-time notifications via polling (transaction alerts)
- Live support chat system (Intercom-style): floating widget bottom-right, user starts conversation, sends messages, sees timestamps, chat history persisted
- Admin dashboard with tabs: Users, Transactions, Analytics, Support Panel
- Admin: user management (view all users, freeze/flag accounts, adjust balances)
- Admin: view all accounts and balances
- Admin: monitor all transactions across the platform
- Admin: live support panel (view all chats, reply to users, close/resolve, tag/prioritize)
- Admin: system analytics (total users, total funds, transaction volume, active chats)
- Dark/light mode toggle
- Responsive design for mobile and desktop

### Modify
- Empty Motoko actor: replace with full banking backend

### Remove
- Nothing existing to remove

## Implementation Plan

### Backend (Motoko)
1. Data models:
   - `User`: id, username, passwordHash, role (User/Admin), createdAt, isFrozen, isFlagged
   - `Account`: id, userId, balance, createdAt
   - `Transaction`: id, fromAccountId, toAccountId, amount, type (transfer/deposit/withdraw), timestamp, note
   - `SavingsGoal`: id, userId, name, targetAmount, currentAmount, createdAt
   - `ChatConversation`: id, userId, status (open/closed), priority, tags, createdAt
   - `ChatMessage`: id, conversationId, senderId, senderRole, content, timestamp
   - `Session`: token, userId, expiresAt
   - `Notification`: id, userId, message, isRead, timestamp
2. Auth endpoints: register, login, logout, refreshSession, validateSession
3. Account endpoints: getMyAccount, deposit, withdraw, transfer
4. Transaction endpoints: getMyTransactions (with filters), getAllTransactions (admin)
5. Savings endpoints: createGoal, getMyGoals, updateGoal, contributeToGoal, deleteGoal
6. Chat endpoints: startConversation, sendMessage, getMyConversation, getConversationMessages, getAllConversations (admin), replyAsAdmin, closeConversation, setConversationPriority, addTag
7. Admin endpoints: getAllUsers, freezeAccount, flagAccount, adjustBalance, getSystemStats
8. Notification endpoints: getMyNotifications, markNotificationsRead
9. Stable storage for all data using TrieMap/Array in stable vars
10. Role-based authorization checks on all sensitive calls
11. Input validation on all endpoints

### Frontend (React + TypeScript + Tailwind)
1. Auth context: stores session, user info, login/logout functions
2. Pages:
   - `/login` — Login form
   - `/signup` — Registration form
   - `/dashboard` — User dashboard with balance, charts, recent transactions, savings goals
   - `/transactions` — Full transaction history with filters
   - `/savings` — Savings goals management
   - `/admin` — Admin dashboard (tabs: Users, Transactions, Analytics, Support)
3. Components:
   - `BalanceCard`, `AccountCard`, `TransactionList`, `SavingsGoalCard`, `FinancialChart`
   - `TransferModal`, `DepositWithdrawModal`
   - `ChatWidget` (floating, bottom-right)
   - `AdminUsersTab`, `AdminTransactionsTab`, `AdminAnalyticsTab`, `AdminSupportTab`
   - `NotificationBell` with dropdown
4. Polling for notifications every 10 seconds when logged in
5. Dark/light mode via Tailwind `dark:` classes and context toggle
6. Responsive layout with sidebar nav on desktop, bottom nav on mobile
7. Charts via Recharts or Chart.js
