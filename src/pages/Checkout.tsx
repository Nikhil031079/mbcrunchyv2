// MB Crunchy — 5-Step Checkout Page
import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Check, ShoppingBag, MapPin, CreditCard, FileText, QrCode, Copy, Upload, CheckCircle, Truck } from "lucide-react";
import { useCart } from "@/store/cart";
import { toast } from "sonner";
import type { CheckoutCustomer, CheckoutAddress, PaymentMethod, OrderType } from "@/types";

const steps = [
  { num: 1, label: "Details", icon: FileText },
  { num: 2, label: "Order Type", icon: Truck },
  { num: 3, label: "Payment", icon: CreditCard },
  { num: 4, label: "Review", icon: Check },
  { num: 5, label: "Confirm", icon: CheckCircle },
];

export default function Checkout() {
  const navigate = useNavigate();
  const { items, subtotal, deliveryFee, savings, total, clearCart } = useCart();
  const [step, setStep] = useState(1);
  const [placing, setPlacing] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [upiCopied, setUpiCopied] = useState(false);

  // Step 1: Customer
  const [customer, setCustomer] = useState<CheckoutCustomer>({ name: "", phone: "", email: "" });

  // Step 2: Order Type
  const [orderType, setOrderType] = useState<OrderType>("takeaway");
  const [address, setAddress] = useState<CheckoutAddress>({ houseNo: "", street: "", landmark: "", area: "", city: "", state: "", pincode: "" });

  // Step 3: Payment
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [upiReference, setUpiReference] = useState("");
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  // Step 4: Notes
  const [notes, setNotes] = useState("");

  const actualDeliveryFee = orderType === "takeaway" ? 0 : deliveryFee;
  const grandTotal = subtotal + actualDeliveryFee;

  if (items.length === 0 && !orderNumber) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
        <h1 className="text-xl font-bold mb-2">Nothing to checkout</h1>
        <p className="text-sm text-muted-foreground mb-6">Add items to your cart first.</p>
        <Link to="/kitchen" className="rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground">Browse Kitchen</Link>
      </div>
    );
  }

  const validateStep1 = () => {
    if (!customer.name.trim()) { toast.error("Please enter your name"); return false; }
    if (customer.phone.length < 10) { toast.error("Please enter a valid phone number"); return false; }
    return true;
  };

  const validateStep2 = () => {
    if (orderType === "delivery") {
      if (!address.houseNo.trim() || !address.area.trim() || !address.city.trim() || !address.pincode.trim()) {
        toast.error("Please fill in all required address fields"); return false;
      }
    }
    return true;
  };

  const validateStep4 = () => {
    return true; // Review step just shows confirmation
  };

  const handlePlaceOrder = async () => {
    setPlacing(true);
    try {
      await new Promise(r => setTimeout(r, 1500));
      const generatedNumber = `MB-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      setOrderNumber(generatedNumber);
      clearCart();
      setStep(5);
      toast.success("Order placed successfully!");
    } catch {
      toast.error("Failed to place order. Please try again.");
    }
    setPlacing(false);
  };

  const nextStep = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    setStep(s => Math.min(s + 1, 5));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const prevStep = () => {
    setStep(s => Math.max(s - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Order Success View
  if (orderNumber) {
    const whatsappMessage = encodeURIComponent(
      `*MB Crunchy Order*\n\nOrder: ${orderNumber}\nCustomer: ${customer.name}\nPhone: ${customer.phone}${customer.email ? `\nEmail: ${customer.email}` : ""}\nType: ${orderType === "delivery" ? "Delivery" : "Takeaway"}${orderType === "delivery" ? `\nAddress: ${address.houseNo}, ${address.area}, ${address.city} - ${address.pincode}` : ""}\n\nItems:\n${items.map(i => `• ${i.name} x${i.quantity} - ₹${i.price * i.quantity}`).join("\n")}\n\nSubtotal: ₹${subtotal}\nDelivery: ${actualDeliveryFee === 0 ? "Free" : `₹${actualDeliveryFee}`}\nTotal: ₹${grandTotal}\n\nPayment: ${paymentMethod === "cash" ? "Cash on Delivery" : "UPI"}\nStatus: ${paymentMethod === "upi" && paymentConfirmed ? "Paid" : "Pending"}\n${notes ? `Notes: ${notes}` : ""}\n\nThank you for ordering with MB Crunchy! 🎉`
    );

    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-lg w-full text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 mx-auto mb-6">
            <CheckCircle className="h-10 w-10" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Order Placed! 🎉</h1>
          <p className="text-sm text-muted-foreground mb-2">Your order has been received.</p>
          <div className="rounded-xl bg-muted/30 border border-border/60 p-4 mb-6 inline-block">
            <p className="text-xs text-muted-foreground mb-1">Order Number</p>
            <p className="text-lg font-mono font-bold">{orderNumber}</p>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-6">
            <Truck className="h-4 w-4" />
            <span>Estimated {orderType === "delivery" ? "delivery" : "pickup"} time: 30-45 minutes</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href={`https://wa.me/?text=${whatsappMessage}`} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-200">
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Send WhatsApp
            </a>
            <Link to="/kitchen" className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-6 py-3 text-sm font-semibold hover:bg-muted transition-all">
              Continue Shopping
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  const formatAddress = (a: CheckoutAddress) => {
    const parts = [a.houseNo, a.street, a.landmark, a.area, a.city, a.state, a.pincode].filter(Boolean);
    return parts.join(", ");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Step Progress */}
        <div className="flex items-center justify-between mb-8 max-w-2xl mx-auto">
          {steps.map((s, i) => (
            <div key={s.num} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition-all duration-300 ${
                  step > s.num ? "bg-emerald-500 text-white" :
                  step === s.num ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-110" :
                  "bg-muted text-muted-foreground"
                }`}>
                  {step > s.num ? <Check className="h-5 w-5" /> : <s.icon className="h-4 w-4" />}
                </div>
                <span className={`text-[10px] font-medium mt-1.5 hidden sm:block ${step >= s.num ? "text-foreground" : "text-muted-foreground"}`}>{s.label}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={`h-0.5 w-8 sm:w-16 mx-2 transition-colors duration-300 ${step > s.num ? "bg-emerald-500" : "bg-muted"}`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>

                {/* Step 1: Customer Details */}
                {step === 1 && (
                  <div className="rounded-2xl bg-white border border-border/60 p-6 shadow-sm">
                    <h2 className="text-lg font-bold mb-1">Your Details</h2>
                    <p className="text-sm text-muted-foreground mb-6">We need this to confirm your order</p>
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-semibold uppercase text-muted-foreground">Full Name *</label>
                        <input value={customer.name} onChange={e => setCustomer({ ...customer, name: e.target.value })}
                          className="mt-1 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="John Doe" />
                      </div>
                      <div>
                        <label className="text-xs font-semibold uppercase text-muted-foreground">Phone Number *</label>
                        <input type="tel" value={customer.phone} onChange={e => setCustomer({ ...customer, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                          className="mt-1 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="9876543210" />
                      </div>
                      <div>
                        <label className="text-xs font-semibold uppercase text-muted-foreground">Email (optional)</label>
                        <input type="email" value={customer.email ?? ""} onChange={e => setCustomer({ ...customer, email: e.target.value })}
                          className="mt-1 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="john@example.com" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Order Type */}
                {step === 2 && (
                  <div className="rounded-2xl bg-white border border-border/60 p-6 shadow-sm">
                    <h2 className="text-lg font-bold mb-1">Order Type</h2>
                    <p className="text-sm text-muted-foreground mb-6">Choose how you'd like to receive your order</p>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <button onClick={() => setOrderType("takeaway")}
                        className={`rounded-xl border-2 p-5 text-center transition-all ${
                          orderType === "takeaway" ? "border-primary bg-primary/5" : "border-border/60 hover:border-muted-foreground/30"
                        }`}>
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mx-auto mb-3">
                          <ShoppingBag className="h-6 w-6" />
                        </div>
                        <p className="font-semibold text-sm">Takeaway</p>
                        <p className="text-xs text-muted-foreground mt-1">Pick up from store • Free</p>
                      </button>
                      <button onClick={() => setOrderType("delivery")}
                        className={`rounded-xl border-2 p-5 text-center transition-all ${
                          orderType === "delivery" ? "border-primary bg-primary/5" : "border-border/60 hover:border-muted-foreground/30"
                        }`}>
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mx-auto mb-3">
                          <Truck className="h-6 w-6" />
                        </div>
                        <p className="font-semibold text-sm">Delivery</p>
                        <p className="text-xs text-muted-foreground mt-1">{deliveryFee === 0 ? "Free delivery" : `₹${deliveryFee} delivery`}</p>
                      </button>
                    </div>

                    {orderType === "delivery" && (
                      <div className="space-y-4">
                        <h3 className="text-sm font-semibold flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> Delivery Address</h3>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="col-span-2">
                            <label className="text-[10px] font-semibold uppercase text-muted-foreground">House / Flat No. *</label>
                            <input value={address.houseNo} onChange={e => setAddress({ ...address, houseNo: e.target.value })}
                              className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="123" />
                          </div>
                          <div className="col-span-2">
                            <label className="text-[10px] font-semibold uppercase text-muted-foreground">Street / Colony</label>
                            <input value={address.street} onChange={e => setAddress({ ...address, street: e.target.value })}
                              className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="Main Street" />
                          </div>
                          <div className="col-span-2">
                            <label className="text-[10px] font-semibold uppercase text-muted-foreground">Landmark</label>
                            <input value={address.landmark} onChange={e => setAddress({ ...address, landmark: e.target.value })}
                              className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="Near..." />
                          </div>
                          <div className="col-span-2">
                            <label className="text-[10px] font-semibold uppercase text-muted-foreground">Area / Locality *</label>
                            <input value={address.area} onChange={e => setAddress({ ...address, area: e.target.value })}
                              className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="Area name" />
                          </div>
                          <div>
                            <label className="text-[10px] font-semibold uppercase text-muted-foreground">City *</label>
                            <input value={address.city} onChange={e => setAddress({ ...address, city: e.target.value })}
                              className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="City" />
                          </div>
                          <div>
                            <label className="text-[10px] font-semibold uppercase text-muted-foreground">State</label>
                            <input value={address.state} onChange={e => setAddress({ ...address, state: e.target.value })}
                              className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="State" />
                          </div>
                          <div>
                            <label className="text-[10px] font-semibold uppercase text-muted-foreground">Pincode *</label>
                            <input value={address.pincode} onChange={e => setAddress({ ...address, pincode: e.target.value.replace(/\D/g, "").slice(0, 6) })}
                              className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="560001" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Step 3: Payment */}
                {step === 3 && (
                  <div className="rounded-2xl bg-white border border-border/60 p-6 shadow-sm">
                    <h2 className="text-lg font-bold mb-1">Payment Method</h2>
                    <p className="text-sm text-muted-foreground mb-6">Choose how you'd like to pay</p>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <button onClick={() => { setPaymentMethod("cash"); setPaymentConfirmed(false); }}
                        className={`rounded-xl border-2 p-5 text-center transition-all ${
                          paymentMethod === "cash" ? "border-primary bg-primary/5" : "border-border/60 hover:border-muted-foreground/30"
                        }`}>
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 mx-auto mb-3">
                          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                        </div>
                        <p className="font-semibold text-sm">Cash on Delivery</p>
                        <p className="text-xs text-muted-foreground mt-1">Pay when you receive</p>
                      </button>
                      <button onClick={() => setPaymentMethod("upi")}
                        className={`rounded-xl border-2 p-5 text-center transition-all ${
                          paymentMethod === "upi" ? "border-primary bg-primary/5" : "border-border/60 hover:border-muted-foreground/30"
                        }`}>
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600 mx-auto mb-3">
                          <QrCode className="h-6 w-6" />
                        </div>
                        <p className="font-semibold text-sm">UPI</p>
                        <p className="text-xs text-muted-foreground mt-1">Google Pay, PhonePe, Paytm</p>
                      </button>
                    </div>

                    {paymentMethod === "upi" && (
                      <div className="rounded-xl bg-muted/30 border border-border/60 p-5 space-y-4">
                        <div className="flex items-center justify-center">
                          <div className="h-40 w-40 rounded-xl bg-white border-2 border-dashed border-border flex items-center justify-center">
                            <QrCode className="h-20 w-20 text-muted-foreground/40" />
                          </div>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground mb-1">Pay to UPI ID</p>
                          <div className="flex items-center justify-center gap-2">
                            <code className="text-sm font-mono font-bold bg-white px-3 py-1.5 rounded-lg border border-border">mbcrunchy@upi</code>
                            <button onClick={() => { navigator.clipboard.writeText("mbcrunchy@upi"); setUpiCopied(true); setTimeout(() => setUpiCopied(false), 2000); }}
                              className="rounded-lg p-2 text-muted-foreground hover:text-primary hover:bg-white transition-all">
                              <Copy className="h-4 w-4" />
                            </button>
                          </div>
                          {upiCopied && <p className="text-xs text-emerald-600 mt-1">Copied!</p>}
                        </div>
                        <div>
                          <label className="text-xs font-semibold uppercase text-muted-foreground">Transaction Reference (optional)</label>
                          <input value={upiReference} onChange={e => setUpiReference(e.target.value)}
                            className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="UPI reference number" />
                        </div>
                        <button onClick={() => setPaymentConfirmed(!paymentConfirmed)}
                          className={`w-full rounded-xl py-3 text-sm font-semibold transition-all ${
                            paymentConfirmed ? "bg-emerald-50 text-emerald-700 border-2 border-emerald-300" : "bg-primary text-primary-foreground hover:bg-primary/90"
                          }`}>
                          {paymentConfirmed ? "✓ Payment Completed" : "I have completed the payment"}
                        </button>
                      </div>
                    )}

                    {/* Optional notes */}
                    <div className="mt-6">
                      <label className="text-xs font-semibold uppercase text-muted-foreground">Order Notes (optional)</label>
                      <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2}
                        className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                        placeholder="Any special instructions..." />
                    </div>
                  </div>
                )}

                {/* Step 4: Review */}
                {step === 4 && (
                  <div className="rounded-2xl bg-white border border-border/60 p-6 shadow-sm">
                    <h2 className="text-lg font-bold mb-4">Review Your Order</h2>

                    <div className="space-y-4">
                      <div className="rounded-xl bg-muted/20 p-4">
                        <p className="text-xs font-semibold uppercase text-muted-foreground mb-2">Customer</p>
                        <p className="text-sm font-medium">{customer.name}</p>
                        <p className="text-sm text-muted-foreground">{customer.phone}{customer.email ? ` • ${customer.email}` : ""}</p>
                      </div>

                      <div className="rounded-xl bg-muted/20 p-4">
                        <p className="text-xs font-semibold uppercase text-muted-foreground mb-2">Order Type</p>
                        <div className="flex items-center gap-2">
                          {orderType === "delivery" ? <Truck className="h-4 w-4 text-primary" /> : <ShoppingBag className="h-4 w-4 text-primary" />}
                          <span className="text-sm font-medium capitalize">{orderType}</span>
                        </div>
                        {orderType === "delivery" && <p className="text-xs text-muted-foreground mt-1">{formatAddress(address)}</p>}
                      </div>

                      <div className="rounded-xl bg-muted/20 p-4">
                        <p className="text-xs font-semibold uppercase text-muted-foreground mb-2">Items</p>
                        <div className="space-y-2">
                          {items.map(item => (
                            <div key={item.productId} className="flex items-center justify-between text-sm">
                              <span>{item.name} × {item.quantity}</span>
                              <span className="font-medium">₹{item.price * item.quantity}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-xl bg-muted/20 p-4">
                        <p className="text-xs font-semibold uppercase text-muted-foreground mb-2">Payment</p>
                        <p className="text-sm font-medium capitalize">{paymentMethod === "cash" ? "Cash on Delivery" : "UPI"}</p>
                        {paymentMethod === "upi" && paymentConfirmed && (
                          <p className="text-xs text-emerald-600">✓ Payment confirmed</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl bg-white border border-border/60 p-5 shadow-sm space-y-3">
              <h3 className="font-bold">Summary</h3>
              {items.map(item => (
                <div key={item.productId} className="flex items-center justify-between text-xs">
                  <span className="flex-1 truncate">{item.name} × {item.quantity}</span>
                  <span className="font-medium">₹{item.price * item.quantity}</span>
                </div>
              ))}
              <div className="border-t border-border/40 pt-3 space-y-1.5 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>₹{subtotal}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Delivery</span><span>{actualDeliveryFee === 0 ? "Free" : `₹${actualDeliveryFee}`}</span></div>
                <div className="flex justify-between font-bold text-base border-t border-border/40 pt-2"><span>Total</span><span>₹{grandTotal}</span></div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex gap-2 pt-2">
                {step > 1 && step < 5 && (
                  <button onClick={prevStep} className="flex-1 rounded-xl border border-border py-3 text-xs font-semibold hover:bg-muted transition-all flex items-center justify-center gap-1">
                    <ChevronLeft className="h-4 w-4" /> Back
                  </button>
                )}
                {step < 4 && (
                  <button onClick={nextStep} className="flex-1 rounded-xl bg-primary py-3 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-all flex items-center justify-center gap-1">
                    Next <ChevronRight className="h-4 w-4" />
                  </button>
                )}
                {step === 4 && (
                  <button onClick={handlePlaceOrder} disabled={placing}
                    className="flex-1 rounded-xl bg-primary py-3 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center justify-center gap-1">
                    {placing ? "Placing..." : "Place Order"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
