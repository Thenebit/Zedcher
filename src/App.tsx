// ============================================================
// Zedcher — App Shell
// Layout: Sidebar (persistent) + content area (routed).
// Sidebar never unmounts. Only the <Outlet /> swaps on nav.
// ============================================================

import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import "./styles/global.css";
import "./styles/layout.css";

export default function App() {
  return (
    <div className="layout">
      <Sidebar />
      <main className="layout-content">
        <Outlet />
      </main>
    </div>
  );
}

