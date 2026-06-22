"use client";

import { Icon } from "@/constant";
import { api, listResource } from "@/lib/client-api";
import { useCallback, useEffect, useState } from "react";

const CATEGORIES = ["Teaching", "Content", "Environment", "Support", "Other"];

const emptyForm = {
  question: "",
  category: "",
  isActive: true,
};

export default function Questions() {
  const [questions, setQuestions] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editTarget, setEditTarget] = useState(null);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");

  const load = useCallback(async () => {
    try {
      const data = await listResource("questions");
      setQuestions(data.items);
      setError("");
    } catch (e) {
      setError(e.message);
    }
  }, []);

  useEffect(() => {
    Promise.resolve().then(load);
  }, [load]);

  const openCreate = () => {
    setEditTarget(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const openEdit = (q) => {
    setEditTarget(q);
    setForm({
      question: q.question,
      category: q.category || "",
      isActive: q.isActive,
    });
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setEditTarget(null);
    setForm(emptyForm);
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editTarget) {
        await api(`/api/questions/${editTarget._id}`, {
          method: "PATCH",
          body: JSON.stringify(form),
        });
      } else {
        await api("/api/questions", {
          method: "POST",
          body: JSON.stringify(form),
        });
      }
      closeModal();
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete this question?")) return;
    try {
      await api(`/api/questions/${id}`, { method: "DELETE" });
      await load();
    } catch (e) {
      setError(e.message);
    }
  };

  const toggle = async (q) => {
    try {
      await api(`/api/questions/${q._id}`, {
        method: "PATCH",
        body: JSON.stringify({ isActive: !q.isActive }),
      });
      await load();
    } catch (e) {
      setError(e.message);
    }
  };

  const visible =
    filter === "all"
      ? questions
      : filter === "active"
        ? questions.filter((q) => q.isActive)
        : questions.filter((q) => !q.isActive);

  // Group visible by category
  const byCategory = visible.reduce((acc, q) => {
    const cat = q.category || "Uncategorised";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(q);
    return acc;
  }, {});

  const activeCount = questions.filter((q) => q.isActive).length;

  return (
    <>
      <header className="content-head">
        <div>
          <p className="eyebrow">SURVEY SETUP</p>
          <h1>Question Bank</h1>
          <p>
            {questions.length} questions · {activeCount} active
          </p>
        </div>
        <button className="primary" onClick={openCreate}>
          <Icon name="plus" size={18} /> Add question
        </button>
      </header>

      {error && <p className="error">{error}</p>}

      <div className="filter-bar">
        {["all", "active", "inactive"].map((f) => (
          <button
            key={f}
            className={`filter-btn ${filter === f ? "selected" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="empty-state panel">
          <p>No questions match this filter.</p>
        </div>
      ) : (
        Object.entries(byCategory).map(([cat, qs]) => (
          <section key={cat} className="q-group">
            <h2 className="q-group-title">{cat}</h2>
            <div className="panel q-table">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Question</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {qs.map((q, i) => (
                    <tr key={q._id}>
                      <td className="q-num">{i + 1}</td>
                      <td className="q-text">{q.question}</td>
                      <td>
                        <span
                          className={`status ${q.isActive ? "active" : ""}`}
                        >
                          {q.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>
                        <div className="row-actions">
                          <button
                            className="text-btn"
                            onClick={() => openEdit(q)}
                          >
                            Edit
                          </button>
                          <button
                            className="text-btn muted"
                            onClick={() => toggle(q)}
                          >
                            {q.isActive ? "Deactivate" : "Activate"}
                          </button>
                          <button
                            className="text-btn danger"
                            onClick={() => remove(q._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))
      )}

      {open && (
        <div className="modal-backdrop" onMouseDown={closeModal}>
          <form
            className="modal"
            onSubmit={submit}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="modal-head">
              <div>
                <h2>{editTarget ? "Edit question" : "Add a question"}</h2>
                <p>
                  {editTarget
                    ? "Update the question text or category."
                    : "Add a question to the bank."}
                </p>
              </div>
              <button type="button" onClick={closeModal}>
                <Icon name="close" />
              </button>
            </div>

            <label>
              Question
              <textarea
                required
                rows={3}
                value={form.question}
                onChange={(e) => setForm({ ...form, question: e.target.value })}
                placeholder="e.g. How clearly did the teacher explain concepts?"
              />
            </label>

            <label>
              Category
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                <option value="">Uncategorised</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>

            <label className="checkbox-label inline-check">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) =>
                  setForm({ ...form, isActive: e.target.checked })
                }
              />
              Mark as active
            </label>

            <div className="modal-actions">
              <button type="button" className="secondary" onClick={closeModal}>
                Cancel
              </button>
              <button className="primary" disabled={loading}>
                {loading
                  ? "Saving…"
                  : editTarget
                    ? "Save changes"
                    : "Add question"}
              </button>
            </div>
          </form>
        </div>
      )}

      <style jsx>{`
        .filter-bar {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1.25rem;
        }
        .filter-btn {
          padding: 0.35rem 0.9rem;
          border-radius: 999px;
          border: 1px solid var(--border);
          background: var(--surface);
          color: var(--text-muted);
          font-size: 0.8rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s;
        }
        .filter-btn.selected {
          background: var(--accent, #6366f1);
          color: #fff;
          border-color: var(--accent, #6366f1);
        }
        .q-group {
          margin-bottom: 1.75rem;
        }
        .q-group-title {
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--text-muted);
          margin-bottom: 0.5rem;
        }
        .q-table {
          overflow-x: auto;
          padding: 0;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.9rem;
        }
        thead tr {
          border-bottom: 1px solid var(--border);
        }
        th {
          padding: 0.7rem 1rem;
          text-align: left;
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: var(--text-muted);
        }
        td {
          padding: 0.85rem 1rem;
          border-bottom: 1px solid var(--border);
          vertical-align: middle;
        }
        tbody tr:last-child td {
          border-bottom: none;
        }
        tbody tr:hover {
          background: var(--surface-hover, rgba(99, 102, 241, 0.04));
        }
        .q-num {
          color: var(--text-muted);
          font-size: 0.8rem;
          width: 2rem;
        }
        .q-text {
          font-weight: 400;
          line-height: 1.5;
        }
        .row-actions {
          display: flex;
          gap: 0.25rem;
          align-items: center;
        }
        .text-btn.muted {
          color: var(--text-muted);
        }
        .text-btn.danger {
          color: var(--error, #ef4444);
        }
        .empty-state {
          text-align: center;
          padding: 3rem;
          color: var(--text-muted);
        }
        textarea {
          width: 100%;
          padding: 0.5rem 0.75rem;
          border: 1px solid var(--border);
          border-radius: var(--radius, 8px);
          background: var(--surface);
          color: var(--text);
          font-size: 0.9rem;
          font-family: inherit;
          resize: vertical;
          margin-top: 0.35rem;
        }
        textarea:focus {
          outline: none;
          border-color: var(--accent, #6366f1);
          box-shadow: 0 0 0 3px var(--accent-light, rgba(99, 102, 241, 0.15));
        }
        select {
          width: 100%;
          padding: 0.5rem 0.75rem;
          border: 1px solid var(--border);
          border-radius: var(--radius, 8px);
          background: var(--surface);
          color: var(--text);
          font-size: 0.9rem;
          margin-top: 0.35rem;
        }
        select:focus {
          outline: none;
          border-color: var(--accent, #6366f1);
          box-shadow: 0 0 0 3px var(--accent-light, rgba(99, 102, 241, 0.15));
        }
        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          font-weight: 400;
          cursor: pointer;
        }
        .checkbox-label input[type="checkbox"] {
          width: 1rem;
          height: 1rem;
          accent-color: var(--accent, #6366f1);
          margin: 0;
        }
        .inline-check {
          margin-top: 0.25rem;
        }
      `}</style>
    </>
  );
}
