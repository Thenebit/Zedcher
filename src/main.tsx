// ============================================================
// Zedcher — Entry Point
// TransactionProvider wraps the entire app so all pages
// share the same transaction state.
// ============================================================

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TransactionProvider } from "./context/TransactionContext";
import App from "./App";
import Dashboard from "./pages/Dashboard";
import NewPV from "./pages/NewPV";
import {
  Transactions,
  ReprintPV,
  Accounts,
  Funds,
} from "./pages/Placeholders";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
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
    </BrowserRouter>
  </React.StrictMode>,
);
