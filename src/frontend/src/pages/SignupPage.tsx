import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "@tanstack/react-router";
import { Building2, Check, Eye, EyeOff, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";

export default function SignupPage() {
  const { register } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    username?: string;
    password?: string;
    confirm?: string;
    general?: string;
  }>({});

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newErrors: typeof errors = {};
    if (!username.trim() || username.length < 3)
      newErrors.username = "Username must be at least 3 characters";
    if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (password !== confirmPassword)
      newErrors.confirm = "Passwords do not match";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});
    try {
      const result = await register(username.trim(), password);
      if (result.success) {
        toast.success("Account created! Welcome to Chase Microfinance Bank.");
        window.location.assign("/dashboard");
      } else {
        setErrors({ general: result.message });
      }
    } finally {
      setIsLoading(false);
    }
  }

  const passwordStrength =
    password.length === 0
      ? 0
      : password.length < 6
        ? 1
        : password.length < 10
          ? 2
          : 3;
  const strengthColors = [
    "bg-border",
    "bg-destructive",
    "bg-warning",
    "bg-success",
  ];
  const strengthLabels = ["", "Weak", "Fair", "Strong"];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-chart-2/5 pointer-events-none" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-brand/5 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand/10 border border-brand/20 mb-4">
            <Building2 className="w-8 h-8 text-brand" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            Chase Microfinance Bank
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Create your free account
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8 shadow-card">
          {/* Welcome bonus */}
          <div className="flex items-center gap-3 bg-brand/10 border border-brand/20 rounded-xl px-4 py-3 mb-6">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-brand/20">
              <Check className="w-4 h-4 text-brand" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                Welcome Bonus
              </p>
              <p className="text-xs text-muted-foreground">
                Get $1,000,000 demo balance on signup
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="signup-username">Username</Label>
                <Input
                  id="signup-username"
                  data-ocid="signup.input"
                  type="text"
                  placeholder="Choose a username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  className={`h-11 ${errors.username ? "border-destructive" : ""}`}
                />
                {errors.username && (
                  <p
                    data-ocid="signup.error_state"
                    className="text-xs text-destructive"
                  >
                    {errors.username}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <div className="relative">
                  <Input
                    id="signup-password"
                    data-ocid="signup.input"
                    type={showPassword ? "text" : "password"}
                    placeholder="Choose a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    className={`h-11 pr-10 ${errors.password ? "border-destructive" : ""}`}
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
                {password.length > 0 && (
                  <div className="space-y-1">
                    <div className="flex gap-1">
                      {[1, 2, 3].map((level) => (
                        <div
                          key={level}
                          className={`h-1 flex-1 rounded-full transition-colors ${level <= passwordStrength ? strengthColors[passwordStrength] : "bg-border"}`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {strengthLabels[passwordStrength]}
                    </p>
                  </div>
                )}
                {errors.password && (
                  <p className="text-xs text-destructive">{errors.password}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-confirm">Confirm Password</Label>
                <Input
                  id="signup-confirm"
                  data-ocid="signup.input"
                  type="password"
                  placeholder="Repeat your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  className={`h-11 ${errors.confirm ? "border-destructive" : ""}`}
                />
                {errors.confirm && (
                  <p className="text-xs text-destructive">{errors.confirm}</p>
                )}
              </div>

              {errors.general && (
                <div
                  data-ocid="signup.error_state"
                  className="bg-destructive/10 border border-destructive/30 rounded-lg px-4 py-3 text-sm text-destructive"
                >
                  {errors.general}
                </div>
              )}

              <Button
                type="submit"
                data-ocid="signup.submit_button"
                disabled={isLoading}
                className="w-full h-11 bg-brand hover:bg-brand/90 text-brand-foreground font-semibold"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-brand hover:text-brand/80 font-medium transition-colors"
                data-ocid="signup.link"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
