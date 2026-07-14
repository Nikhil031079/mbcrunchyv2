// MB Crunchy — Admin Dashboard Page (Placeholder)
import { Shield } from "lucide-react";

export default function Admin() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="border-2 border-black bg-white p-8 sm:p-12">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-20 w-20 items-center justify-center border-2 border-black bg-secondary text-secondary-foreground">
            <Shield className="h-10 w-10" />
          </div>
          <h1 className="mt-6 text-3xl font-black uppercase tracking-tight sm:text-4xl">
            Admin Dashboard
          </h1>
          <p className="mt-4 max-w-md text-sm text-muted-foreground leading-relaxed">
            Manage products, orders, categories, and users.
            Administrative access only.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4 w-full max-w-md">
            {["Products", "Orders", "Categories", "Users"].map((section) => (
              <div
                key={section}
                className="border-2 border-black bg-muted p-4 text-center hover:bg-muted-foreground/20 transition-colors cursor-pointer"
              >
                <p className="text-sm font-bold uppercase">{section}</p>
                <p className="mt-1 text-xs text-muted-foreground">Manage</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
