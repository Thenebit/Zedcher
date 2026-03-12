// ============================================================
// Zedcher — Source of Funds Page
// View, search, add, and delete funding sources.
// Changes immediately reflect in the PV form dropdown.
// ============================================================

import { useState, useMemo, useCallback } from "react";
import { Trash2, FileX } from "lucide-react";
import { useFunds } from "../context/FundContext";
import "../styles/funds.css";

interface AddForm {
  project_name: string;
  acronym: string;
  funding_source: string;
}

const EMPTY_FORM: AddForm = {
  project_name: "",
  acronym: "",
  funding_source: "",
};

export default function Funds() {
  const { funds, addFund, deleteFund } = useFunds();
  const [search, setSearch] = useState("");
  const [form, setForm] = useState<AddForm>(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState<Record<string, boolean>>({});

  const filtered = useMemo(() => {
    const query = search.toLowerCase().trim();
    if (!query) return funds;
    return funds.filter(
      (f) =>
        f.project_name.toLowerCase().includes(query) ||
        f.acronym.toLowerCase().includes(query) ||
        f.funding_source.toLowerCase().includes(query),
    );
  }, [funds, search]);

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
    if (!form.project_name.trim()) errs.project_name = true;
    if (!form.acronym.trim()) errs.acronym = true;
    if (!form.funding_source.trim()) errs.funding_source = true;

    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      return;
    }

    // Check for duplicate acronym
    if (funds.some((f) => f.acronym.toUpperCase() === form.acronym.trim().toUpperCase())) {
      setFormErrors({ acronym: true });
      return;
    }

    addFund({
      project_name: form.project_name.trim().toUpperCase(),
      acronym: form.acronym.trim().toUpperCase(),
      funding_source: form.funding_source.trim(),
    });

    setForm(EMPTY_FORM);
    setFormErrors({});
  }, [form, funds, addFund]);

  const handleDelete = useCallback(
    (id: number) => {
      deleteFund(id);
    },
    [deleteFund],
  );

  return (
    <div className="funds-container">
      <div className="page-header">
        <h1 className="page-title">Source of Funds</h1>
        <p className="page-subtitle">Manage funding sources and projects</p>
      </div>

      {/* Add Form */}
      <div className="add-form-card">
        <div className="add-form-title">Add New Fund Source</div>
        <div className="add-form-grid">
          <div className={`add-field ${formErrors.project_name ? "error" : ""}`}>
            <label>Project Name *</label>
            <input
              name="project_name"
              value={form.project_name}
              onChange={handleFormChange}
              placeholder="e.g. ECOBANK GH"
            />
          </div>

          <div className={`add-field ${formErrors.acronym ? "error" : ""}`}>
            <label>Acronym *</label>
            <input
              name="acronym"
              value={form.acronym}
              onChange={handleFormChange}
              placeholder="e.g. ECO"
            />
          </div>

          <div className={`add-field ${formErrors.funding_source ? "error" : ""}`}>
            <label>Funding Source *</label>
            <input
              name="funding_source"
              value={form.funding_source}
              onChange={handleFormChange}
              placeholder="e.g. Ecobank Ghana Limited"
            />
          </div>

          <button className="btn-add" onClick={handleAdd}>
            Add Fund
          </button>
        </div>
      </div>

      {/* Search + Table */}
      <div className="filters-bar">
        <input
          className="filter-search"
          type="text"
          placeholder="Search funds..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <span className="filter-count">
          Showing {filtered.length} of {funds.length}
        </span>
      </div>

      <div className="table-card">
        <div className="table-scroll">
          {filtered.length > 0 ? (
            <table className="funds-table">
              <thead>
                <tr>
                  <th>Acronym</th>
                  <th>Project Name</th>
                  <th>Funding Source</th>
                  <th style={{ width: 50 }}></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((f) => (
                  <tr key={f.id}>
                    <td className="col-acronym">{f.acronym}</td>
                    <td>{f.project_name}</td>
                    <td className="col-source">{f.funding_source}</td>
                    <td>
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(f.id)}
                        title="Delete fund"
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
              <p>No funds found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

