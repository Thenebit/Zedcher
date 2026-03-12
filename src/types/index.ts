// ============================================================
// Zedcher — Shared Type Definitions
// These mirror the SQLite schema from architecture phase.
// Single source of truth for all data shapes across the app.
// ============================================================

export interface Transaction {
  id: number;
  trans_no: string;
  pv_no: string;
  date: string;
  payee: string;
  cheque_no: string;
  source_of_fund: string;
  account_code: string;
  description: string;
  amount_type: string;
  amount: number;
  other_expense: number;
  amount2: number;
  wht: number;
  wvat: number;
  prepared_by: string;
  prepared_date: string;
  certified_by: string;
  certified_date: string;
  amount_to_pay: number;
  currency: string;
  created_at: string;
}

export interface Account {
  id: number;
  account_class: string;
  sub_item: string;
  sub_sub_item: string;
  code: string;
}

export interface Fund {
  id: number;
  project_name: string;
  acronym: string;
  funding_source: string;
}

// Dashboard-specific aggregated types
export interface DashboardStats {
  total_transactions: number;
  total_amount_paid: number;
  month_transactions: number;
  month_amount: number;
}

export interface MonthlyCount {
  month: string;
  count: number;
}

