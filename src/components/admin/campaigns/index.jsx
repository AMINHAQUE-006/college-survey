"use client";

import { Icon } from "@/constant";
import { api, listResource } from "@/lib/client-api";
import { useCallback, useEffect, useState } from "react";

const emptyForm = {
  title: "",
  description: "",
  courseIds: [],
  startDate: "",
  endDate: "",
  isActive: false,
};

const fmt = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString(undefined, { dateStyle: "medium" })
    : "—";

const toInputDate = (iso) => (iso ? iso.slice(0, 10) : "");

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editTarget, setEditTarget] = useState(null);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    try {
      const [campData, courseData] = await Promise.all([
        listResource("campaigns"),
        listResource("courses"),
      ]);
      setCampaigns(campData.items);
      setCourses(courseData.items.filter((c) => c.isActive));
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

  const openEdit = (c) => {
    setEditTarget(c);
    setForm({
      title: c.title,
      description: c.description || "",
      courseIds: (c.courseIds || []).map((x) => x._id ?? x),
      startDate: toInputDate(c.startDate),
      endDate: toInputDate(c.endDate),
      isActive: c.isActive,
    });
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setEditTarget(null);
    setForm(emptyForm);
  };

  const toggleCourse = (id) => {
    setForm((f) => ({
      ...f,
      courseIds: f.courseIds.includes(id)
        ? f.courseIds.filter((x) => x !== id)
        : [...f.courseIds, id],
    }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        startDate: form.startDate || undefined,
        endDate: form.endDate || undefined,
      };
      if (editTarget) {
        await api(`/api/campaigns/${editTarget._id}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
      } else {
        await api("/api/campaigns", {
          method: "POST",
          body: JSON.stringify(payload),
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
    if (!confirm("Delete this campaign?")) return;
    try {
      await api(`/api/campaigns/${id}`, { method: "DELETE" });
      await load();
    } catch (e) {
      setError(e.message);
    }
  };

  const toggle = async (campaign) => {
    try {
      await api(`/api/campaigns/${campaign._id}`, {
        method: "PATCH",
        body: JSON.stringify({ isActive: !campaign.isActive }),
      });
      await load();
    } catch (e) {
      setError(e.message);
    }
  };

  const now = new Date();
  const statusOf = (c) => {
    if (!c.isActive) return { label: "Inactive", cls: "" };
    const start = c.startDate ? new Date(c.startDate) : null;
    const end = c.endDate ? new Date(c.endDate) : null;
    if (start && now < start) return { label: "Scheduled", cls: "scheduled" };
    if (end && now > end) return { label: "Ended", cls: "ended" };
    return { label: "Live", cls: "active" };
  };

  return (
    <>
      <header className="content-head">
        <div>
          <p className="eyebrow">SURVEYS</p>
          <h1>Campaigns</h1>
          <p>Schedule and manage feedback collection campaigns.</p>
        </div>
        <button className="primary" onClick={openCreate}>
          <Icon name="plus" size={18} /> New campaign
        </button>
      </header>

      {error && <p className="error">{error}</p>}

      {campaigns.length === 0 ? (
        <div className="empty-state panel">
          <p>No campaigns yet. Create one to start collecting feedback.</p>
        </div>
      ) : (
        <div className="campaign-list">
          {campaigns.map((c) => {
            const { label, cls } = statusOf(c);
            const courseNames = (c.courseIds || [])
              .map((x) => x.name ?? x)
              .filter(Boolean);
            return (
              <article className="panel campaign-card" key={c._id}>
                <div className="campaign-card-top">
                  <span className={`status ${cls}`}>{label}</span>
                  <div className="row-actions">
                    <button className="text-btn" onClick={() => openEdit(c)}>
                      Edit
                    </button>
                    <button
                      className="text-btn muted"
                      onClick={() => toggle(c)}
                    >
                      {c.isActive ? "Deactivate" : "Activate"}
                    </button>
                    <button
                      className="text-btn danger"
                      onClick={() => remove(c._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <h2 className="campaign-title">{c.title}</h2>
                {c.description && (
                  <p className="campaign-desc">{c.description}</p>
                )}

                <div className="campaign-meta">
                  <div className="meta-item">
                    <Icon name="calendar" size={14} />
                    <span>
                      {fmt(c.startDate)} → {fmt(c.endDate)}
                    </span>
                  </div>
                  <div className="meta-item">
                    <Icon name="book" size={14} />
                    <span>
                      {courseNames.length > 0
                        ? courseNames.join(", ")
                        : "No courses"}
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {open && (
        <div className="modal-backdrop" onMouseDown={closeModal}>
          <form
            className="modal modal-wide"
            onSubmit={submit}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="modal-head">
              <div>
                <h2>{editTarget ? "Edit campaign" : "New campaign"}</h2>
                <p>
                  {editTarget
                    ? "Update campaign details."
                    : "Set up a new feedback campaign."}
                </p>
              </div>
              <button type="button" onClick={closeModal}>
                <Icon name="close" />
              </button>
            </div>

            <label>
              Title
              <input
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Semester 1 Feedback 2025"
              />
            </label>

            <label>
              Description
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="Optional — visible to students"
                rows={2}
              />
            </label>

            <div className="form-row">
              <label>
                Start date
                <input
                  type="date"
                  value={form.startDate}
                  onChange={(e) =>
                    setForm({ ...form, startDate: e.target.value })
                  }
                />
              </label>
              <label>
                End date
                <input
                  type="date"
                  value={form.endDate}
                  onChange={(e) =>
                    setForm({ ...form, endDate: e.target.value })
                  }
                />
              </label>
            </div>

            <fieldset>
              <legend>Courses</legend>
              <div className="course-checkboxes">
                {courses.map((c) => (
                  <label key={c._id} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={form.courseIds.includes(c._id)}
                      onChange={() => toggleCourse(c._id)}
                    />
                    {c.name}
                  </label>
                ))}
              </div>
            </fieldset>

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
                    : "Create campaign"}
              </button>
            </div>
          </form>
        </div>
      )}

      <style jsx>{`
        .campaign-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 1rem;
        }
        .campaign-card {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .campaign-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
        }
        .campaign-title {
          font-size: 1rem;
          font-weight: 600;
          margin: 0;
        }
        .campaign-desc {
          font-size: 0.875rem;
          color: var(--text-secondary);
          margin: 0;
        }
        .campaign-meta {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
          margin-top: 0.25rem;
          padding-top: 0.75rem;
          border-top: 1px solid var(--border);
        }
        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        .status.scheduled {
          background: rgba(234, 179, 8, 0.12);
          color: #b45309;
        }
        .status.ended {
          background: var(--border);
          color: var(--text-muted);
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
        .modal-wide {
          max-width: 540px;
        }
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }
        fieldset {
          border: 1px solid var(--border);
          border-radius: var(--radius, 8px);
          padding: 0.75rem 1rem;
        }
        legend {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-muted);
          padding: 0 0.25rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .course-checkboxes {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-top: 0.5rem;
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
        @media (max-width: 640px) {
          .form-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}
