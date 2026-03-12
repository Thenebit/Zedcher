// ============================================================
// Zedcher — Mock Data Service
// All data access goes through functions (not raw exports).
// This mirrors the async invoke() pattern we'll use with Tauri.
// When backend is ready: swap mock function body → invoke() call.
// ============================================================

import type {
  Transaction,
  Account,
  Fund,
  DashboardStats,
  MonthlyCount,
} from "../types";

// ---- Raw mock data (private to this module) ----

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 1,
    trans_no: "TRN001",
    pv_no: "JK/ECO/001/01/2026",
    date: "2026-01-10",
    payee: "Kofi Mensah",
    cheque_no: "CHQ-1001",
    source_of_fund: "ECOBANK GH",
    account_code: "5010",
    description: "Office supplies procurement",
    amount_type: "VAT EXCLUSIVE (S)",
    amount: 2500.0,
    other_expense: 0,
    amount2: 2650.0,
    wht: 0,
    wvat: 397.5,
    prepared_by: "JK",
    prepared_date: "2026-01-10",
    certified_by: "AM",
    certified_date: "2026-01-10",
    amount_to_pay: 3047.5,
    currency: "GHS",
    created_at: "2026-01-10T09:00:00Z",
  },
  {
    id: 2,
    trans_no: "TRN002",
    pv_no: "JK/ECO/002/01/2026",
    date: "2026-01-15",
    payee: "Ama Owusu",
    cheque_no: "CHQ-1002",
    source_of_fund: "ECOBANK GH",
    account_code: "5020",
    description: "Consulting services - Q1",
    amount_type: "VAT EXCLUSIVE (S)",
    amount: 8000.0,
    other_expense: 0,
    amount2: 8480.0,
    wht: 0,
    wvat: 1272.0,
    prepared_by: "JK",
    prepared_date: "2026-01-15",
    certified_by: "AM",
    certified_date: "2026-01-15",
    amount_to_pay: 9752.0,
    currency: "GHS",
    created_at: "2026-01-15T10:30:00Z",
  },
  {
    id: 3,
    trans_no: "TRN003",
    pv_no: "JK/CASH/001/02/2026",
    date: "2026-02-03",
    payee: "Kwame Asante",
    cheque_no: "CHQ-1003",
    source_of_fund: "CASH ACCOUNT",
    account_code: "5030",
    description: "Fuel and transport - February",
    amount_type: "WAGES & SALARIES",
    amount: 1200.0,
    other_expense: 0,
    amount2: 1200.0,
    wht: 0,
    wvat: 0,
    prepared_by: "JK",
    prepared_date: "2026-02-03",
    certified_by: "AM",
    certified_date: "2026-02-03",
    amount_to_pay: 1200.0,
    currency: "GHS",
    created_at: "2026-02-03T08:15:00Z",
  },
  {
    id: 4,
    trans_no: "TRN004",
    pv_no: "JK/ECO/001/02/2026",
    date: "2026-02-12",
    payee: "Efua Danquah",
    cheque_no: "CHQ-1004",
    source_of_fund: "ECOBANK GH",
    account_code: "5040",
    description: "Equipment maintenance",
    amount_type: "VAT INCLUSIVE (S)",
    amount: 5000.0,
    other_expense: 0,
    amount2: 5000.0,
    wht: 0,
    wvat: 614.44,
    prepared_by: "JK",
    prepared_date: "2026-02-12",
    certified_by: "AM",
    certified_date: "2026-02-12",
    amount_to_pay: 5000.0,
    currency: "GHS",
    created_at: "2026-02-12T14:00:00Z",
  },
  {
    id: 5,
    trans_no: "TRN005",
    pv_no: "JK/ECO/002/02/2026",
    date: "2026-02-20",
    payee: "Yaw Boateng",
    cheque_no: "CHQ-1005",
    source_of_fund: "ECOBANK GH",
    account_code: "5050",
    description: "Internet subscription - Feb",
    amount_type: "VAT EXCLUSIVE (F)",
    amount: 3500.0,
    other_expense: 0,
    amount2: 3535.0,
    wht: 0,
    wvat: 106.05,
    prepared_by: "JK",
    prepared_date: "2026-02-20",
    certified_by: "AM",
    certified_date: "2026-02-20",
    amount_to_pay: 3641.05,
    currency: "GHS",
    created_at: "2026-02-20T11:45:00Z",
  },
  {
    id: 6,
    trans_no: "TRN006",
    pv_no: "JK/CASH/001/03/2026",
    date: "2026-03-01",
    payee: "Akua Serwaa",
    cheque_no: "CHQ-1006",
    source_of_fund: "CASH ACCOUNT",
    account_code: "5010",
    description: "Stationery and printing",
    amount_type: "VAT EXCLUSIVE (S)",
    amount: 950.0,
    other_expense: 0,
    amount2: 1007.0,
    wht: 0,
    wvat: 151.05,
    prepared_by: "JK",
    prepared_date: "2026-03-01",
    certified_by: "AM",
    certified_date: "2026-03-01",
    amount_to_pay: 1158.05,
    currency: "GHS",
    created_at: "2026-03-01T09:30:00Z",
  },
  {
    id: 7,
    trans_no: "TRN007",
    pv_no: "JK/ECO/001/03/2026",
    date: "2026-03-05",
    payee: "Nana Adjei",
    cheque_no: "CHQ-1007",
    source_of_fund: "ECOBANK GH",
    account_code: "5060",
    description: "Staff training workshop",
    amount_type: "WAGES & SALARIES",
    amount: 4200.0,
    other_expense: 0,
    amount2: 4200.0,
    wht: 0,
    wvat: 0,
    prepared_by: "JK",
    prepared_date: "2026-03-05",
    certified_by: "AM",
    certified_date: "2026-03-05",
    amount_to_pay: 4200.0,
    currency: "GHS",
    created_at: "2026-03-05T13:00:00Z",
  },
  {
    id: 8,
    trans_no: "TRN008",
    pv_no: "JK/ECO/002/03/2026",
    date: "2026-03-08",
    payee: "Abena Frimpong",
    cheque_no: "CHQ-1008",
    source_of_fund: "ECOBANK GH",
    account_code: "5020",
    description: "Legal advisory services",
    amount_type: "VAT EXCLUSIVE (S)",
    amount: 6000.0,
    other_expense: 0,
    amount2: 6360.0,
    wht: 0,
    wvat: 954.0,
    prepared_by: "JK",
    prepared_date: "2026-03-08",
    certified_by: "AM",
    certified_date: "2026-03-08",
    amount_to_pay: 7314.0,
    currency: "GHS",
    created_at: "2026-03-08T10:00:00Z",
  },
];

const MOCK_ACCOUNTS: Account[] = [
  { id: 1, account_class: "Administrative & General Expenses", sub_item: "Office Expenses", sub_sub_item: "Office Supplies", code: "5010" },
  { id: 2, account_class: "Administrative & General Expenses", sub_item: "Professional Fees", sub_sub_item: "Consulting Services", code: "5020" },
  { id: 3, account_class: "Cost of Revenue", sub_item: "Direct Costs", sub_sub_item: "Fuel and Transport", code: "5030" },
  { id: 4, account_class: "Administrative & General Expenses", sub_item: "Maintenance", sub_sub_item: "Equipment Maintenance", code: "5040" },
  { id: 5, account_class: "Administrative & General Expenses", sub_item: "Utilities", sub_sub_item: "Internet Subscription", code: "5050" },
  { id: 6, account_class: "Administrative & General Expenses", sub_item: "Staff Costs", sub_sub_item: "Training and Development", code: "5060" },
];

const MOCK_FUNDS: Fund[] = [
  { id: 1, project_name: "ECOBANK GH", acronym: "ECO", funding_source: "Ecobank Ghana Limited" },
  { id: 2, project_name: "CASH ACCOUNT", acronym: "CASH", funding_source: "Internal Cash" },
];

// ---- Public API (async to match future invoke() pattern) ----

export async function getTransactions(): Promise<Transaction[]> {
  return MOCK_TRANSACTIONS;
}

export async function getRecentTransactions(limit: number = 8): Promise<Transaction[]> {
  return [...MOCK_TRANSACTIONS]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const monthTxns = MOCK_TRANSACTIONS.filter((t) => {
    const d = new Date(t.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  return {
    total_transactions: MOCK_TRANSACTIONS.length,
    total_amount_paid: MOCK_TRANSACTIONS.reduce((sum, t) => sum + t.amount_to_pay, 0),
    month_transactions: monthTxns.length,
    month_amount: monthTxns.reduce((sum, t) => sum + t.amount_to_pay, 0),
  };
}

export async function getMonthlyTransactionCounts(): Promise<MonthlyCount[]> {
  const counts: Record<string, number> = {};
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // Seed last 6 months with 0 so chart always has bars
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
    counts[key] = 0;
  }

  for (const t of MOCK_TRANSACTIONS) {
    const d = new Date(t.date);
    const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
    if (key in counts) {
      counts[key]++;
    }
  }

  return Object.entries(counts).map(([month, count]) => ({ month, count }));
}

export async function getAccounts(): Promise<Account[]> {
  return MOCK_ACCOUNTS;
}

export async function getFunds(): Promise<Fund[]> {
  return MOCK_FUNDS;
}

