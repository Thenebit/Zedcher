// ============================================================
// Zedcher — Entry Point
// ============================================================

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TransactionProvider } from "./context/TransactionContext";
import { AccountProvider } from "./context/AccountContext";
import App from "./App";
import Dashboard from "./pages/Dashboard";
import NewPV from "./pages/NewPV";
import Transactions from "./pages/Transactions";
import Accounts from "./pages/Accounts";
import {
  ReprintPV,
  Funds,
} from "./pages/Placeholders";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <AccountProvider>
        <TransactionProvider>
          <Routes>
            <Route element={<App />}>
              <Route index element={<Dashboard />} />
              <Route path="new-pv" element={<NewPV />} />
              <Route path="transactions" element={<Transactions />} />
              <Route path="reprint" element={<ReprintPV />} />
              <Route path="accounts" element={<Accounts />} />
              <Route path="funds" element={<Funds />} />
            </Route>
          </Routes>
        </TransactionProvider>
      </AccountProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
