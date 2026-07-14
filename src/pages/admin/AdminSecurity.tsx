// MB Crunchy — Admin Account Security
import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Save, Shield, Key, LogOut, Eye, EyeOff, Copy, CheckCircle } from "lucide-react";
import { CardSkeleton } from "@/components/admin/LoadingSkeleton";
import { toast } from "sonner";

export default function AdminSecurity() {
  const securityInfo = useQuery(api.security.getSecurityInfo);
  const sessions = useQuery(api.security.listSessions);
  const recoveryKeys = useQuery(api.security.listRecoveryKeys);
  const generateKey = useMutation(api.security.generateRecoveryKey);
  const revokeSession = useMutation(api.security.revokeSession);
  const changePassword = useMutation(api.security.changePassword);
  const revokeRecoveryKey = useMutation(api.security.revokeRecoveryKey);

  const [passwordForm, setPasswordForm] = useState({ current: "", newPass: "", confirm: "" });
  const [showPasswords, setShowPasswords] = useState(false);
  const [newKey, setNewKey] = useState<string | null>(null);
  const [changingPassword, setChangingPassword] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleChangePassword = async () => {
    if (passwordForm.newPass.length < 8) { toast.error("Password must be at least 8 characters"); return; }
    if (passwordForm.newPass !== passwordForm.confirm) { toast.error("Passwords don't match"); return; }
    setChangingPassword(true);
    try {
      await changePassword({ currentPassword: passwordForm.current, newPassword: passwordForm.newPass });
      toast.success("Password changed successfully");
      setPasswordForm({ current: "", newPass: "", confirm: "" });
    } catch { toast.error("Failed to change password"); }
    setChangingPassword(false);
  };

  const handleGenerateKey = async () => {
    try {
      const key = await generateKey();
      setNewKey(key);
      toast.success("Recovery key generated");
    } catch { toast.error("Failed to generate key"); }
  };

  const handleCopyKey = () => {
    if (newKey) {
      navigator.clipboard.writeText(newKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRevokeSession = async (sessionId: any) => {
    try {
      await revokeSession({ sessionId });
      toast.success("Session revoked");
    } catch { toast.error("Failed to revoke session"); }
  };

  if (!securityInfo) return <CardSkeleton />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Account Security</h1>
          <p className="text-sm text-muted-foreground">Manage your security settings</p>
        </div>
      </div>

      {/* Security Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-2xl bg-white border border-border/60 p-4 shadow-sm">
          <Shield className="h-5 w-5 text-emerald-600 mb-2" />
          <p className="text-2xl font-bold">{securityInfo?.activeSessions ?? 0}</p>
          <p className="text-xs text-muted-foreground">Active Sessions</p>
        </div>
        <div className="rounded-2xl bg-white border border-border/60 p-4 shadow-sm">
          <Key className="h-5 w-5 text-amber-600 mb-2" />
          <p className="text-2xl font-bold">{securityInfo?.unusedRecoveryKeys ?? 0}</p>
          <p className="text-xs text-muted-foreground">Unused Keys</p>
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
                <input
                  type={showPasswords ? "text" : "password"}
                  value={passwordForm.current}
                  onChange={e => setPasswordForm({ ...passwordForm, current: e.target.value })}
                  className="w-full rounded-xl border border-border bg-white px-3 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                <button onClick={() => setShowPasswords(!showPasswords)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase text-muted-foreground">New Password</label>
              <input
                type={showPasswords ? "text" : "password"}
                value={passwordForm.newPass}
                onChange={e => setPasswordForm({ ...passwordForm, newPass: e.target.value })}
                className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase text-muted-foreground">Confirm New Password</label>
              <input
                type={showPasswords ? "text" : "password"}
                value={passwordForm.confirm}
                onChange={e => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <button
              onClick={handleChangePassword}
              disabled={changingPassword || !passwordForm.current || !passwordForm.newPass}
              className="w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all disabled:opacity-50"
            >
              {changingPassword ? "Changing..." : "Change Password"}
            </button>
          </div>
        </div>

        {/* Recovery Keys */}
        <div className="rounded-2xl bg-white border border-border/60 p-6 shadow-sm">
          <h2 className="font-semibold mb-4 flex items-center gap-2"><Key className="h-4 w-4 text-primary" /> Recovery Keys</h2>
          {newKey && (
            <div className="mb-4 rounded-xl border-2 border-amber-200 bg-amber-50 p-4">
              <p className="text-xs font-semibold uppercase text-amber-700 mb-2">⚠ Save this key now — it won't be shown again</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 rounded-lg bg-white border border-amber-200 px-3 py-2 text-sm font-mono font-bold text-amber-900">{newKey}</code>
                <button onClick={handleCopyKey} className="rounded-lg bg-white border border-amber-200 p-2 hover:bg-amber-100 transition-colors">
                  {copied ? <CheckCircle className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4 text-amber-700" />}
                </button>
              </div>
            </div>
          )}
          <button onClick={handleGenerateKey} className="w-full rounded-xl border-2 border-dashed border-border py-3 text-sm font-medium text-muted-foreground hover:border-primary hover:text-primary transition-colors">
            + Generate New Recovery Key
          </button>
          {recoveryKeys && recoveryKeys.length > 0 && (
            <div className="mt-4 space-y-2">
              {recoveryKeys.map(key => (
                <div key={key._id} className="flex items-center justify-between rounded-xl bg-muted/30 px-4 py-2.5">
                  <div>
                    <p className="text-sm font-mono">{key.keyPreview}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {key.usedAt ? "Used" : "Active"} • {new Date(key.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {!key.usedAt && (
                    <button onClick={() => revokeRecoveryKey({ keyId: key._id })} className="text-xs text-red-600 hover:text-red-700 font-medium">
                      Revoke
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Active Sessions */}
      <div className="rounded-2xl bg-white border border-border/60 p-6 shadow-sm">
        <h2 className="font-semibold mb-4 flex items-center gap-2"><LogOut className="h-4 w-4 text-primary" /> Active Sessions</h2>
        {sessions && sessions.length > 0 ? (
          <div className="space-y-2">
            {sessions.map(session => (
              <div key={session._id} className="flex items-center justify-between rounded-xl bg-muted/30 px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className={`h-2 w-2 rounded-full ${session.isActive ? "bg-emerald-500" : "bg-red-400"}`} />
                  <div>
                    <p className="text-sm font-medium">{session.userAgent ? session.userAgent.substring(0, 50) + "..." : "Unknown device"}</p>
                    <p className="text-xs text-muted-foreground">
                      {session.ipAddress ?? "No IP"} • {new Date(session.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                {session.isActive && (
                  <button onClick={() => handleRevokeSession(session._id)} className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100 transition-colors">
                    Revoke
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">No active sessions</p>
        )}
      </div>
    </div>
  );
}
