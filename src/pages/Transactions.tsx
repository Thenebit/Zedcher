// ============================================================
// Zedcher — Transactions Ledger Page
// Full table of all PVs from shared context.
// Search + fund filter. Sorted newest first.
// ============================================================

import { useState, useMemo } from "react";
import { FileX } from "lucide-react";
import { useTransactions } from "../context/TransactionContext";
import { useFunds } from "../context/FundContext";
import "../styles/transactions.css";

function formatCurrency(amount: number, currency: string): string {
  return `${currency} ${amount.toLocaleString("en-GH", {
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

export default function Transactions() {
  const { transactions } = useTransactions();
  const { funds } = useFunds();
  const [search, setSearch] = useState("");
  const [fundFilter, setFundFilter] = useState("");

  const filtered = useMemo(() => {
    const query = search.toLowerCase().trim();

    return [...transactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .filter((t) => {
        if (fundFilter && t.source_of_fund !== fundFilter) return false;

        if (query) {
          return (
            t.payee.toLowerCase().includes(query) ||
            t.pv_no.toLowerCase().includes(query) ||
            t.trans_no.toLowerCase().includes(query) ||
            t.description.toLowerCase().includes(query)
          );
        }

        return true;
      });
  }, [transactions, search, fundFilter]);

  return (
    <div className="transactions-container">
      <div className="page-header">
        <h1 className="page-title">Transactions</h1>
        <p className="page-subtitle">Payment voucher ledger</p>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <input
          className="filter-search"
          type="text"
          placeholder="Search by payee, PV no, or description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="filter-select"
          value={fundFilter}
          onChange={(e) => setFundFilter(e.target.value)}
        >
          <option value="">All Funds</option>
          {funds.map((f) => (
            <option key={f.id} value={f.project_name}>{f.project_name}</option>
          ))}
        </select>
        <span className="filter-count">
          Showing {filtered.length} of {transactions.length}
        </span>
      </div>

      {/* Table */}
      <div className="table-card">
        <div className="table-scroll">
          {filtered.length > 0 ? (
            <table className="ledger-table">
              <thead>
                <tr>
                  <th>Trans No.</th>
                  <th>PV No.</th>
                  <th>Date</th>
                  <th>Payee</th>
                  <th>Fund</th>
                  <th>Account</th>
                  <th>Description</th>
                  <th>Amount Type</th>
                  <th style={{ textAlign: "right" }}>Amount</th>
                  <th style={{ textAlign: "right" }}>To Pay</th>
                  <th>Cur.</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((txn) => (
                  <tr key={txn.id}>
                    <td className="col-trans">{txn.trans_no}</td>
                    <td className="col-pv">{txn.pv_no}</td>
                    <td className="col-date">{formatDate(txn.date)}</td>
                    <td>{txn.payee}</td>
                    <td className="col-fund">
                      <span className="fund-badge">{txn.source_of_fund}</span>
                    </td>
                    <td>{txn.account_code}</td>
                    <td className="col-desc" title={txn.description}>{txn.description}</td>
                    <td>{txn.amount_type}</td>
                    <td className="col-amount">{formatCurrency(txn.amount, txn.currency)}</td>
                    <td className="col-amount">{formatCurrency(txn.amount_to_pay, txn.currency)}</td>
                    <td className="col-currency">{txn.currency}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="table-empty">
              <FileX />
              <p>No transactions found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
