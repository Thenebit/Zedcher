// ============================================================
// Zedcher — Placeholder Pages
// Stub pages for routes that will be built on their own
// feature branches. Each export is a separate component.
// ============================================================

import { FilePlus, List, Printer, BookOpen, Landmark } from "lucide-react";

export function NewPV() {
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">New Payment Voucher</h1>
        <p className="page-subtitle">Create a new PV entry</p>
      </div>
      <div className="placeholder-page">
        <FilePlus />
        <p>PV Form — coming on feature/pv-form branch</p>
      </div>
    </div>
  );
}

export function Transactions() {
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Transactions</h1>
        <p className="page-subtitle">Payment voucher ledger</p>
      </div>
      <div className="placeholder-page">
        <List />
        <p>Transaction ledger — coming on feature/transactions branch</p>
      </div>
    </div>
  );
}

export function ReprintPV() {
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Reprint PV</h1>
        <p className="page-subtitle">Search and export a past PV as PDF</p>
      </div>
      <div className="placeholder-page">
        <Printer />
        <p>Reprint PV — coming on feature/reprint-pv branch</p>
      </div>
    </div>
  );
}

export function Accounts() {
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Chart of Accounts</h1>
        <p className="page-subtitle">Manage account codes</p>
      </div>
      <div className="placeholder-page">
        <BookOpen />
        <p>Accounts manager — coming on feature/accounts branch</p>
      </div>
    </div>
  );
}

export function Funds() {
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Source of Funds</h1>
        <p className="page-subtitle">Manage funding sources and projects</p>
      </div>
      <div className="placeholder-page">
        <Landmark />
        <p>Funds manager — coming on feature/funds branch</p>
      </div>
    </div>
  );
}

