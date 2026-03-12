// ============================================================
// Zedcher — Account Context
// In-memory store for Chart of Accounts.
// PV form dropdown reads from this. New accounts appear
// immediately in the form after being added here.
// ============================================================

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { Account } from "../types";
import { MOCK_ACCOUNTS } from "../data/mock";

interface AccountContextValue {
  accounts: Account[];
  addAccount: (acct: Omit<Account, "id">) => Account;
  deleteAccount: (id: number) => void;
}

const AccountContext = createContext<AccountContextValue | null>(null);

export function AccountProvider({ children }: { children: ReactNode }) {
  const [accounts, setAccounts] = useState<Account[]>(MOCK_ACCOUNTS);

  const addAccount = useCallback(
    (acct: Omit<Account, "id">): Account => {
      const newAcct: Account = {
        ...acct,
        id: Date.now(),
      };
      setAccounts((prev) => [...prev, newAcct]);
      return newAcct;
    },
    [],
  );

  const deleteAccount = useCallback((id: number) => {
    setAccounts((prev) => prev.filter((a) => a.id !== id));
  }, []);

  return (
    <AccountContext.Provider value={{ accounts, addAccount, deleteAccount }}>
      {children}
    </AccountContext.Provider>
  );
}

export function useAccounts(): AccountContextValue {
  const ctx = useContext(AccountContext);
  if (!ctx) {
    throw new Error("useAccounts must be used within AccountProvider");
  }
  return ctx;
}

