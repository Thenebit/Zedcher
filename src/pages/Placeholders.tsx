// ============================================================
// Zedcher — Placeholder Pages
// Stub pages for routes not yet built.
// ============================================================

import { Printer, Landmark } from "lucide-react";

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
