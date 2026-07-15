// MB Crunchy — Admin Logout (Complete Storage Cleanup)
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Loader2, CheckCircle } from "lucide-react";

// All possible auth-related keys across both storages
const AUTH_KEYS = [
  "admin_session_token",
  "admin_session_expiry",
  "adminToken",
  "sessionToken",
  "authToken",
  "currentAdmin",
  "currentUser",
  "admin_cache",
  "admin_permissions",
  "admin_profile",
];

function clearAllStorage() {
  // Clear known auth keys from localStorage
  AUTH_KEYS.forEach(key => {
    try { localStorage.removeItem(key); } catch {}
  });
  // Clear known auth keys from sessionStorage
  AUTH_KEYS.forEach(key => {
    try { sessionStorage.removeItem(key); } catch {}
  });
  // Clear all sessionStorage (private session data)
  try { sessionStorage.clear(); } catch {}
}

export default function AdminLogout() {
  const navigate = useNavigate();
  const logoutMutation = useMutation(api.admin.logout);
  const [status, setStatus] = useState("Logging out...");
  const [done, setDone] = useState(false);

  useEffect(() => {
    const doLogout = async () => {
      const token = localStorage.getItem("admin_session_token");
      // Call Convex to invalidate the server-side session
      if (token) {
        try { await logoutMutation({ token }); } catch {}
      }
      // Clear ALL auth-related keys from both storages
      clearAllStorage();
      setStatus("Logged out successfully");
      setDone(true);
      // Redirect to login after a brief pause so user sees the confirmation
      setTimeout(() => navigate("/admin/login", { replace: true }), 800);
    };
    doLogout();
  }, [logoutMutation, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-amber-50">
      <div className="flex flex-col items-center gap-3">
        {done ? (
          <>
            <CheckCircle className="h-10 w-10 text-emerald-500" />
            <p className="text-sm font-semibold text-emerald-700">{status}</p>
            <p className="text-xs text-muted-foreground">Redirecting to login...</p>
          </>
        ) : (
          <>
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">{status}</p>
          </>
        )}
      </div>
    </div>
  );
}
