// ============================================================
// Zedcher — StatCard Component
// Reusable stat display card for dashboard and future pages.
// ============================================================

import type { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string;
  icon: ReactNode;
  color: "blue" | "green" | "amber";
}

export default function StatCard({ label, value, icon, color }: StatCardProps) {
  return (
    <div className="stat-card">
      <div className="stat-card-header">
        <span className="stat-card-label">{label}</span>
        <div className={`stat-card-icon ${color}`}>{icon}</div>
      </div>
      <span className="stat-card-value">{value}</span>
    </div>
  );
}

