// MB Crunchy — Printable Order Receipt
import { useRef } from "react";
import { useParams, Link } from "react-router";
import { ArrowLeft, Printer, Download, CheckCircle } from "lucide-react";

const demoReceipt = {
  number: "MB-RCPT-001",
  customer: "Rahul Sharma",
  phone: "9876543210",
  email: "rahul@example.com",
  type: "Delivery",
  address: "123, Green Valley Apartments, Andheri East, Mumbai - 400093",
  date: new Date().toLocaleString(),
  items: [
    { name: "Classic Margherita Pizza", qty: 1, price: 249 },
    { name: "Peri Peri Fries", qty: 2, price: 119 },
    { name: "Garlic Bread", qty: 1, price: 99 },
  ],
  subtotal: 586,
  delivery: 29,
  discount: 0,
  total: 615,
  payment: "Cash on Delivery",
  status: "Pending",
};

export default function OrderReceipt() {
  const { orderNum } = useParams<{ orderNum: string }>();
  const receiptRef = useRef<HTMLDivElement>(null);
  const receipt = demoReceipt;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-background print:bg-white">
      {/* Print/Export controls - hidden when printing */}
      <div className="no-print mx-auto max-w-3xl px-4 py-4 sm:px-6 flex items-center justify-between print:hidden">
        <Link to="/admin/orders" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Orders
        </Link>
        <div className="flex gap-2">
          <button onClick={handlePrint}
            className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-all">
            <Printer className="h-4 w-4" /> Print
          </button>
          <button
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all">
            <Download className="h-4 w-4" /> Download PDF
          </button>
        </div>
      </div>

      {/* Receipt */}
      <div ref={receiptRef} className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8 print:px-0 print:py-0">
        <div className="rounded-2xl bg-white border border-border/60 shadow-sm print:border-none print:shadow-none overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-primary/90 text-white p-6 sm:p-8 text-center print:bg-gray-100 print:text-gray-900">
            <div className="flex items-center justify-center gap-3 mb-1">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 text-white font-black text-lg print:bg-gray-200 print:text-gray-700">
                MC
              </div>
              <div>
                <h1 className="text-xl font-bold">MB Crunchy</h1>
                <p className="text-xs text-white/70 print:text-gray-500">Fresh • Homemade • Premium</p>
              </div>
            </div>
            <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-4 py-1 text-xs font-medium print:bg-gray-100">
              <CheckCircle className="h-3 w-3" /> Order Receipt
            </div>
          </div>

          {/* Order Info */}
          <div className="p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <p className="text-[10px] font-semibold uppercase text-muted-foreground">Order Number</p>
                <p className="font-mono font-bold text-sm mt-0.5">{receipt.number}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase text-muted-foreground">Date</p>
                <p className="text-sm mt-0.5">{receipt.date}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase text-muted-foreground">Status</p>
                <span className="inline-block mt-0.5 rounded-lg bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700">{receipt.status}</span>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase text-muted-foreground">Payment</p>
                <p className="text-sm mt-0.5">{receipt.payment}</p>
              </div>
            </div>

            {/* Customer */}
            <div className="rounded-xl bg-muted/20 p-4">
              <p className="text-[10px] font-semibold uppercase text-muted-foreground mb-2">Customer Details</p>
              <p className="text-sm font-medium">{receipt.customer}</p>
              <p className="text-xs text-muted-foreground">{receipt.phone} {receipt.email ? `• ${receipt.email}` : ""}</p>
              {receipt.type === "Delivery" && (
                <div className="mt-2 text-xs text-muted-foreground flex items-start gap-1.5">
                  <span>📍</span>
                  <span>{receipt.address}</span>
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-1 capitalize">{receipt.type}</p>
            </div>

            {/* Items Table */}
            <div>
              <p className="text-xs font-semibold uppercase text-muted-foreground mb-3">Order Items</p>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/60">
                    <th className="text-left py-2 font-medium text-muted-foreground text-xs uppercase">Item</th>
                    <th className="text-center py-2 font-medium text-muted-foreground text-xs uppercase">Qty</th>
                    <th className="text-right py-2 font-medium text-muted-foreground text-xs uppercase">Price</th>
                    <th className="text-right py-2 font-medium text-muted-foreground text-xs uppercase">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {receipt.items.map((item, i) => (
                    <tr key={i} className="border-b border-border/40">
                      <td className="py-3">{item.name}</td>
                      <td className="py-3 text-center">{item.qty}</td>
                      <td className="py-3 text-right">₹{item.price}</td>
                      <td className="py-3 text-right font-medium">₹{item.price * item.qty}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="border-t border-border/60 pt-4 space-y-1.5 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>₹{receipt.subtotal}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Delivery</span><span>{receipt.delivery === 0 ? "Free" : `₹${receipt.delivery}`}</span></div>
              {receipt.discount > 0 && <div className="flex justify-between text-emerald-600"><span>Discount</span><span>−₹{receipt.discount}</span></div>}
              <div className="flex justify-between font-bold text-lg border-t border-border/40 pt-2"><span>Total</span><span>₹{receipt.total}</span></div>
            </div>

            {/* QR & Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border/40">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="h-16 w-16 rounded-xl border-2 border-dashed border-border flex items-center justify-center">
                  <span className="text-lg">📱</span>
                </div>
                <div>
                  <p className="font-medium text-foreground text-sm">Thank you!</p>
                  <p>Scan to track your order</p>
                </div>
              </div>
              <div className="text-right text-xs text-muted-foreground">
                <p>MB Crunchy</p>
                <p>Fresh • Homemade • Premium</p>
                <p className="mt-1">contact@mbcrunchy.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
