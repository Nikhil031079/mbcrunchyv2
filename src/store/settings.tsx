// MB Crunchy — Settings Store (Prepared for future implementation)
import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from "react";
import type { AppSettings, ThemeMode } from "@/types";

interface SettingsContextValue {
  settings: AppSettings;
  setTheme: (theme: ThemeMode) => void;
  toggleNotifications: () => void;
  toggleSmsUpdates: () => void;
  toggleEmailUpdates: () => void;
  toggleLocation: () => void;
  setLanguage: (lang: string) => void;
  resetSettings: () => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

const defaultSettings: AppSettings = {
  theme: "light",
  language: "en",
  notifications: true,
  smsUpdates: false,
  emailUpdates: true,
  locationEnabled: false,
};

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings] = useState<AppSettings>(defaultSettings);

  const setTheme = useCallback((_theme: ThemeMode) => {
    console.log("[Settings] setTheme — not implemented yet", _theme);
  }, []);

  const toggleNotifications = useCallback(() => {
    console.log("[Settings] toggleNotifications — not implemented yet");
  }, []);

  const toggleSmsUpdates = useCallback(() => {
    console.log("[Settings] toggleSmsUpdates — not implemented yet");
  }, []);

  const toggleEmailUpdates = useCallback(() => {
    console.log("[Settings] toggleEmailUpdates — not implemented yet");
  }, []);

  const toggleLocation = useCallback(() => {
    console.log("[Settings] toggleLocation — not implemented yet");
  }, []);

  const setLanguage = useCallback((_lang: string) => {
    console.log("[Settings] setLanguage — not implemented yet", _lang);
  }, []);

  const resetSettings = useCallback(() => {
    console.log("[Settings] resetSettings — not implemented yet");
  }, []);

  const value = useMemo<SettingsContextValue>(
    () => ({
      settings,
      setTheme,
      toggleNotifications,
      toggleSmsUpdates,
      toggleEmailUpdates,
      toggleLocation,
      setLanguage,
      resetSettings,
    }),
    [settings, setTheme, toggleNotifications, toggleSmsUpdates, toggleEmailUpdates, toggleLocation, setLanguage, resetSettings],
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}
