// ============================================================
// Zedcher — Reprint PV Page
// Search for a PV, view in original Excel form layout, print.
// ============================================================

import { useState, useMemo, useCallback, useRef } from "react";
import { Printer, FileSearch } from "lucide-react";
import { useTransactions } from "../context/TransactionContext";
import type { Transaction } from "../types";
import "../styles/reprint.css";

function fmt(n: number): string {
  return n.toLocaleString("en-GH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fmtDate(iso: string): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function amountToWords(amount: number): string {
  const ones = ["","ONE","TWO","THREE","FOUR","FIVE","SIX","SEVEN","EIGHT","NINE",
    "TEN","ELEVEN","TWELVE","THIRTEEN","FOURTEEN","FIFTEEN","SIXTEEN",
    "SEVENTEEN","EIGHTEEN","NINETEEN"];
  const tens = ["","","TWENTY","THIRTY","FORTY","FIFTY","SIXTY","SEVENTY","EIGHTY","NINETY"];

  function cvtH(n: number): string {
    let r = "";
    if (n >= 100) { r += ones[Math.floor(n / 100)] + " HUNDRED"; n %= 100; if (n > 0) r += " AND "; }
    if (n >= 20) { r += tens[Math.floor(n / 10)]; n %= 10; if (n > 0) r += "-" + ones[n]; }
    else if (n > 0) { r += ones[n]; }
    return r;
  }

  const whole = Math.floor(amount);
  const pesewas = Math.round((amount - whole) * 100);
  let w = "";

  if (whole === 0) { w = "ZERO"; }
  else {
    const m = Math.floor(whole / 1000000);
    const th = Math.floor((whole % 1000000) / 1000);
    const rem = whole % 1000;
    if (m > 0) { w += cvtH(m) + " MILLION"; if (th > 0 || rem > 0) w += ", "; }
    if (th > 0) { w += cvtH(th) + " THOUSAND"; if (rem > 0) w += rem < 100 ? " AND " : ", "; }
    if (rem > 0) { w += cvtH(rem); }
  }

  w += " GHANA CEDIS";
  if (pesewas > 0) w += ", " + cvtH(pesewas) + " PESEWAS";
  return w;
}

export default function ReprintPV() {
  const { transactions } = useTransactions();
  const [query, setQuery] = useState("");
  const [showSugg, setShowSugg] = useState(false);
  const [sel, setSel] = useState<Transaction | null>(null);
  const ref = useRef<HTMLInputElement>(null);

  const sugg = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    return transactions.filter(t =>
      t.pv_no.toLowerCase().includes(q) ||
      t.payee.toLowerCase().includes(q) ||
      t.trans_no.toLowerCase().includes(q)
    ).slice(0, 8);
  }, [query, transactions]);

  const pick = useCallback((t: Transaction) => { setSel(t); setQuery(t.pv_no); setShowSugg(false); }, []);
  const onChg = useCallback((e: React.ChangeEvent<HTMLInputElement>) => { setQuery(e.target.value); setShowSugg(true); if (!e.target.value.trim()) setSel(null); }, []);
  const clear = useCallback(() => { setQuery(""); setSel(null); setShowSugg(false); ref.current?.focus(); }, []);

  const levies = sel ? sel.amount2 - sel.amount : 0;
  const vat = sel ? sel.wvat : 0;
  const subTotal = sel ? sel.amount + levies + vat : 0;
  const wht = sel ? sel.wht : 0;
  const totalAmt = subTotal - wht;
  const netAmt = sel ? sel.amount_to_pay : 0;

  return (
    <div className="reprint-container">
      <div className="page-header">
        <h1 className="page-title">Reprint PV</h1>
        <p className="page-subtitle">Search and print a past payment voucher</p>
      </div>

      <div className="reprint-search-card">
        <div className="reprint-search-row">
          <div className="reprint-search-field reprint-suggestions">
            <label>Search PV</label>
            <input ref={ref} type="text" value={query} onChange={onChg}
              onFocus={() => query.trim() && setShowSugg(true)}
              onBlur={() => setTimeout(() => setShowSugg(false), 150)}
              placeholder="Type PV number, payee name, or trans number..." />
            {showSugg && query.trim() && (
              <div className="suggestions-list">
                {sugg.length > 0 ? sugg.map(t => (
                  <div key={t.id} className="suggestion-item" onMouseDown={() => pick(t)}>
                    <span className="suggestion-pv">{t.pv_no}</span>
                    <span className="suggestion-meta">{t.payee} · {fmtDate(t.date)}</span>
                  </div>
                )) : <div className="no-results">No matching PVs found</div>}
              </div>
            )}
          </div>
          {sel && <button className="btn btn-secondary" onClick={clear} style={{ height: 38 }}>Clear</button>}
        </div>
      </div>

      {sel ? (
        <div className="pv-print-card">
          <div className="pv-print-inner">

            {/* LETTERHEAD */}
            <div className="pv-letterhead">
              <img src="/src/assets/logo.png" alt="Logo" className="pv-letterhead-logo" />
              <div>
                <div className="pv-company-name">ZEDULO GHANA LTD</div>
                <div className="pv-form-title">Payment Voucher</div>
              </div>
            </div>

            {/* INFO TABLE */}
            <table className="pv-info-table">
              <tbody>
                <tr>
                  <td className="lbl">Trans No:</td>
                  <td className="val">{sel.trans_no}</td>
                  <td className="lbl">PV No.:</td>
                  <td className="val">{sel.pv_no}</td>
                </tr>
                <tr>
                  <td className="lbl">Station:</td>
                  <td className="val">HEAD OFFICE, ACCRA</td>
                  <td className="lbl">Date:</td>
                  <td className="val">{fmtDate(sel.date)}</td>
                </tr>
                <tr>
                  <td className="lbl">Payee:</td>
                  <td className="val" colSpan={3}>{sel.payee}</td>
                </tr>
                <tr>
                  <td className="lbl">Charged To:</td>
                  <td className="val" colSpan={3}>{sel.description}</td>
                </tr>
                <tr>
                  <td className="lbl">Account Code:</td>
                  <td className="val">{sel.account_code}</td>
                  <td className="lbl">Cheque No:</td>
                  <td className="val">{sel.cheque_no || ""}</td>
                </tr>
              </tbody>
            </table>

            {/* FUND SOURCE */}
            <div className="pv-fund-banner">Fund Source: {sel.source_of_fund}</div>

            {/* DESCRIPTION + AMOUNT */}
            <table className="pv-desc-table">
              <thead>
                <tr><th>Description</th><th style={{ textAlign: "right" }}>Amount</th></tr>
              </thead>
              <tbody>
                <tr>
                  <td className="desc-text">{sel.description}</td>
                  <td className="amt">{fmt(sel.amount_to_pay)}</td>
                </tr>
              </tbody>
            </table>

            {/* TAX BREAKDOWN */}
            <table className="pv-tax-table">
              <tbody>
                <tr><td className="tax-lbl">Gross Amount</td><td className="tax-val">{fmt(sel.amount)}</td></tr>
                <tr><td className="tax-lbl">Add: Levies</td><td className="tax-val">{fmt(levies)}</td></tr>
                <tr><td className="tax-lbl">Add: VAT</td><td className="tax-val">{fmt(vat)}</td></tr>
                <tr><td className="tax-lbl">Sub-Total</td><td className="tax-val">{fmt(subTotal)}</td></tr>
                <tr><td className="tax-lbl">WHT</td><td className="tax-val">{fmt(wht)}</td></tr>
                <tr className="row-total"><td className="tax-lbl">Total Amount</td><td className="tax-val">{fmt(totalAmt)}</td></tr>
                <tr><td className="tax-lbl">Net Amount:</td><td className="tax-val">{fmt(netAmt)}</td></tr>
                <tr className="row-pay"><td className="tax-lbl">Amount to Pay:</td><td className="tax-val">{fmt(netAmt)}</td></tr>
              </tbody>
            </table>

            {/* AMOUNT IN WORDS */}
            <div className="pv-words">Amount in Words: {amountToWords(sel.amount_to_pay)}</div>

            {/* AUTHORIZATION */}
            <table className="pv-auth-table">
              <tbody>
                <tr>
                  <td><span className="auth-lbl">Prepared By: </span><span className="auth-name">{sel.prepared_by}</span></td>
                  <td>Date: {fmtDate(sel.prepared_date)}</td>
                  <td>Signed: ..........................</td>
                </tr>
                <tr>
                  <td><span className="auth-lbl">Authorized By: </span><span className="auth-name">{sel.certified_by}</span></td>
                  <td>Date: {fmtDate(sel.certified_date)}</td>
                  <td>Signed: ..........................</td>
                </tr>
                <tr>
                  <td><span className="auth-lbl">Approved By: </span></td>
                  <td>Date:</td>
                  <td>Signed: ..........................</td>
                </tr>
              </tbody>
            </table>

            {/* PAID / RECEIVED */}
            <table className="pv-paid-table">
              <tbody>
                <tr><td className="hdr">Paid By:</td><td className="hdr">Received By:</td></tr>
                <tr>
                  <td>
                    <div className="dotline">Name:........................................</div>
                    <div className="dotline">Sign &amp; Date:..............................</div>
                  </td>
                  <td>
                    <div className="dotline">Name:........................................</div>
                    <div className="dotline">Sign &amp; Date:..............................</div>
                  </td>
                </tr>
              </tbody>
            </table>

          </div>

          <div className="pv-detail-actions">
            <button className="btn btn-primary" onClick={() => window.print()}>
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Printer size={16} /> Print Voucher
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
