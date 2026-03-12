// ============================================================
// Zedcher — Dashboard Page
// Now reads from TransactionContext (shared state).
// New PVs created via the form appear here immediately.
// ============================================================

import { useMemo } from "react";
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
import { useTransactions } from "../context/TransactionContext";
import type { MonthlyCount } from "../types";
import "../styles/dashboard.css";

function formatCurrency(amount: number): string {
  return `GHS ${amount.toLocaleString("en-GH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function Dashboard() {
  const { transactions } = useTransactions();

  const stats = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthTxns = transactions.filter((t) => {
      const d = new Date(t.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    return {
      total_transactions: transactions.length,
      total_amount_paid: transactions.reduce((sum, t) => sum + t.amount_to_pay, 0),
      month_transactions: monthTxns.length,
      month_amount: monthTxns.reduce((sum, t) => sum + t.amount_to_pay, 0),
    };
  }, [transactions]);

  const monthly = useMemo((): MonthlyCount[] => {
    const counts: Record<string, number> = {};
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
      counts[key] = 0;
    }

    for (const t of transactions) {
      const d = new Date(t.date);
      const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
      if (key in counts) {
        counts[key]++;
      }
    }

    return Object.entries(counts).map(([month, count]) => ({ month, count }));
  }, [transactions]);

  const recent = useMemo(
    () =>
      [...transactions]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 6),
    [transactions],
  );

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Payment voucher overview</p>
      </div>

      {/* Stat Cards */}
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

      {/* Chart + Recent Table */}
      <div className="dashboard-middle">
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
