// MB Crunchy — Admin Layout with Password-Based Auth Guard
import { useState, useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import AdminSidebar from "./AdminSidebar";
import { Loader2 } from "lucide-react";

export default function AdminLayout() {
  const location = useLocation();
  const [sessionState, setSessionState] = useState<"loading" | "valid" | "invalid">("loading");

  const sessionToken = localStorage.getItem("admin_session_token");
  const sessionExpiry = localStorage.getItem("admin_session_expiry");
  const verifyResult = useQuery(
    api.admin.verifySession,
    sessionToken ? { token: sessionToken } : "skip"
  );

  useEffect(() => {
    if (!sessionToken || !sessionExpiry) {
      setSessionState("invalid");
      return;
    }

    // Check expiry locally first
    if (Date.now() > parseInt(sessionExpiry)) {
      localStorage.removeItem("admin_session_token");
      localStorage.removeItem("admin_session_expiry");
      setSessionState("invalid");
      return;
    }

    // Wait for Convex verification
    if (verifyResult === undefined) return; // still loading

    if (verifyResult?.valid) {
      setSessionState("valid");
    } else {
      // Session invalid or expired
      localStorage.removeItem("admin_session_token");
      localStorage.removeItem("admin_session_expiry");
      setSessionState("invalid");
    }
  }, [sessionToken, sessionExpiry, verifyResult]);

  if (sessionState === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Verifying session...</p>
        </div>
      </div>
    );
  }

  if (sessionState === "invalid") {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Valid session — show admin panel
  return (
    <div className="flex min-h-screen bg-muted/20">
      <AdminSidebar />
      <main className="flex-1 min-w-0 lg:pl-0">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 pt-16 lg:pt-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
