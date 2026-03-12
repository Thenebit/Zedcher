// ============================================================
// Zedcher — Fund Context
// In-memory store for Source of Funds.
// PV form dropdown reads from this. New funds appear
// immediately in the form after being added here.
// ============================================================

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { Fund } from "../types";
import { MOCK_FUNDS } from "../data/mock";

interface FundContextValue {
  funds: Fund[];
  addFund: (fund: Omit<Fund, "id">) => Fund;
  deleteFund: (id: number) => void;
}

const FundContext = createContext<FundContextValue | null>(null);

export function FundProvider({ children }: { children: ReactNode }) {
  const [funds, setFunds] = useState<Fund[]>(MOCK_FUNDS);

  const addFund = useCallback(
    (fund: Omit<Fund, "id">): Fund => {
      const newFund: Fund = {
        ...fund,
        id: Date.now(),
      };
      setFunds((prev) => [...prev, newFund]);
      return newFund;
    },
    [],
  );

  const deleteFund = useCallback((id: number) => {
    setFunds((prev) => prev.filter((f) => f.id !== id));
  }, []);

  return (
    <FundContext.Provider value={{ funds, addFund, deleteFund }}>
      {children}
    </FundContext.Provider>
  );
}

export function useFunds(): FundContextValue {
  const ctx = useContext(FundContext);
  if (!ctx) {
    throw new Error("useFunds must be used within FundProvider");
  }
  return ctx;
}

