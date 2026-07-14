// MB Crunchy — Admin Layout with Authentication Guard
import { Navigate, Outlet, useLocation } from "react-router";
import { useConvexAuth } from "convex/react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import AdminSidebar from "./AdminSidebar";
import { Loader2 } from "lucide-react";

export default function AdminLayout() {
  const { isLoading: authLoading, isAuthenticated } = useConvexAuth();
  const isAdminUser = useQuery(api.admin.isAdmin);
  const location = useLocation();

  // Show loading spinner while auth state resolves
  if (authLoading || isAdminUser === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Not authenticated at all → redirect to admin login
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Authenticated but not admin → show access denied
  if (!isAdminUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="max-w-md text-center space-y-4 p-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
            <span className="text-2xl">🔒</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Access Denied</h1>
          <p className="text-sm text-muted-foreground">
            You don't have admin permissions. Please contact your administrator to request access.
          </p>
          <a href="/" className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all mt-2">
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  // Authenticated + admin role → show admin panel
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
