// MB Crunchy — useAppSettings Hook
// Fetches all dynamic business settings from Convex and provides them to components.
// Every business rule should be read from here — never hardcoded.

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export interface AppSettings {
  business: {
    name: string;
    tagline: string;
    logo?: string;
    email?: string;
    phone?: string;
    whatsapp?: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
    gst?: string;
  } | null;
  branding: {
    primaryColor?: string;
    secondaryColor?: string;
    accentColor?: string;
    storeName?: string;
    tagline?: string;
    aboutText?: string;
    logo?: string;
    favicon?: string;
  } | null;
  payments: {
    upiId?: string;
    upiQrImage?: string;
    cashEnabled: boolean;
    upiEnabled: boolean;
    whatsappConfirmation: boolean;
  } | null;
  deliveryCharges: Array<{
    charge: number;
    minOrderFree?: number;
    estimatedMinutes?: number;
  }>;
  businessHours: Array<{
    day: string;
    open?: string;
    close?: string;
    isOpen: boolean;
  }>;
  system: {
    currency: string;
    currencySymbol: string;
    timezone: string;
    orderPrefix: string;
    invoicePrefix: string;
    maintenanceMode: boolean;
    packagingCharge: number;
    gstPercent?: number;
    taxPercent?: number;
    deliveryRadius?: number;
    minOrderValue?: number;
    freeDeliveryThreshold?: number;
    estimatedPrepMinutes: number;
    estimatedDeliveryMinutes: number;
    socialMediaInstagram?: string;
    socialMediaFacebook?: string;
    socialMediaYoutube?: string;
  };
  seo: {
    defaultTitle: string;
    defaultDescription: string;
    ogImage?: string;
    twitterHandle?: string;
    metaKeywords?: string;
  };
}

export function useAppSettings() {
  const raw = useQuery(api.settings.getAllAppSettings);

  if (!raw) return null;

  return raw as AppSettings;
}

export function useSettingsReady() {
  const raw = useQuery(api.settings.getAllAppSettings);
  return !!raw;
}
