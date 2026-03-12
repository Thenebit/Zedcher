// ============================================================
// Zedcher — Transaction Context
// In-memory store for transactions. All pages read from here.
// When SQLite backend is ready, this becomes invoke() calls.
// The context pre-loads mock data so dashboard still works.
// ============================================================

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { Transaction } from "../types";
import { SEED_TRANSACTIONS } from "../data/mock";

interface TransactionContextValue {
  transactions: Transaction[];
  addTransaction: (txn: Omit<Transaction, "id" | "created_at">) => Transaction;
  getNextPvNumber: (initials: string, fundAcronym: string) => string;
  getNextTransNo: () => string;
}

const TransactionContext = createContext<TransactionContextValue | null>(null);

export function TransactionProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>(SEED_TRANSACTIONS);

  const addTransaction = useCallback(
    (txn: Omit<Transaction, "id" | "created_at">): Transaction => {
      const newTxn: Transaction = {
        ...txn,
        id: transactions.length + 1,
        created_at: new Date().toISOString(),
      };
      setTransactions((prev) => [...prev, newTxn]);
      return newTxn;
    },
    [transactions.length],
  );

  const getNextPvNumber = useCallback(
    (initials: string, fundAcronym: string): string => {
      const now = new Date();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const year = now.getFullYear();

      // Count existing PVs for this fund + month combo
      const count = transactions.filter((t) => {
        const d = new Date(t.date);
        return (
          t.pv_no.includes(`/${fundAcronym}/`) &&
          d.getMonth() === now.getMonth() &&
          d.getFullYear() === now.getFullYear()
        );
      }).length;

      const seq = String(count + 1).padStart(3, "0");
      return `${initials.toUpperCase()}/${fundAcronym}/${seq}/${month}/${year}`;
    },
    [transactions],
  );

  const getNextTransNo = useCallback((): string => {
    const seq = String(transactions.length + 1).padStart(3, "0");
    return `TRN${seq}`;
  }, [transactions.length]);

  return (
    <TransactionContext.Provider
      value={{ transactions, addTransaction, getNextPvNumber, getNextTransNo }}
    >
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransactions(): TransactionContextValue {
  const ctx = useContext(TransactionContext);
  if (!ctx) {
    throw new Error("useTransactions must be used within TransactionProvider");
  }
  return ctx;
}

