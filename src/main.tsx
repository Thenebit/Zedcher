// ============================================================
// Zedcher — Entry Point
// All routes defined here. App is the layout wrapper.
// Each page is a child route rendered via <Outlet />.
// ============================================================

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Dashboard from "./pages/Dashboard";
import {
  NewPV,
  Transactions,
  ReprintPV,
  Accounts,
  Funds,
} from "./pages/Placeholders";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
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
    </BrowserRouter>
  </React.StrictMode>,
);

