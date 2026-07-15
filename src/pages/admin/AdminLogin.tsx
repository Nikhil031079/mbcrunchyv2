// MB Crunchy — Admin Password Login
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Lock, Eye, EyeOff, Loader2, KeyRound, ArrowLeft, CheckCircle, ShieldAlert } from "lucide-react";

const SPECIAL_CHARS = "!@#$%^&*()_+-=[]{};':\",.<>/?|\\";
function hasSpecialChar(s: string): boolean {
  return s.split("").some(c => SPECIAL_CHARS.includes(c));
}

export default function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const loginMutation = useMutation(api.admin.login);
  const setupMutation = useMutation(api.admin.setupPassword);
  const resetPwMutation = useMutation(api.admin.resetPasswordWithRecoveryKey);
  const authStatus = useQuery(api.admin.getAdminAuthStatus, {});
  const hasRecoveryKey = useQuery(api.admin.hasRecoveryKey, {});

  const [step, setStep] = useState<"login" | "forgot" | "setup">("login");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialCheck, setInitialCheck] = useState(true);

  // Forgot password state
  const [recoveryKey, setRecoveryKey] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);

  // Setup state (first time)
  const [setupPw, setSetupPw] = useState("");
  const [setupConfirm, setSetupConfirm] = useState("");

  // Verify any existing session token against Convex
  const sessionToken = localStorage.getItem("admin_session_token");
  const sessionExpiry = localStorage.getItem("admin_session_expiry");
  const verifyResult = useQuery(
    api.admin.verifySession,
    sessionToken && !initialCheck ? { token: sessionToken } : "skip"
  );

  // On mount, clear expired tokens
  useEffect(() => {
    if (sessionExpiry && Date.now() > parseInt(sessionExpiry)) {
      localStorage.removeItem("admin_session_token");
      localStorage.removeItem("admin_session_expiry");
    }
    setInitialCheck(false);
  }, []);

  // If there's a valid session token, verify it with Convex and redirect
  useEffect(() => {
    if (initialCheck) return;
    if (verifyResult === undefined) return; // still loading
    if (verifyResult?.valid && authStatus?.isSetup) {
      navigate("/admin/dashboard", { replace: true });
      return;
    }
    // Session invalid or expired — clean up
    if (sessionToken) {
      localStorage.removeItem("admin_session_token");
      localStorage.removeItem("admin_session_expiry");
    }
  }, [verifyResult, authStatus, navigate, sessionToken, initialCheck]);

  // Auto-redirect to setup if no password configured
  useEffect(() => {
    if (authStatus && !authStatus.isSetup && step !== "setup") {
      setStep("setup");
    }
  }, [authStatus, step]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await loginMutation({ password });
      localStorage.setItem("admin_session_token", result.token);
      localStorage.setItem("admin_session_expiry", String(result.expiry));
      const from = (location.state as any)?.from?.pathname || "/admin/dashboard";
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || "Login failed");
    }
    setIsLoading(false);
  };

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (setupPw.length < 8) { setError("Password must be at least 8 characters"); return; }
    if (setupPw !== setupConfirm) { setError("Passwords don't match"); return; }
    if (!/[A-Z]/.test(setupPw)) { setError("Must contain an uppercase letter"); return; }
    if (!/[a-z]/.test(setupPw)) { setError("Must contain a lowercase letter"); return; }
    if (!/[0-9]/.test(setupPw)) { setError("Must contain a number"); return; }
    if (!hasSpecialChar(setupPw)) { setError("Must contain a special character"); return; }

    setIsLoading(true);
    setError(null);
    try {
      await setupMutation({ password: setupPw });
      setStep("login");
      setError("✅ Admin password set up! Please log in.");
      setSetupPw("");
      setSetupConfirm("");
    } catch (err: any) {
      setError(err.message || "Setup failed");
    }
    setIsLoading(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveryKey || newPassword.length < 8) { setError("Fill all fields"); return; }
    if (newPassword !== confirmPassword) { setError("Passwords don't match"); return; }
    if (!/[A-Z]/.test(newPassword)) { setError("Must contain an uppercase letter"); return; }
    if (!/[a-z]/.test(newPassword)) { setError("Must contain a lowercase letter"); return; }
    if (!/[0-9]/.test(newPassword)) { setError("Must contain a number"); return; }
    if (!hasSpecialChar(newPassword)) { setError("Must contain a special character"); return; }

    setIsLoading(true);
    setError(null);
    try {
      await resetPwMutation({ recoveryKey: recoveryKey.toUpperCase(), newPassword });
      setResetSuccess(true);
      setTimeout(() => {
        setStep("login");
        setResetSuccess(false);
        setRecoveryKey("");
        setNewPassword("");
        setConfirmPassword("");
        setError("✅ Password reset! Log in with your new password.");
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Reset failed");
    }
    setIsLoading(false);
  };

  const renderPasswordInput = (value: string, onChange: (v: string) => void, placeholder: string, autoFocus = false) => (
    <div className="relative">
      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <input
        type={showPw ? "text" : "password"}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="w-full rounded-xl border border-border bg-white py-3 pl-10 pr-10 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
      />
      <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
        {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );

  // Show verifying state while checking existing session
  if (verifyResult === undefined && !initialCheck && sessionToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-amber-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Verifying session...</p>
        </div>
      </div>
    );
  }

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

          {/* SETUP STEP */}
          {step === "setup" && (
            <>
              <div className="text-center mb-6">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-3">
                  <ShieldAlert className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-lg font-semibold">First-Time Setup</h2>
                <p className="text-sm text-muted-foreground mt-1">Create your admin password</p>
              </div>
              <form onSubmit={handleSetup} className="space-y-4">
                {renderPasswordInput(setupPw, setSetupPw, "New Password (min 8 chars)", true)}
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type={showPw ? "text" : "password"}
                    value={setupConfirm}
                    onChange={e => setSetupConfirm(e.target.value)}
                    placeholder="Confirm Password"
                    className="w-full rounded-xl border border-border bg-white py-3 pl-10 pr-4 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                {error && <p className={`text-sm ${error.startsWith("✅") ? "text-emerald-600" : "text-red-500"}`}>{error}</p>}
                <div className="text-[10px] text-muted-foreground space-y-0.5">
                  <p>• Minimum 8 characters • Uppercase • Lowercase</p>
                  <p>• Number • Special character</p>
                </div>
                <button type="submit" disabled={isLoading || !setupPw || !setupConfirm}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all disabled:opacity-50">
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Set Up Password"}
                </button>
              </form>
            </>
          )}

          {/* LOGIN STEP */}
          {step === "login" && (
            <>
              <h2 className="text-lg font-semibold mb-1">Admin Login</h2>
              <p className="text-sm text-muted-foreground mb-6">Enter your password to continue</p>
              <form onSubmit={handleLogin} className="space-y-4">
                {renderPasswordInput(password, setPassword, "Password", true)}
                {error && <p className={`text-sm ${error.startsWith("✅") ? "text-emerald-600" : "text-red-500"}`}>{error}</p>}
                <button type="submit" disabled={isLoading || !password}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all disabled:opacity-50">
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Login"}
                </button>
                <button type="button" onClick={() => { setStep("forgot"); setError(null); }}
                  className="w-full text-sm text-muted-foreground hover:text-primary transition-colors">
                  Forgot Password?
                </button>
              </form>
            </>
          )}

          {/* FORGOT PASSWORD STEP */}
          {step === "forgot" && (
            <>
              {resetSuccess ? (
                <div className="text-center py-4">
                  <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto mb-3" />
                  <h2 className="text-lg font-semibold">Password Reset!</h2>
                  <p className="text-sm text-muted-foreground">Redirecting to login...</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-4">
                    <button type="button" onClick={() => { setStep("login"); setError(null); }} className="rounded-lg p-1 text-muted-foreground hover:text-foreground">
                      <ArrowLeft className="h-4 w-4" />
                    </button>
                    <div>
                      <h2 className="text-lg font-semibold">Reset Password</h2>
                      <p className="text-sm text-muted-foreground">Enter your recovery key</p>
                    </div>
                  </div>
                  <form onSubmit={handleForgotPassword} className="space-y-4">
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        type="text"
                        value={recoveryKey}
                        onChange={e => setRecoveryKey(e.target.value.toUpperCase())}
                        placeholder="XXXX-XXXX-XXXX-XXXX"
                        className="w-full rounded-xl border border-border bg-white py-3 pl-10 pr-4 text-sm font-mono placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        autoFocus
                      />
                    </div>
                    {renderPasswordInput(newPassword, setNewPassword, "New Password")}
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                        placeholder="Confirm New Password" className="w-full rounded-xl border border-border bg-white py-3 pl-10 pr-4 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                    </div>
                    {error && <p className="text-sm text-red-500">{error}</p>}
                    <button type="submit" disabled={isLoading || !recoveryKey || !newPassword || !confirmPassword}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all disabled:opacity-50">
                      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Reset Password"}
                    </button>
                  </form>
                </>
              )}
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
