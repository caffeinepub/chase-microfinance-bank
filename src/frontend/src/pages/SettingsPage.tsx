import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Bell, Loader2, Lock, Moon, Settings, Sun, User } from "lucide-react";
import { motion } from "motion/react";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";
import { useBanking } from "../contexts/BankingContext";
import { useTheme } from "../contexts/ThemeContext";
import { bankingStore } from "../store/bankingStore";

export default function SettingsPage() {
  const { session, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { balance } = useBanking();
  const [passwordForm, setPasswordForm] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });
  const [pwLoading, setPwLoading] = useState(false);
  const [notifEnabled, setNotifEnabled] = useState(true);

  function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    if (passwordForm.newPass !== passwordForm.confirm) {
      toast.error("Passwords do not match");
      return;
    }
    if (passwordForm.newPass.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setPwLoading(true);
    setTimeout(() => {
      setPwLoading(false);
      setPasswordForm({ current: "", newPass: "", confirm: "" });
      toast.success("Password updated successfully");
    }, 1000);
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <div className="w-9 h-9 rounded-xl bg-brand/15 flex items-center justify-center">
          <Settings className="w-5 h-5 text-brand" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground">
            Manage your account preferences
          </p>
        </div>
      </motion.div>

      {/* Profile */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card border border-border rounded-xl p-6 shadow-card"
      >
        <div className="flex items-center gap-3 mb-5">
          <User className="w-4 h-4 text-brand" />
          <h2 className="text-sm font-semibold text-foreground">
            Profile Information
          </h2>
        </div>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-brand/20 flex items-center justify-center">
            <span className="text-2xl font-bold text-brand">
              {session?.username?.[0]?.toUpperCase()}
            </span>
          </div>
          <div>
            <p className="text-lg font-bold text-foreground">
              {session?.username}
            </p>
            <p className="text-sm text-muted-foreground capitalize">
              {session?.role} Account
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Member since{" "}
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })
                : ""}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-muted/50 rounded-xl p-4">
            <p className="text-xs text-muted-foreground">Account Balance</p>
            <p className="text-lg font-bold text-foreground mt-1 font-mono-data">
              {bankingStore.formatCurrency(balance)}
            </p>
          </div>
          <div className="bg-muted/50 rounded-xl p-4">
            <p className="text-xs text-muted-foreground">Account Status</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-2 h-2 rounded-full bg-success" />
              <p className="text-sm font-semibold text-success">Active</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Appearance */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-card border border-border rounded-xl p-6 shadow-card"
      >
        <div className="flex items-center gap-3 mb-5">
          {theme === "dark" ? (
            <Moon className="w-4 h-4 text-brand" />
          ) : (
            <Sun className="w-4 h-4 text-brand" />
          )}
          <h2 className="text-sm font-semibold text-foreground">Appearance</h2>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">Dark Mode</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Toggle between light and dark interface
            </p>
          </div>
          <Switch
            data-ocid="settings.dark_mode.switch"
            checked={theme === "dark"}
            onCheckedChange={() => toggleTheme()}
          />
        </div>
      </motion.div>

      {/* Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card border border-border rounded-xl p-6 shadow-card"
      >
        <div className="flex items-center gap-3 mb-5">
          <Bell className="w-4 h-4 text-brand" />
          <h2 className="text-sm font-semibold text-foreground">
            Notifications
          </h2>
        </div>
        <div className="space-y-4">
          {[
            {
              label: "Transaction Alerts",
              desc: "Get notified for every transaction",
            },
            {
              label: "Security Alerts",
              desc: "Unusual activity and login alerts",
            },
            {
              label: "Account Updates",
              desc: "Monthly statements and updates",
            },
          ].map((item, idx) => (
            <div key={item.label} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">
                  {item.label}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {item.desc}
                </p>
              </div>
              <Switch
                data-ocid={`settings.notification_${idx}.switch`}
                checked={notifEnabled}
                onCheckedChange={() => setNotifEnabled(!notifEnabled)}
              />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Change Password */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="bg-card border border-border rounded-xl p-6 shadow-card"
      >
        <div className="flex items-center gap-3 mb-5">
          <Lock className="w-4 h-4 text-brand" />
          <h2 className="text-sm font-semibold text-foreground">
            Change Password
          </h2>
        </div>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-pw">Current Password</Label>
            <Input
              id="current-pw"
              data-ocid="settings.password.input"
              type="password"
              placeholder="Enter current password"
              value={passwordForm.current}
              onChange={(e) =>
                setPasswordForm((f) => ({ ...f, current: e.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-pw">New Password</Label>
            <Input
              id="new-pw"
              data-ocid="settings.password.input"
              type="password"
              placeholder="Enter new password"
              value={passwordForm.newPass}
              onChange={(e) =>
                setPasswordForm((f) => ({ ...f, newPass: e.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-pw">Confirm New Password</Label>
            <Input
              id="confirm-pw"
              data-ocid="settings.password.input"
              type="password"
              placeholder="Repeat new password"
              value={passwordForm.confirm}
              onChange={(e) =>
                setPasswordForm((f) => ({ ...f, confirm: e.target.value }))
              }
            />
          </div>
          <Button
            type="submit"
            data-ocid="settings.password.submit_button"
            disabled={
              pwLoading || !passwordForm.current || !passwordForm.newPass
            }
            className="bg-brand hover:bg-brand/90 text-brand-foreground"
          >
            {pwLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            Update Password
          </Button>
        </form>
      </motion.div>

      {/* Footer */}
      <div className="text-center pb-4">
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand hover:text-brand/80 transition-colors"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </div>
  );
}
