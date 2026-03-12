// ============================================================
// Zedcher — Reprint PV Page
// Search for a PV by number, view full details, print.
// PDF export will be added when Rust backend is ready.
// ============================================================

import { useState, useMemo, useCallback, useRef } from "react";
import { Search, Printer, FileSearch } from "lucide-react";
import { useTransactions } from "../context/TransactionContext";
import type { Transaction } from "../types";
import "../styles/reprint.css";

function formatCurrency(amount: number, currency: string): string {
  return `${currency} ${amount.toLocaleString("en-GH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(iso: string): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function ReprintPV() {
  const { transactions } = useTransactions();
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selected, setSelected] = useState<Transaction | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter suggestions as user types
  const suggestions = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    return transactions.filter(
      (t) =>
        t.pv_no.toLowerCase().includes(q) ||
        t.payee.toLowerCase().includes(q) ||
        t.trans_no.toLowerCase().includes(q),
    ).slice(0, 8);
  }, [query, transactions]);

  const handleSelect = useCallback((txn: Transaction) => {
    setSelected(txn);
    setQuery(txn.pv_no);
    setShowSuggestions(false);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setShowSuggestions(true);
    if (!e.target.value.trim()) {
      setSelected(null);
    }
  }, []);

  const handleInputFocus = useCallback(() => {
    if (query.trim()) {
      setShowSuggestions(true);
    }
  }, [query]);

  const handleInputBlur = useCallback(() => {
    // Delay to allow click on suggestion
    setTimeout(() => setShowSuggestions(false), 150);
  }, []);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const handleClear = useCallback(() => {
    setQuery("");
    setSelected(null);
    setShowSuggestions(false);
    inputRef.current?.focus();
  }, []);

  return (
    <div className="reprint-container">
      <div className="page-header">
        <h1 className="page-title">Reprint PV</h1>
        <p className="page-subtitle">Search and print a past payment voucher</p>
      </div>

      {/* Search */}
      <div className="reprint-search-card">
        <div className="reprint-search-row">
          <div className="reprint-search-field reprint-suggestions">
            <label>Search PV</label>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              placeholder="Type PV number, payee name, or trans number..."
            />
            {showSuggestions && query.trim() && (
              <div className="suggestions-list">
                {suggestions.length > 0 ? (
                  suggestions.map((txn) => (
                    <div
                      key={txn.id}
                      className="suggestion-item"
                      onMouseDown={() => handleSelect(txn)}
                    >
                      <span className="suggestion-pv">{txn.pv_no}</span>
                      <span className="suggestion-meta">
                        {txn.payee} · {formatDate(txn.date)}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="no-results">No matching PVs found</div>
                )}
              </div>
            )}
          </div>
          {selected && (
            <button className="btn btn-secondary" onClick={handleClear} style={{ height: 38 }}>
              Clear
            </button>
          )}
        </div>
      </div>

      {/* PV Detail or Empty State */}
      {selected ? (
        <div className="pv-detail-card">
          {/* Header */}
          <div className="pv-detail-header">
            <span className="pv-detail-title">Payment Voucher</span>
            <span className="pv-detail-pvno">{selected.pv_no}</span>
          </div>

          {/* Body */}
          <div className="pv-detail-body">
            {/* Voucher Info */}
            <div className="pv-detail-section">
              <div className="pv-detail-section-title">Voucher Information</div>
              <div className="pv-detail-grid">
                <div className="pv-field">
                  <span className="pv-field-label">Transaction No.</span>
                  <span className="pv-field-value mono">{selected.trans_no}</span>
                </div>
                <div className="pv-field">
                  <span className="pv-field-label">PV No.</span>
                  <span className="pv-field-value mono">{selected.pv_no}</span>
                </div>
                <div className="pv-field">
                  <span className="pv-field-label">Date</span>
                  <span className="pv-field-value">{formatDate(selected.date)}</span>
                </div>
                <div className="pv-field">
                  <span className="pv-field-label">Source of Fund</span>
                  <span className="pv-field-value">{selected.source_of_fund}</span>
                </div>
                <div className="pv-field">
                  <span className="pv-field-label">Payee</span>
                  <span className="pv-field-value">{selected.payee}</span>
                </div>
                <div className="pv-field">
                  <span className="pv-field-label">Cheque No.</span>
                  <span className="pv-field-value">{selected.cheque_no || "—"}</span>
                </div>
                <div className="pv-field full-width">
                  <span className="pv-field-label">Description</span>
                  <span className="pv-field-value">{selected.description}</span>
                </div>
              </div>
            </div>

            {/* Account & Amount */}
            <div className="pv-detail-section">
              <div className="pv-detail-section-title">Account & Amount</div>
              <div className="pv-detail-grid">
                <div className="pv-field">
                  <span className="pv-field-label">Account Code</span>
                  <span className="pv-field-value mono">{selected.account_code}</span>
                </div>
                <div className="pv-field">
                  <span className="pv-field-label">Amount Type</span>
                  <span className="pv-field-value">{selected.amount_type}</span>
                </div>
                <div className="pv-field">
                  <span className="pv-field-label">Amount</span>
                  <span className="pv-field-value">{formatCurrency(selected.amount, selected.currency)}</span>
                </div>
                <div className="pv-field">
                  <span className="pv-field-label">Currency</span>
                  <span className="pv-field-value">{selected.currency}</span>
                </div>
                <div className="pv-field">
                  <span className="pv-field-label">WHT</span>
                  <span className="pv-field-value">{formatCurrency(selected.wht, selected.currency)}</span>
                </div>
                <div className="pv-field">
                  <span className="pv-field-label">WVAT</span>
                  <span className="pv-field-value">{formatCurrency(selected.wvat, selected.currency)}</span>
                </div>
                <div className="pv-field">
                  <span className="pv-field-label">Amount to Pay</span>
                  <span className="pv-field-value large">{formatCurrency(selected.amount_to_pay, selected.currency)}</span>
                </div>
              </div>
            </div>

            {/* Authorization */}
            <div className="pv-detail-section">
              <div className="pv-detail-section-title">Authorization</div>
              <div className="pv-detail-grid">
                <div className="pv-field">
                  <span className="pv-field-label">Prepared By</span>
                  <span className="pv-field-value">{selected.prepared_by}</span>
                </div>
                <div className="pv-field">
                  <span className="pv-field-label">Prepared Date</span>
                  <span className="pv-field-value">{formatDate(selected.prepared_date)}</span>
                </div>
                <div className="pv-field">
                  <span className="pv-field-label">Certified By</span>
                  <span className="pv-field-value">{selected.certified_by || "—"}</span>
                </div>
                <div className="pv-field">
                  <span className="pv-field-label">Certified Date</span>
                  <span className="pv-field-value">{formatDate(selected.certified_date)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pv-detail-actions">
            <button className="btn btn-primary" onClick={handlePrint}>
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Printer size={16} />
                Print Voucher
              </span>
            </button>
          </div>
        </div>
      ) : (
        <div className="reprint-empty">
          <FileSearch />
          <p>No voucher selected</p>
          <span>Search for a PV number above to view and print</span>
        </div>
      )}
    </div>
  );
}

