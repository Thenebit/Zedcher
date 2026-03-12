// ============================================================
// Zedcher — Chart of Accounts Page
// View, search, add, and delete accounts.
// Changes immediately reflect in the PV form dropdown.
// ============================================================

import { useState, useMemo, useCallback } from "react";
import { Trash2, FileX } from "lucide-react";
import { useAccounts } from "../context/AccountContext";
import "../styles/accounts.css";

interface AddForm {
  account_class: string;
  sub_item: string;
  sub_sub_item: string;
  code: string;
}

const EMPTY_FORM: AddForm = {
  account_class: "",
  sub_item: "",
  sub_sub_item: "",
  code: "",
};

export default function Accounts() {
  const { accounts, addAccount, deleteAccount } = useAccounts();
  const [search, setSearch] = useState("");
  const [form, setForm] = useState<AddForm>(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState<Record<string, boolean>>({});

  const filtered = useMemo(() => {
    const query = search.toLowerCase().trim();
    if (!query) return accounts;
    return accounts.filter(
      (a) =>
        a.account_class.toLowerCase().includes(query) ||
        a.sub_item.toLowerCase().includes(query) ||
        a.sub_sub_item.toLowerCase().includes(query) ||
        a.code.toLowerCase().includes(query),
    );
  }, [accounts, search]);

  const handleFormChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));
      setFormErrors((prev) => {
        if (!prev[name]) return prev;
        const next = { ...prev };
        delete next[name];
        return next;
      });
    },
    [],
  );

  const handleAdd = useCallback(() => {
    const errs: Record<string, boolean> = {};
    if (!form.account_class.trim()) errs.account_class = true;
    if (!form.sub_sub_item.trim()) errs.sub_sub_item = true;
    if (!form.code.trim()) errs.code = true;

    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      return;
    }

    // Check for duplicate code
    if (accounts.some((a) => a.code === form.code.trim())) {
      setFormErrors({ code: true });
      return;
    }

    addAccount({
      account_class: form.account_class.trim(),
      sub_item: form.sub_item.trim(),
      sub_sub_item: form.sub_sub_item.trim(),
      code: form.code.trim(),
    });

    setForm(EMPTY_FORM);
    setFormErrors({});
  }, [form, accounts, addAccount]);

  const handleDelete = useCallback(
    (id: number) => {
      deleteAccount(id);
    },
    [deleteAccount],
  );

  return (
    <div className="accounts-container">
      <div className="page-header">
        <h1 className="page-title">Chart of Accounts</h1>
        <p className="page-subtitle">Manage account codes</p>
      </div>

      {/* Add Form */}
      <div className="add-form-card">
        <div className="add-form-title">Add New Account</div>
        <div className="add-form-grid">
          <div className={`add-field ${formErrors.account_class ? "error" : ""}`}>
            <label>Account Class *</label>
            <input
              name="account_class"
              value={form.account_class}
              onChange={handleFormChange}
              placeholder="e.g. Administrative & General Expenses"
            />
          </div>

          <div className="add-field">
            <label>Sub-Item</label>
            <input
              name="sub_item"
              value={form.sub_item}
              onChange={handleFormChange}
              placeholder="e.g. Office Expenses"
            />
          </div>

          <div className={`add-field ${formErrors.sub_sub_item ? "error" : ""}`}>
            <label>Sub-Sub-Item *</label>
            <input
              name="sub_sub_item"
              value={form.sub_sub_item}
              onChange={handleFormChange}
              placeholder="e.g. Office Supplies"
            />
          </div>

          <div className={`add-field ${formErrors.code ? "error" : ""}`}>
            <label>Code *</label>
            <input
              name="code"
              value={form.code}
              onChange={handleFormChange}
              placeholder="e.g. 5070"
            />
          </div>

          <button className="btn-add" onClick={handleAdd}>
            Add Account
          </button>
        </div>
      </div>

      {/* Search + Table */}
      <div className="filters-bar">
        <input
          className="filter-search"
          type="text"
          placeholder="Search accounts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <span className="filter-count">
          Showing {filtered.length} of {accounts.length}
        </span>
      </div>

      <div className="table-card">
        <div className="table-scroll">
          {filtered.length > 0 ? (
            <table className="accounts-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Sub-Sub-Item</th>
                  <th>Sub-Item</th>
                  <th>Account Class</th>
                  <th style={{ width: 50 }}></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((a) => (
                  <tr key={a.id}>
                    <td className="col-code">{a.code}</td>
                    <td>{a.sub_sub_item}</td>
                    <td>{a.sub_item}</td>
                    <td className="col-class">{a.account_class}</td>
                    <td>
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(a.id)}
                        title="Delete account"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="table-empty">
              <FileX />
              <p>No accounts found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

