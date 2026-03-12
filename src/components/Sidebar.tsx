// ============================================================
// Zedcher — Sidebar Navigation
// Persistent sidebar with NavLink for active-state styling.
// Icons from lucide-react. Never re-renders on page change
// (only the active class toggles via NavLink).
// ============================================================

import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FilePlus,
  List,
  Printer,
  BookOpen,
  Landmark,
} from "lucide-react";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/new-pv", label: "New PV", icon: FilePlus },
  { to: "/transactions", label: "Transactions", icon: List },
  { to: "/reprint", label: "Reprint PV", icon: Printer },
  { to: "/accounts", label: "Accounts", icon: BookOpen },
  { to: "/funds", label: "Funds", icon: Landmark },
] as const;

export default function Sidebar() {
  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="sidebar-brand">
        <img src="/src/assets/logo.png" alt="Zedcher" className="sidebar-brand-logo" / >
        <span className="sidebar-brand-name">Zedcher</span>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `sidebar-link${isActive ? " active" : ""}`
            }
          >
            <Icon />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="sidebar-footer-org">Zedulo</div>
        <div className="sidebar-footer-text">Payment Voucher System</div>
      </div>
    </aside>
  );
}
