// MB Crunchy — User Store (Prepared for future implementation)
import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from "react";
import type { UserProfile, UserAddress } from "@/types";

interface UserContextValue {
  profile: UserProfile | null;
  isLoggedIn: boolean;
  updateProfile: (data: Partial<UserProfile>) => void;
  addAddress: (address: UserAddress) => void;
  updateAddress: (id: string, address: Partial<UserAddress>) => void;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [profile] = useState<UserProfile | null>(null);

  const updateProfile = useCallback((_data: Partial<UserProfile>) => {
    console.log("[User] updateProfile — not implemented yet", _data);
  }, []);

  const addAddress = useCallback((_address: UserAddress) => {
    console.log("[User] addAddress — not implemented yet", _address);
  }, []);

  const updateAddress = useCallback((_id: string, _address: Partial<UserAddress>) => {
    console.log("[User] updateAddress — not implemented yet", _id, _address);
  }, []);

  const removeAddress = useCallback((_id: string) => {
    console.log("[User] removeAddress — not implemented yet", _id);
  }, []);

  const setDefaultAddress = useCallback((_id: string) => {
    console.log("[User] setDefaultAddress — not implemented yet", _id);
  }, []);

  const logout = useCallback(() => {
    console.log("[User] logout — not implemented yet");
  }, []);

  const value = useMemo<UserContextValue>(
    () => ({
      profile,
      isLoggedIn: profile !== null,
      updateProfile,
      addAddress,
      updateAddress,
      removeAddress,
      setDefaultAddress,
      logout,
    }),
    [profile, updateProfile, addAddress, updateAddress, removeAddress, setDefaultAddress, logout],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser(): UserContextValue {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
}
