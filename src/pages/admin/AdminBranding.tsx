// MB Crunchy — Full Branding Settings with Logo Uploads
import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Save, Image, Globe, Mail, Phone, MessageCircle, Instagram, Facebook, Youtube, Twitter, FileText } from "lucide-react";
import { CardSkeleton } from "@/components/admin/LoadingSkeleton";
import { toast } from "sonner";
import ImageUpload from "@/components/admin/ImageUpload";

export default function AdminBranding() {
  const branding = useQuery(api.settings.getBranding);
  const update = useMutation(api.settings.updateBranding);
  const [form, setForm] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  const data = form ?? branding ?? {};

  const handleSave = async () => {
    setSaving(true);
    try {
      await update({
        storeName: data.storeName || undefined,
        businessName: data.businessName || undefined,
        tagline: data.tagline || undefined,
        primaryColor: data.primaryColor || undefined,
        secondaryColor: data.secondaryColor || undefined,
        accentColor: data.accentColor || undefined,
        theme: data.theme || undefined,
        typography: data.typography || undefined,
        logo: data.logo || undefined,
        logoDark: data.logoDark || undefined,
        logoLight: data.logoLight || undefined,
        footerLogo: data.footerLogo || undefined,
        favicon: data.favicon || undefined,
        appIcon: data.appIcon || undefined,
        aboutText: data.aboutText || undefined,
        storeEmail: data.storeEmail || undefined,
        storePhone: data.storePhone || undefined,
        storeWhatsapp: data.storeWhatsapp || undefined,
        socialFacebook: data.socialFacebook || undefined,
        socialInstagram: data.socialInstagram || undefined,
        socialYoutube: data.socialYoutube || undefined,
        socialTwitter: data.socialTwitter || undefined,
        website: data.website || undefined,
        copyrightText: data.copyrightText || undefined,
      });
      toast.success("Branding settings saved");
    } catch (e: any) {
      toast.error(e.message || "Failed to save");
    }
    setSaving(false);
  };

  if (branding === undefined && form === null) return <CardSkeleton />;

  const updateField = (key: string, value: any) => {
    setForm({ ...data, [key]: value });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Branding</h1>
          <p className="text-sm text-muted-foreground">Customize your brand appearance — logos, colors, and identity</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all shadow-sm disabled:opacity-50"
        >
          <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* Live Preview Banner */}
      {data.primaryColor && (
        <div
          className="rounded-2xl p-6 sm:p-8 text-center shadow-sm border border-border/60"
          style={{
            backgroundColor: data.primaryColor || "#C62828",
          }}
        >
          <div className="max-w-md mx-auto space-y-2">
            {data.logo ? (
              <img src={data.logo} alt="Logo" className="h-12 mx-auto" />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 text-white font-black mx-auto">
                MC
              </div>
            )}
            <p className="text-xl font-bold text-white">{data.storeName || "MB Crunchy"}</p>
            <p className="text-sm text-white/80">{data.tagline || "Fresh • Homemade • Premium"}</p>
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* ═══ Store Identity ═══ */}
        <div className="rounded-2xl bg-white border border-border/60 p-6 shadow-sm">
          <h2 className="font-semibold mb-4 flex items-center gap-2 text-base">
            <FileText className="h-4 w-4 text-primary" /> Store Identity
          </h2>
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-semibold uppercase text-muted-foreground">Store Name</label>
              <input value={data.storeName || ""} onChange={e => updateField("storeName", e.target.value)}
                className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="MB Crunchy" />
            </div>
            <div>
              <label className="text-[10px] font-semibold uppercase text-muted-foreground">Business Name (Legal)</label>
              <input value={data.businessName || ""} onChange={e => updateField("businessName", e.target.value)}
                className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="MB Crunchy Foods Pvt. Ltd." />
            </div>
            <div>
              <label className="text-[10px] font-semibold uppercase text-muted-foreground">Tagline</label>
              <input value={data.tagline || ""} onChange={e => updateField("tagline", e.target.value)}
                className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="Fresh • Homemade • Premium" />
            </div>
            <div>
              <label className="text-[10px] font-semibold uppercase text-muted-foreground">About Text</label>
              <textarea value={data.aboutText || ""} onChange={e => updateField("aboutText", e.target.value)}
                rows={4}
                className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                placeholder="Describe your business..." />
            </div>
          </div>
        </div>

        {/* ═══ Theme Colors ═══ */}
        <div className="rounded-2xl bg-white border border-border/60 p-6 shadow-sm">
          <h2 className="font-semibold mb-4 flex items-center gap-2 text-base">
            <Image className="h-4 w-4 text-primary" /> Theme Colors
          </h2>
          <div className="space-y-4">
            {[
              { key: "primaryColor", label: "Primary Color", default: "#C62828" },
              { key: "secondaryColor", label: "Secondary Color", default: "#111111" },
              { key: "accentColor", label: "Accent Color", default: "#F9A825" },
            ].map(({ key, label, default: def }) => (
              <div key={key}>
                <label className="text-[10px] font-semibold uppercase text-muted-foreground">{label}</label>
                <div className="mt-1 flex items-center gap-3">
                  <input
                    type="color"
                    value={data[key] || def}
                    onChange={e => updateField(key, e.target.value)}
                    className="h-10 w-10 shrink-0 rounded-xl border border-border cursor-pointer"
                  />
                  <input
                    value={data[key] || def}
                    onChange={e => updateField(key, e.target.value)}
                    className="flex-1 rounded-xl border border-border bg-white px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>
            ))}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-semibold uppercase text-muted-foreground">Theme</label>
                <select value={data.theme || "light"} onChange={e => updateField("theme", e.target.value)}
                  className="mt-1 w-full rounded-xl border border-border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="auto">Auto</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-semibold uppercase text-muted-foreground">Typography</label>
                <select value={data.typography || "inter"} onChange={e => updateField("typography", e.target.value)}
                  className="mt-1 w-full rounded-xl border border-border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                  <option value="inter">Inter</option>
                  <option value="poppins">Poppins</option>
                  <option value="playfair">Playfair Display</option>
                  <option value="jakarta">Plus Jakarta Sans</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ Logos ═══ */}
        <div className="rounded-2xl bg-white border border-border/60 p-6 shadow-sm lg:col-span-2">
          <h2 className="font-semibold mb-4 flex items-center gap-2 text-base">
            <Image className="h-4 w-4 text-primary" /> Brand Logos
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-3">
              <ImageUpload
                label="Main Logo"
                value={data.logo || ""}
                onChange={(v) => updateField("logo", Array.isArray(v) ? v[0] : v)}
                multiple={false}
                maxFiles={1}
                maxSizeMB={5}
                accept="image/png,image/webp,image/svg+xml"
              />
              <p className="text-[10px] text-muted-foreground/60">Shown on website header, checkout, admin</p>
            </div>
            <div className="space-y-3">
              <ImageUpload
                label="Dark Logo (for light backgrounds)"
                value={data.logoDark || ""}
                onChange={(v) => updateField("logoDark", Array.isArray(v) ? v[0] : v)}
                multiple={false}
                maxFiles={1}
                maxSizeMB={5}
                accept="image/png,image/webp,image/svg+xml"
              />
              <p className="text-[10px] text-muted-foreground/60">Used on light/white sections</p>
            </div>
            <div className="space-y-3">
              <ImageUpload
                label="Light Logo (for dark backgrounds)"
                value={data.logoLight || ""}
                onChange={(v) => updateField("logoLight", Array.isArray(v) ? v[0] : v)}
                multiple={false}
                maxFiles={1}
                maxSizeMB={5}
                accept="image/png,image/webp,image/svg+xml"
              />
              <p className="text-[10px] text-muted-foreground/60">Used on dark colored sections</p>
            </div>
            <div className="space-y-3">
              <ImageUpload
                label="Footer Logo"
                value={data.footerLogo || ""}
                onChange={(v) => updateField("footerLogo", Array.isArray(v) ? v[0] : v)}
                multiple={false}
                maxFiles={1}
                maxSizeMB={5}
                accept="image/png,image/webp,image/svg+xml"
              />
              <p className="text-[10px] text-muted-foreground/60">Separate logo for the footer section</p>
            </div>
            <div className="space-y-3">
              <ImageUpload
                label="Favicon"
                value={data.favicon || ""}
                onChange={(v) => updateField("favicon", Array.isArray(v) ? v[0] : v)}
                multiple={false}
                maxFiles={1}
                maxSizeMB={1}
                accept="image/png,image/x-icon,image/svg+xml"
              />
              <p className="text-[10px] text-muted-foreground/60">Browser tab icon (32×32 PNG or .ico)</p>
            </div>
            <div className="space-y-3">
              <ImageUpload
                label="App Icon"
                value={data.appIcon || ""}
                onChange={(v) => updateField("appIcon", Array.isArray(v) ? v[0] : v)}
                multiple={false}
                maxFiles={1}
                maxSizeMB={5}
                accept="image/png,image/webp"
              />
              <p className="text-[10px] text-muted-foreground/60">Mobile app / PWA icon (512×512)</p>
            </div>
          </div>
        </div>

        {/* ═══ Contact Information ═══ */}
        <div className="rounded-2xl bg-white border border-border/60 p-6 shadow-sm">
          <h2 className="font-semibold mb-4 flex items-center gap-2 text-base">
            <Globe className="h-4 w-4 text-primary" /> Contact Information
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-[10px] font-semibold uppercase text-muted-foreground flex items-center gap-1">
                <Globe className="h-3 w-3" /> Website URL
              </label>
              <input value={data.website || ""} onChange={e => updateField("website", e.target.value)}
                className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="https://mbcrunchy.com" />
            </div>
            <div>
              <label className="text-[10px] font-semibold uppercase text-muted-foreground flex items-center gap-1">
                <Mail className="h-3 w-3" /> Store Email
              </label>
              <input value={data.storeEmail || ""} onChange={e => updateField("storeEmail", e.target.value)}
                className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="hello@mbcrunchy.com" />
            </div>
            <div>
              <label className="text-[10px] font-semibold uppercase text-muted-foreground flex items-center gap-1">
                <Phone className="h-3 w-3" /> Store Phone
              </label>
              <input value={data.storePhone || ""} onChange={e => updateField("storePhone", e.target.value)}
                className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="+91 98765 43210" />
            </div>
            <div className="col-span-2">
              <label className="text-[10px] font-semibold uppercase text-muted-foreground flex items-center gap-1">
                <MessageCircle className="h-3 w-3" /> WhatsApp Number
              </label>
              <input value={data.storeWhatsapp || ""} onChange={e => updateField("storeWhatsapp", e.target.value)}
                className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="+91 98765 43210" />
            </div>
          </div>
        </div>

        {/* ═══ Social Links ═══ */}
        <div className="rounded-2xl bg-white border border-border/60 p-6 shadow-sm">
          <h2 className="font-semibold mb-4 flex items-center gap-2 text-base">
            <Globe className="h-4 w-4 text-primary" /> Social Media Links
          </h2>
          <div className="space-y-4">
            {[
              { key: "socialInstagram", label: "Instagram URL", icon: Instagram, placeholder: "https://instagram.com/mbcrunchy" },
              { key: "socialFacebook", label: "Facebook URL", icon: Facebook, placeholder: "https://facebook.com/mbcrunchy" },
              { key: "socialYoutube", label: "YouTube URL", icon: Youtube, placeholder: "https://youtube.com/@mbcrunchy" },
              { key: "socialTwitter", label: "Twitter / X URL", icon: Twitter, placeholder: "https://twitter.com/mbcrunchy" },
            ].map(({ key, label, icon: Icon, placeholder }) => (
              <div key={key}>
                <label className="text-[10px] font-semibold uppercase text-muted-foreground flex items-center gap-1">
                  <Icon className="h-3 w-3" /> {label}
                </label>
                <input value={data[key] || ""} onChange={e => updateField(key, e.target.value)}
                  className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder={placeholder} />
              </div>
            ))}
          </div>
        </div>

        {/* ═══ Footer ═══ */}
        <div className="rounded-2xl bg-white border border-border/60 p-6 shadow-sm">
          <h2 className="font-semibold mb-4 flex items-center gap-2 text-base">
            <FileText className="h-4 w-4 text-primary" /> Footer & Copyright
          </h2>
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-semibold uppercase text-muted-foreground">Copyright Text</label>
              <input value={data.copyrightText || ""} onChange={e => updateField("copyrightText", e.target.value)}
                className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder='© 2024 MB Crunchy. All rights reserved.' />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
