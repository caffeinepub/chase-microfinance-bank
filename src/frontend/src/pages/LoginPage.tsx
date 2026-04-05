import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "@tanstack/react-router";
import { Building2, Eye, EyeOff, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    username?: string;
    password?: string;
    general?: string;
  }>({});

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newErrors: typeof errors = {};
    if (!username.trim()) newErrors.username = "Username is required";
    if (!password) newErrors.password = "Password is required";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});
    try {
      const result = await login(username.trim(), password);
      if (result.success) {
        toast.success("Welcome back!");
        window.location.assign("/dashboard");
      } else {
        setErrors({ general: result.message });
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-brand-muted/20 pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-chart-2/5 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        {/* Logo & Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand/10 border border-brand/20 mb-4">
            <Building2 className="w-8 h-8 text-brand" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            Chase Microfinance Bank
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Sign in to your account
          </p>
        </div>

        {/* Card */}
        <div className="bg-card border border-border rounded-2xl p-8 shadow-card">
          <form onSubmit={handleSubmit} noValidate>
            <div className="space-y-5">
              <div className="space-y-2">
                <Label
                  htmlFor="login-username"
                  className="text-sm font-medium text-foreground"
                >
                  Username
                </Label>
                <Input
                  id="login-username"
                  data-ocid="login.input"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  className={`h-11 ${errors.username ? "border-destructive focus-visible:ring-destructive" : ""}`}
                />
                {errors.username && (
                  <p
                    data-ocid="login.error_state"
                    className="text-xs text-destructive"
                  >
                    {errors.username}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="login-password"
                  className="text-sm font-medium text-foreground"
                >
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="login-password"
                    data-ocid="login.input"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    className={`h-11 pr-10 ${errors.password ? "border-destructive focus-visible:ring-destructive" : ""}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-destructive">{errors.password}</p>
                )}
              </div>

              {errors.general && (
                <div
                  data-ocid="login.error_state"
                  className="bg-destructive/10 border border-destructive/30 rounded-lg px-4 py-3 text-sm text-destructive"
                >
                  {errors.general}
                </div>
              )}

              <Button
                type="submit"
                data-ocid="login.submit_button"
                disabled={isLoading}
                className="w-full h-11 bg-brand hover:bg-brand/90 text-brand-foreground font-semibold"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-brand hover:text-brand/80 font-medium transition-colors"
                data-ocid="login.link"
              >
                Create account
              </Link>
            </p>
          </div>

          {/* Demo credentials */}
          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-xs text-muted-foreground text-center mb-3 font-medium uppercase tracking-wide">
              Demo Credentials
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-muted-foreground">User Account</p>
                <p className="text-foreground font-mono-data mt-1">
                  sarah_j / pass123
                </p>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-muted-foreground">Admin Account</p>
                <p className="text-foreground font-mono-data mt-1">
                  admin / admin123
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
