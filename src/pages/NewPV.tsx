// ============================================================
// Zedcher — New PV Form Page
// Full payment voucher entry form.
// - Dropdowns from mock accounts/funds
// - Auto-fills account code/class on description select
// - Generates PV number on submit
// - Validates required fields
// - No tax engine yet — fields are present but calculations
//   will be wired later. Values stored as entered.
// ============================================================

import { useState, useMemo, useCallback } from "react";
import { CheckCircle, X } from "lucide-react";
import { useTransactions } from "../context/TransactionContext";
import { MOCK_ACCOUNTS, MOCK_FUNDS, AMOUNT_TYPES } from "../data/mock";
import "../styles/pv-form.css";

// ---- Constants ----

const CURRENCIES = ["GHS", "USD"] as const;

const WHT_OPTIONS = ["0.0%", "3%", "5%", "7.5%", "10%", "20%"] as const;

const WVAT_OPTIONS = ["YES", "NO"] as const;

const DEDUCTION_ITEMS = [
  "Tourism Levy",
  "PAYE",
  "5.5% Pension Contribution",
  "Fuel",
  "Transport",
  "NSS Charges",
  "Input VAT credit",
] as const;

const AMOUNT_TO_PAY_OPTIONS = [
  "NET AMOUNT",
  "LEVIES",
  "WHT",
  "WVAT",
  "PAYE",
  "VAT",
] as const;

const DESCRIPTION_MAX_LENGTH = 200;

// Block non-numeric keys on number inputs
function blockNonNumeric(e: React.KeyboardEvent<HTMLInputElement>) {
  if (["e", "E", "+", "-"].includes(e.key)) e.preventDefault();
}

// ---- Form types ----

interface FormData {
  cost_station: string;
  source_of_fund: string;
  date: string;
  payee: string;
  cheque_no: string;
  description: string;
  detail_description: string;
  amount_type: string;
  amount: string;
  wht_applicable: string;
  wvat_applicable: string;
  deduction_1: string;
  deduction_1_amount: string;
  deduction_2: string;
  deduction_2_amount: string;
  amount_to_pay_basis: string;
  prepared_by: string;
  prepared_date: string;
  certified_by: string;
  certified_date: string;
  currency: string;
}

interface FormErrors {
  [key: string]: string;
}

const INITIAL_FORM: FormData = {
  cost_station: "HEAD OFFICE",
  source_of_fund: "",
  date: new Date().toISOString().split("T")[0],
  payee: "",
  cheque_no: "",
  description: "",
  detail_description: "",
  amount_type: "",
  amount: "",
  wht_applicable: "0.0%",
  wvat_applicable: "YES",
  deduction_1: "",
  deduction_1_amount: "",
  deduction_2: "",
  deduction_2_amount: "",
  amount_to_pay_basis: "NET AMOUNT",
  prepared_by: "",
  prepared_date: new Date().toISOString().split("T")[0],
  certified_by: "",
  certified_date: new Date().toISOString().split("T")[0],
  currency: "GHS",
};

// Extract initials from a name: "John Kwame" → "JK"
function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((w) => w[0]?.toUpperCase() || "")
    .join("");
}

export default function NewPV() {
  const { addTransaction, getNextPvNumber, getNextTransNo } = useTransactions();
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [success, setSuccess] = useState<{ pvNo: string } | null>(null);

  // Derive account code and class from selected description
  const selectedAccount = useMemo(
    () => MOCK_ACCOUNTS.find((a) => a.sub_sub_item === form.description) || null,
    [form.description],
  );

  // Derive fund acronym from selected source
  const selectedFund = useMemo(
    () => MOCK_FUNDS.find((f) => f.project_name === form.source_of_fund) || null,
    [form.source_of_fund],
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;

      // Enforce description max length
      if (name === "detail_description" && value.length > DESCRIPTION_MAX_LENGTH) return;

      setForm((prev) => ({ ...prev, [name]: value }));
      // Clear error on change
      setErrors((prev) => {
        if (!prev[name]) return prev;
        const next = { ...prev };
        delete next[name];
        return next;
      });
    },
    [],
  );

  const validate = useCallback((): FormErrors => {
    const errs: FormErrors = {};
    if (!form.source_of_fund) errs.source_of_fund = "Required";
    if (!form.date) errs.date = "Required";
    if (!form.payee.trim()) errs.payee = "Required";
    if (!form.description) errs.description = "Required";
    if (!form.amount_type) errs.amount_type = "Required";
    if (!form.amount || parseFloat(form.amount) <= 0) errs.amount = "Must be greater than 0";
    if (!form.prepared_by.trim()) errs.prepared_by = "Required";
    if (!form.prepared_date) errs.prepared_date = "Required";
    if (!form.certified_by.trim()) errs.certified_by = "Required";
    return errs;
  }, [form]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const errs = validate();
      if (Object.keys(errs).length > 0) {
        setErrors(errs);
        return;
      }

      const initials = getInitials(form.prepared_by);
      const fundAcronym = selectedFund?.acronym || "UNK";
      const pvNo = getNextPvNumber(initials, fundAcronym);
      const transNo = getNextTransNo();
      const amount = parseFloat(form.amount);

      // Build full description with detail
      const fullDescription = form.detail_description
        ? `${form.description} — ${form.detail_description}`
        : form.description;

      // Parse deduction amounts
      const ded1 = parseFloat(form.deduction_1_amount) || 0;
      const ded2 = parseFloat(form.deduction_2_amount) || 0;

      addTransaction({
        trans_no: transNo,
        pv_no: pvNo,
        date: form.date,
        payee: form.payee.trim(),
        cheque_no: form.cheque_no.trim(),
        source_of_fund: form.source_of_fund,
        account_code: selectedAccount?.code || "",
        description: fullDescription,
        amount_type: form.amount_type,
        amount,
        other_expense: ded1 + ded2,
        amount2: amount,       // Tax engine will calculate this
        wht: 0,                // Tax engine will calculate this
        wvat: 0,               // Tax engine will calculate this
        prepared_by: initials,
        prepared_date: form.prepared_date,
        certified_by: getInitials(form.certified_by),
        certified_date: form.certified_date,
        amount_to_pay: amount, // Tax engine will calculate this
        currency: form.currency,
      });

      setSuccess({ pvNo });
      setForm(INITIAL_FORM);
      setErrors({});
    },
    [form, validate, selectedFund, selectedAccount, addTransaction, getNextPvNumber, getNextTransNo],
  );

  const handleReset = useCallback(() => {
    setForm(INITIAL_FORM);
    setErrors({});
    setSuccess(null);
  }, []);

  return (
    <div className="pv-form-container">
      <div className="page-header">
        <h1 className="page-title">New Payment Voucher</h1>
        <p className="page-subtitle">Create a new PV entry</p>
      </div>

      {/* Success Banner */}
      {success && (
        <div className="success-banner">
          <CheckCircle size={20} />
          <div className="success-banner-text">
            <div className="success-banner-title">Payment Voucher Created</div>
            <div className="success-banner-detail">PV No: {success.pvNo}</div>
          </div>
          <button className="success-banner-close" onClick={() => setSuccess(null)}>
            <X size={16} />
          </button>
        </div>
      )}

      {/* ---- Section 1: Voucher Details ---- */}
      <div className="form-card">
        <div className="form-section-title">Voucher Details</div>
        <div className="form-grid">
          <div className="form-field">
            <label>Cost Station</label>
            <input
              name="cost_station"
              value={form.cost_station}
              onChange={handleChange}
              placeholder="e.g. HEAD OFFICE"
            />
          </div>

          <div className={`form-field ${errors.source_of_fund ? "error" : ""}`}>
            <label>Source of Fund <span className="required">*</span></label>
            <select name="source_of_fund" value={form.source_of_fund} onChange={handleChange}>
              <option value="">Select fund source</option>
              {MOCK_FUNDS.map((f) => (
                <option key={f.id} value={f.project_name}>{f.project_name}</option>
              ))}
            </select>
            <span className="field-error">{errors.source_of_fund || ""}</span>
          </div>

          <div className={`form-field ${errors.date ? "error" : ""}`}>
            <label>Date <span className="required">*</span></label>
            <input type="date" name="date" value={form.date} onChange={handleChange} />
            <span className="field-error">{errors.date || ""}</span>
          </div>

          <div className={`form-field ${errors.payee ? "error" : ""}`}>
            <label>Payee <span className="required">*</span></label>
            <input name="payee" value={form.payee} onChange={handleChange} placeholder="Payee name" />
            <span className="field-error">{errors.payee || ""}</span>
          </div>

          <div className="form-field">
            <label>Cheque No.</label>
            <input name="cheque_no" value={form.cheque_no} onChange={handleChange} placeholder="e.g. CHQ-1009" />
          </div>

          <div className="form-field">
            <label>Currency</label>
            <select name="currency" value={form.currency} onChange={handleChange}>
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>{c === "GHS" ? "CEDI (GHS)" : "US DOLLAR (USD)"}</option>
              ))}
            </select>
          </div>

          {/* Description textarea */}
          <div className="form-field full-width">
            <label>Description</label>
            <textarea
              name="detail_description"
              value={form.detail_description}
              onChange={handleChange}
              placeholder="Brief description of payment purpose (optional)"
              maxLength={DESCRIPTION_MAX_LENGTH}
            />
            <span className="textarea-count">
              {form.detail_description.length}/{DESCRIPTION_MAX_LENGTH}
            </span>
          </div>
        </div>
      </div>

      {/* ---- Section 2: Account & Amount ---- */}
      <div className="form-card">
        <div className="form-section-title">Account & Amount</div>
        <div className="form-grid">
          <div className={`form-field ${errors.description ? "error" : ""}`}>
            <label>Sub-Sub-Item <span className="required">*</span></label>
            <select name="description" value={form.description} onChange={handleChange}>
              <option value="">Select expense type</option>
              {MOCK_ACCOUNTS.map((a) => (
                <option key={a.id} value={a.sub_sub_item}>{a.sub_sub_item}</option>
              ))}
            </select>
            <span className="field-error">{errors.description || ""}</span>
          </div>

          <div className="form-field">
            <label>Account Code</label>
            <input value={selectedAccount?.code || ""} readOnly placeholder="Auto-filled" />
          </div>

          <div className="form-field full-width">
            <label>Account Class</label>
            <input value={selectedAccount?.account_class || ""} readOnly placeholder="Auto-filled" />
          </div>

          <div className={`form-field ${errors.amount_type ? "error" : ""}`}>
            <label>Amount Type <span className="required">*</span></label>
            <select name="amount_type" value={form.amount_type} onChange={handleChange}>
              <option value="">Select type</option>
              {AMOUNT_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <span className="field-error">{errors.amount_type || ""}</span>
          </div>

          <div className={`form-field ${errors.amount ? "error" : ""}`}>
            <label>Amount ({form.currency}) <span className="required">*</span></label>
            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              onKeyDown={blockNonNumeric}
              placeholder="0.00"
              min="0"
              step="0.01"
              inputMode="decimal"
            />
            <span className="field-error">{errors.amount || ""}</span>
          </div>
        </div>
      </div>

      {/* ---- Section 3: Tax & Deductions ---- */}
      <div className="form-card">
        <div className="form-section-title">Tax & Deductions</div>
        <div className="form-grid">
          <div className="form-field">
            <label>WHT Applicable</label>
            <select name="wht_applicable" value={form.wht_applicable} onChange={handleChange}>
              {WHT_OPTIONS.map((w) => (
                <option key={w} value={w}>{w}</option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label>WVAT Applicable</label>
            <select name="wvat_applicable" value={form.wvat_applicable} onChange={handleChange}>
              {WVAT_OPTIONS.map((w) => (
                <option key={w} value={w}>{w}</option>
              ))}
            </select>
          </div>

          {/* Deduction Row 1 */}
          <div className="form-field">
            <label>Other Deduction 1</label>
            <select name="deduction_1" value={form.deduction_1} onChange={handleChange}>
              <option value="">None</option>
              {DEDUCTION_ITEMS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label>Deduction 1 Amount ({form.currency})</label>
            <input
              type="number"
              name="deduction_1_amount"
              value={form.deduction_1_amount}
              onChange={handleChange}
              onKeyDown={blockNonNumeric}
              placeholder="0.00"
              min="0"
              step="0.01"
              inputMode="decimal"
              disabled={!form.deduction_1}
            />
          </div>

          {/* Deduction Row 2 */}
          <div className="form-field">
            <label>Other Deduction 2</label>
            <select name="deduction_2" value={form.deduction_2} onChange={handleChange}>
              <option value="">None</option>
              {DEDUCTION_ITEMS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label>Deduction 2 Amount ({form.currency})</label>
            <input
              type="number"
              name="deduction_2_amount"
              value={form.deduction_2_amount}
              onChange={handleChange}
              onKeyDown={blockNonNumeric}
              placeholder="0.00"
              min="0"
              step="0.01"
              inputMode="decimal"
              disabled={!form.deduction_2}
            />
          </div>

          {/* Amount To Be Paid basis */}
          <div className="form-field">
            <label>Amount To Be Paid</label>
            <select name="amount_to_pay_basis" value={form.amount_to_pay_basis} onChange={handleChange}>
              {AMOUNT_TO_PAY_OPTIONS.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ---- Section 4: Authorization ---- */}
      <div className="form-card">
        <div className="form-section-title">Authorization</div>
        <div className="form-grid">
          <div className={`form-field ${errors.prepared_by ? "error" : ""}`}>
            <label>Prepared By <span className="required">*</span></label>
            <input
              name="prepared_by"
              value={form.prepared_by}
              onChange={handleChange}
              placeholder="Full name (initials auto-extracted)"
            />
            <span className="field-error">{errors.prepared_by || ""}</span>
          </div>

          <div className={`form-field ${errors.prepared_date ? "error" : ""}`}>
            <label>Prepared Date <span className="required">*</span></label>
            <input type="date" name="prepared_date" value={form.prepared_date} onChange={handleChange} />
            <span className="field-error">{errors.prepared_date || ""}</span>
          </div>

          <div className={`form-field ${errors.certified_by ? "error" : ""}`}>
            <label>Certified By <span className="required">*</span></label>
            <input
              name="certified_by"
              value={form.certified_by}
              onChange={handleChange}
              placeholder="Full name"
            />
            <span className="field-error">{errors.certified_by || ""}</span>
          </div>

          <div className="form-field">
            <label>Certified Date</label>
            <input type="date" name="certified_date" value={form.certified_date} onChange={handleChange} />
          </div>
        </div>

        {/* Actions */}
        <div className="form-actions">
          <button type="button" className="btn btn-primary" onClick={handleSubmit}>
            Save Payment Voucher
          </button>
          <button type="button" className="btn btn-secondary" onClick={handleReset}>
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
