import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import type React from "react";
import { AppLayout } from "./components/layout/AppLayout";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import AdminPage from "./pages/AdminPage";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import SavingsPage from "./pages/SavingsPage";
import SettingsPage from "./pages/SettingsPage";
import SignupPage from "./pages/SignupPage";
import SupportPage from "./pages/SupportPage";
import TransactionsPage from "./pages/TransactionsPage";

// Root route
const rootRoute = createRootRoute({
  component: Root,
});

function Root() {
  return <Outlet />;
}

// Auth guard HOC
function AuthGuard({
  children,
  requireAdmin = false,
}: { children: React.ReactNode; requireAdmin?: boolean }) {
  const { session, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-brand border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!session) {
    window.location.assign("/login");
    return null;
  }

  if (requireAdmin && session.role !== "admin") {
    window.location.assign("/dashboard");
    return null;
  }

  return <>{children}</>;
}

// Auth layout
function ProtectedLayout() {
  return (
    <AuthGuard>
      <AppLayout>
        <Outlet />
      </AppLayout>
    </AuthGuard>
  );
}

function AdminLayout() {
  return (
    <AuthGuard requireAdmin>
      <AppLayout>
        <Outlet />
      </AppLayout>
    </AuthGuard>
  );
}

// Public redirect (if logged in, go to dashboard)
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { session, isLoading } = useAuth();
  if (isLoading) return null;
  if (session) {
    window.location.assign("/dashboard");
    return null;
  }
  return <>{children}</>;
}

// Route definitions
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => <IndexRedirect />,
});

function IndexRedirect() {
  const { session, isLoading } = useAuth();
  if (isLoading) return null;
  if (session) {
    window.location.assign("/dashboard");
  } else {
    window.location.assign("/login");
  }
  return null;
}

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: () => (
    <PublicRoute>
      <LoginPage />
    </PublicRoute>
  ),
});

const signupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/signup",
  component: () => (
    <PublicRoute>
      <SignupPage />
    </PublicRoute>
  ),
});

const protectedLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/_protected",
  component: ProtectedLayout,
});

const dashboardRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: "/dashboard",
  component: DashboardPage,
});

const transactionsRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: "/transactions",
  component: TransactionsPage,
});

const savingsRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: "/savings",
  component: SavingsPage,
});

const supportRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: "/support",
  component: SupportPage,
});

const settingsRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: "/settings",
  component: SettingsPage,
});

const adminLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/_admin",
  component: AdminLayout,
});

const adminRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/admin",
  component: AdminPage,
});

// Build router
const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  signupRoute,
  protectedLayoutRoute.addChildren([
    dashboardRoute,
    transactionsRoute,
    savingsRoute,
    supportRoute,
    settingsRoute,
  ]),
  adminLayoutRoute.addChildren([adminRoute]),
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider router={router} />
        <Toaster richColors position="top-right" />
      </AuthProvider>
    </ThemeProvider>
  );
}
