// MB Crunchy — Admin Logout
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Loader2 } from "lucide-react";

export default function AdminLogout() {
  const navigate = useNavigate();
  const logoutMutation = useMutation(api.admin.logout);
  const [status, setStatus] = useState("Logging out...");

  useEffect(() => {
    const doLogout = async () => {
      const token = localStorage.getItem("admin_session_token");
      if (token) {
        try { await logoutMutation({ token }); } catch {}
      }
      localStorage.removeItem("admin_session_token");
      localStorage.removeItem("admin_session_expiry");
      setStatus("Logged out successfully");
      setTimeout(() => navigate("/admin/login", { replace: true }), 500);
    };
    doLogout();
  }, [logoutMutation, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">{status}</p>
      </div>
    </div>
  );
}
