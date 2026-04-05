import type React from "react";
import { useState } from "react";
import { BankingProvider } from "../../contexts/BankingContext";
import { ChatWidget } from "../chat/ChatWidget";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <BankingProvider>
      <div className="flex h-screen bg-background overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed(!collapsed)}
        />

        {/* Main area */}
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto">
            <div className="p-6">{children}</div>
          </main>
        </div>

        {/* Floating chat widget */}
        <ChatWidget />
      </div>
    </BankingProvider>
  );
}
