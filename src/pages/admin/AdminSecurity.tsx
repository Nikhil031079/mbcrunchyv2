// MB Crunchy — Admin Account Security (Password-Based Auth)
import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Shield, Key, Eye, EyeOff, Copy, CheckCircle, Loader2 } from "lucide-react";
import { CardSkeleton } from "@/components/admin/LoadingSkeleton";
import { toast } from "sonner";

export default function AdminSecurity() {
  const token = localStorage.getItem("admin_session_token") || "";
  const securityInfo = useQuery(api.admin.getSecurityInfo, { token });
  const changePassword = useMutation(api.admin.changePassword);
  const generateKey = useMutation(api.admin.generateRecoveryKey);
  const clearKeyView = useMutation(api.admin.clearRecoveryKeyView);

  // Password change form
  const [pwForm, setPwForm] = useState({ current: "", newPass: "", confirm: "" });
  const [showPw, setShowPw] = useState(false);
  const [changingPw, setChangingPw] = useState(false);

  // Recovery key
  const [newKey, setNewKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);

  const handleChangePassword = async () => {
    if (pwForm.newPass.length < 8) { toast.error("Min 8 characters"); return; }
    if (pwForm.newPass !== pwForm.confirm) { toast.error("Passwords don't match"); return; }
    if (!/[A-Z]/.test(pwForm.newPass)) { toast.error("Need uppercase letter"); return; }
    if (!/[a-z]/.test(pwForm.newPass)) { toast.error("Need lowercase letter"); return; }
    if (!/[0-9]/.test(pwForm.newPass)) { toast.error("Need a number"); return; }
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pwForm.newPass)) { toast.error("Need special character"); return; }

    setChangingPw(true);
    try {
      await changePassword({ currentPassword: pwForm.current, newPassword: pwForm.newPass, token });
      toast.success("Password changed successfully");
      setPwForm({ current: "", newPass: "", confirm: "" });
    } catch (e: any) { toast.error(e.message || "Failed"); }
    setChangingPw(false);
  };

  const handleGenerateKey = async () => {
    setGenerating(true);
    try {
      const key = await generateKey({ token });
      setNewKey(key);
      toast.success("Recovery key generated — copy it now!");
    } catch (e: any) { toast.error(e.message || "Failed"); }
    setGenerating(false);
  };

  const handleCopyKey = () => {
    if (newKey) {
      navigator.clipboard.writeText(newKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDismissKey = async () => {
    setNewKey(null);
    try { await clearKeyView({ token }); } catch {}
  };

  if (!securityInfo) return <CardSkeleton />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Account Security</h1>
          <p className="text-sm text-muted-foreground">Manage password, recovery key, and security settings</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="rounded-2xl bg-white border border-border/60 p-4 shadow-sm">
          <Shield className="h-5 w-5 text-emerald-600 mb-2" />
          <p className="text-2xl font-bold">{securityInfo.passwordChangedAt ? "✅" : "⚠️"}</p>
          <p className="text-xs text-muted-foreground">Password Set</p>
        </div>
        <div className="rounded-2xl bg-white border border-border/60 p-4 shadow-sm">
          <Key className={`h-5 w-5 mb-2 ${securityInfo.hasRecoveryKey ? "text-emerald-600" : "text-muted-foreground"}`} />
          <p className="text-2xl font-bold">{securityInfo.hasRecoveryKey ? "✅" : "—"}</p>
          <p className="text-xs text-muted-foreground">Recovery Key</p>
        </div>
        <div className="rounded-2xl bg-white border border-border/60 p-4 shadow-sm">
          <Shield className="h-5 w-5 text-amber-600 mb-2" />
          <p className="text-2xl font-bold">{securityInfo.failedAttempts ?? 0}</p>
          <p className="text-xs text-muted-foreground">Failed Attempts</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Change Password */}
        <div className="rounded-2xl bg-white border border-border/60 p-6 shadow-sm">
          <h2 className="font-semibold mb-4 flex items-center gap-2"><Shield className="h-4 w-4 text-primary" /> Change Password</h2>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase text-muted-foreground">Current Password</label>
              <div className="relative mt-1">
                <input type={showPw ? "text" : "password"} value={pwForm.current}
                  onChange={e => setPwForm({ ...pwForm, current: e.target.value })}
                  className="w-full rounded-xl border border-border bg-white px-3 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase text-muted-foreground">New Password</label>
              <input type={showPw ? "text" : "password"} value={pwForm.newPass}
                onChange={e => setPwForm({ ...pwForm, newPass: e.target.value })}
                className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase text-muted-foreground">Confirm New Password</label>
              <input type={showPw ? "text" : "password"} value={pwForm.confirm}
                onChange={e => setPwForm({ ...pwForm, confirm: e.target.value })}
                className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            </div>
            <button onClick={handleChangePassword} disabled={changingPw || !pwForm.current || !pwForm.newPass}
              className="w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all disabled:opacity-50">
              {changingPw ? <><Loader2 className="h-4 w-4 animate-spin inline mr-2" />Changing...</> : "Change Password"}
            </button>
          </div>
        </div>

        {/* Recovery Key */}
        <div className="rounded-2xl bg-white border border-border/60 p-6 shadow-sm">
          <h2 className="font-semibold mb-4 flex items-center gap-2"><Key className="h-4 w-4 text-primary" /> Recovery Key</h2>

          {newKey && (
            <div className="mb-4 rounded-xl border-2 border-amber-200 bg-amber-50 p-4">
              <p className="text-xs font-semibold uppercase text-amber-700 mb-2">⚠ Save this key now — it won't be shown again</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 rounded-lg bg-white border border-amber-200 px-3 py-2 text-sm font-mono font-bold text-amber-900 tracking-wider">{newKey}</code>
                <button onClick={handleCopyKey} className="rounded-lg bg-white border border-amber-200 p-2 hover:bg-amber-100 transition-colors">
                  {copied ? <CheckCircle className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4 text-amber-700" />}
                </button>
              </div>
              <button onClick={handleDismissKey} className="mt-2 text-xs text-muted-foreground hover:text-foreground">Dismiss</button>
            </div>
          )}

          {!newKey && (
            <>
              <p className="text-xs text-muted-foreground mb-4">
                {securityInfo.hasRecoveryKey
                  ? "A recovery key exists. Generate a new one to replace it."
                  : "Generate a recovery key to reset your password if you forget it."}
              </p>
              <button onClick={handleGenerateKey} disabled={generating}
                className="w-full rounded-xl border-2 border-dashed border-border py-3 text-sm font-medium text-muted-foreground hover:border-primary hover:text-primary transition-colors disabled:opacity-50">
                {generating ? <Loader2 className="h-4 w-4 animate-spin inline mr-2" /> : "+ "}
                {generating ? "Generating..." : securityInfo.hasRecoveryKey ? "Regenerate Recovery Key" : "Generate Recovery Key"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
