// MB Crunchy — Admin Login Page
import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Mail, ArrowRight, Loader2, Lock, ShieldAlert } from "lucide-react";

export default function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, signOut, isLoading: authLoading, isAuthenticated, user } = useAuth();
  const isAdminUser = useQuery(api.admin.isAdmin);
  const claimAdmin = useMutation(api.admin.claimAdmin);

  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"email" | "otp" | "setup">("email");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [setupMessage, setSetupMessage] = useState<string | null>(null);

  // After authentication, check admin status
  // If authenticated and admin, redirect to dashboard
  if (!authLoading && isAuthenticated && isAdminUser === true) {
    const from = (location.state as any)?.from?.pathname || "/admin/dashboard";
    navigate(from, { replace: true });
  }

  // If authenticated but NOT admin, show setup option
  if (!authLoading && isAuthenticated && isAdminUser === false && step !== "setup") {
    setStep("setup");
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("email", email);
      await signIn("email-otp", formData);
      setStep("otp");
    } catch (err: any) {
      setError(err.message || "Failed to send verification code");
    }
    setIsLoading(false);
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("code", otp);
      await signIn("email-otp", formData);
      // Auth succeeded — now check admin status via useQuery above
    } catch (err: any) {
      setError(err.message || "Invalid verification code");
      setIsLoading(false);
      setOtp("");
    }
  };

  const handleClaimAdmin = async () => {
    setIsLoading(true);
    setError(null);
    setSetupMessage(null);
    try {
      await claimAdmin();
      setSetupMessage("✅ Admin access granted! Redirecting...");
      setTimeout(() => navigate("/admin/dashboard", { replace: true }), 1000);
    } catch (err: any) {
      setError(err.message || "Failed to claim admin role");
    }
    setIsLoading(false);
  };

  const handleLogout = async () => {
    await signOut();
    setStep("email");
    setOtp("");
    setEmail("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-amber-50">
      <div className="w-full max-w-md px-4">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/20 mb-4">
            <Lock className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold">MB Crunchy</h1>
          <p className="text-sm text-muted-foreground mt-1">Admin Dashboard</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl bg-white border border-border/60 shadow-xl p-8">
          {step === "email" && (
            <>
              <h2 className="text-lg font-semibold mb-1">Admin Login</h2>
              <p className="text-sm text-muted-foreground mb-6">Enter your email to receive a verification code</p>
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="admin@mbcrunchy.com"
                    required
                    disabled={isLoading}
                    className="w-full rounded-xl border border-border bg-white py-3 pl-10 pr-4 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50"
                  />
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <button
                  type="submit"
                  disabled={isLoading || !email}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all disabled:opacity-50"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><ArrowRight className="h-4 w-4" /> Send Code</>}
                </button>
              </form>
            </>
          )}

          {step === "otp" && (
            <>
              <h2 className="text-lg font-semibold mb-1">Check your email</h2>
              <p className="text-sm text-muted-foreground mb-6">We sent a 6-digit code to {email}</p>
              <form onSubmit={handleOtpSubmit} className="space-y-4">
                <div className="flex justify-center">
                  <input
                    type="text"
                    value={otp}
                    onChange={e => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="000000"
                    maxLength={6}
                    disabled={isLoading}
                    className="w-48 text-center text-2xl font-mono tracking-[0.5em] rounded-xl border border-border bg-white py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50"
                    autoFocus
                  />
                </div>
                {error && <p className="text-sm text-red-500 text-center">{error}</p>}
                <button
                  type="submit"
                  disabled={isLoading || otp.length !== 6}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all disabled:opacity-50"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><ArrowRight className="h-4 w-4" /> Verify & Login</>}
                </button>
                <button
                  type="button"
                  onClick={() => { setStep("email"); setError(null); setOtp(""); }}
                  className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Use a different email
                </button>
              </form>
            </>
          )}

          {step === "setup" && (
            <>
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-50">
                  <ShieldAlert className="h-7 w-7 text-amber-600" />
                </div>
                <h2 className="text-lg font-semibold">No Admin Found</h2>
                <p className="text-sm text-muted-foreground">
                  Your account is authenticated but doesn't have admin permissions.
                  {setupMessage ? (
                    <span className="block mt-2 text-emerald-600 font-medium">{setupMessage}</span>
                  ) : (
                    " If no admin exists yet, you can claim the admin role."
                  )}
                </p>
                {!setupMessage && (
                  <button
                    onClick={handleClaimAdmin}
                    disabled={isLoading}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all disabled:opacity-50"
                  >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Claim Admin Role"}
                  </button>
                )}
                {error && <p className="text-sm text-red-500">{error}</p>}
                <button
                  onClick={handleLogout}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Sign out and try a different account
                </button>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <a href="/" className="text-xs text-muted-foreground hover:text-primary transition-colors">
            Back to Website
          </a>
        </div>
      </div>
    </div>
  );
}
