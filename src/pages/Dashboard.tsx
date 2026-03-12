// ============================================================
// Zedcher — Dashboard Page
// Top: 4 stat cards
// Middle: monthly bar chart (left) + recent transactions (right)
// Data from mock service — swap to invoke() later.
// ============================================================

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Receipt,
  Banknote,
  CalendarDays,
  TrendingUp,
} from "lucide-react";
import StatCard from "../components/StatCard";
import {
  getDashboardStats,
  getMonthlyTransactionCounts,
  getRecentTransactions,
} from "../data/mock";
import type { DashboardStats, MonthlyCount, Transaction } from "../types";
import "../styles/dashboard.css";

// Format number as GHS currency
function formatCurrency(amount: number): string {
  return `GHS ${amount.toLocaleString("en-GH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

// Format ISO date to readable
function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [monthly, setMonthly] = useState<MonthlyCount[]>([]);
  const [recent, setRecent] = useState<Transaction[]>([]);

  useEffect(() => {
    // Parallel fetch — same pattern as real Tauri invoke()
    Promise.all([
      getDashboardStats(),
      getMonthlyTransactionCounts(),
      getRecentTransactions(6),
    ]).then(([s, m, r]) => {
      setStats(s);
      setMonthly(m);
      setRecent(r);
    });
  }, []);

  if (!stats) return null; // Brief flash guard — will be instant with mock data

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Payment voucher overview</p>
      </div>

      {/* ---- Stat Cards ---- */}
      <div className="stats-grid">
        <StatCard
          label="Total Transactions"
          value={stats.total_transactions.toString()}
          icon={<Receipt />}
          color="blue"
        />
        <StatCard
          label="Total Amount Paid"
          value={formatCurrency(stats.total_amount_paid)}
          icon={<Banknote />}
          color="green"
        />
        <StatCard
          label="This Month"
          value={stats.month_transactions.toString()}
          icon={<CalendarDays />}
          color="amber"
        />
        <StatCard
          label="This Month Amount"
          value={formatCurrency(stats.month_amount)}
          icon={<TrendingUp />}
          color="blue"
        />
      </div>

      {/* ---- Middle: Chart + Recent Table ---- */}
      <div className="dashboard-middle">
        {/* Bar Chart */}
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h2 className="dashboard-card-title">Monthly Transactions</h2>
            <span className="dashboard-card-badge">Last 6 months</span>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={monthly} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                fontSize={12}
                tick={{ fill: "#6b7280" }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                fontSize={12}
                tick={{ fill: "#6b7280" }}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                  fontSize: "13px",
                }}
              />
              <Bar
                dataKey="count"
                fill="#3b82f6"
                radius={[6, 6, 0, 0]}
                name="Transactions"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Transactions */}
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h2 className="dashboard-card-title">Recent Transactions</h2>
            <span className="dashboard-card-badge">{recent.length} latest</span>
          </div>
          <table className="recent-table">
            <thead>
              <tr>
                <th>PV No.</th>
                <th>Payee</th>
                <th>Fund</th>
                <th>Date</th>
                <th style={{ textAlign: "right" }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((txn) => (
                <tr key={txn.id}>
                  <td className="pv-no">{txn.pv_no}</td>
                  <td>{txn.payee}</td>
                  <td>
                    <span className="fund-badge">{txn.source_of_fund}</span>
                  </td>
                  <td className="date">{formatDate(txn.date)}</td>
                  <td className="amount">
                    {formatCurrency(txn.amount_to_pay)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

