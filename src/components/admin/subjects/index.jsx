"use client";

import { Icon } from "@/constant";
import { api, listResource } from "@/lib/client-api";
import { useCallback, useEffect, useState } from "react";

const emptyForm = {
  name: "",
  code: "",
  courseId: "",
  teacherId: "",
  semester: "",
};

export default function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editTarget, setEditTarget] = useState(null); // subject being edited
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    try {
      const [subjectData, courseData, teacherData] = await Promise.all([
        listResource("subjects"),
        listResource("courses"),
        listResource("teachers"),
      ]);
      setSubjects(subjectData.items);
      setCourses(courseData.items.filter((c) => c.isActive));
      setTeachers(teacherData.items.filter((t) => t.isActive));
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

  const openEdit = (subject) => {
    setEditTarget(subject);
    setForm({
      name: subject.name,
      code: subject.code,
      courseId: subject.courseId?._id ?? subject.courseId,
      teacherId: subject.teacherId?._id ?? subject.teacherId,
      semester: String(subject.semester),
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
      const payload = { ...form, semester: Number(form.semester) };
      if (editTarget) {
        await api(`/api/subjects/${editTarget._id}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
      } else {
        await api("/api/subjects", {
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
    if (!confirm("Delete this subject?")) return;
    try {
      await api(`/api/subjects/${id}`, { method: "DELETE" });
      await load();
    } catch (e) {
      setError(e.message);
    }
  };

  const toggle = async (subject) => {
    try {
      await api(`/api/subjects/${subject._id}`, {
        method: "PATCH",
        body: JSON.stringify({ isActive: !subject.isActive }),
      });
      await load();
    } catch (e) {
      setError(e.message);
    }
  };

  // Group subjects by course for display
  const byCourse = subjects.reduce((acc, s) => {
    const courseId = s.courseId?._id ?? s.courseId ?? "unknown";
    const courseName = s.courseId?.name ?? "Unknown Course";
    if (!acc[courseId]) acc[courseId] = { name: courseName, items: [] };
    acc[courseId].items.push(s);
    return acc;
  }, {});

  // Derive max semesters for selected course
  const selectedCourse = courses.find((c) => c._id === form.courseId);
  const maxSemesters = selectedCourse?.totalSemesters ?? 12;

  return (
    <>
      <header className="content-head">
        <div>
          <p className="eyebrow">CURRICULUM</p>
          <h1>Subjects</h1>
          <p>Manage subjects, assign teachers, and track semesters.</p>
        </div>
        <button className="primary" onClick={openCreate}>
          <Icon name="plus" size={18} /> Add subject
        </button>
      </header>

      {error && <p className="error">{error}</p>}

      {subjects.length === 0 ? (
        <div className="empty-state panel">
          <p>No subjects yet. Add one to get started.</p>
        </div>
      ) : (
        Object.entries(byCourse).map(([courseId, group]) => (
          <section key={courseId} className="subject-group">
            <h2 className="subject-group-title">{group.name}</h2>
            <div className="subject-table panel">
              <table>
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Code</th>
                    <th>Semester</th>
                    <th>Teacher</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {group.items.map((subject) => (
                    <tr key={subject._id}>
                      <td>
                        <span className="subject-name">{subject.name}</span>
                      </td>
                      <td>
                        <span className="subject-pill code-pill">
                          {subject.code}
                        </span>
                      </td>
                      <td>
                        <span className="semester-badge">
                          Sem {subject.semester}
                        </span>
                      </td>
                      <td className="teacher-cell">
                        {subject.teacherId?.name ?? "—"}
                      </td>
                      <td>
                        <span
                          className={`status ${subject.isActive ? "active" : ""}`}
                        >
                          {subject.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>
                        <div className="row-actions">
                          <button
                            className="text-btn"
                            onClick={() => openEdit(subject)}
                          >
                            Edit
                          </button>
                          <button
                            className="text-btn muted"
                            onClick={() => toggle(subject)}
                          >
                            {subject.isActive ? "Deactivate" : "Activate"}
                          </button>
                          <button
                            className="text-btn danger"
                            onClick={() => remove(subject._id)}
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
                <h2>{editTarget ? "Edit subject" : "Add a subject"}</h2>
                <p>
                  {editTarget
                    ? "Update subject details."
                    : "Create a new curriculum entry."}
                </p>
              </div>
              <button type="button" onClick={closeModal}>
                <Icon name="close" />
              </button>
            </div>

            <label>
              Name
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Data Structures"
              />
            </label>

            <label>
              Code
              <input
                required
                value={form.code}
                onChange={(e) =>
                  setForm({ ...form, code: e.target.value.toUpperCase() })
                }
                placeholder="e.g. CS201"
              />
            </label>

            <label>
              Course
              <select
                required
                value={form.courseId}
                onChange={(e) =>
                  setForm({ ...form, courseId: e.target.value, semester: "" })
                }
              >
                <option value="">Select a course</option>
                {courses.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Semester
              <select
                required
                value={form.semester}
                disabled={!form.courseId}
                onChange={(e) => setForm({ ...form, semester: e.target.value })}
              >
                <option value="">
                  {form.courseId ? "Select semester" : "Choose course first"}
                </option>
                {Array.from({ length: maxSemesters }, (_, i) => i + 1).map(
                  (n) => (
                    <option key={n} value={n}>
                      Semester {n}
                    </option>
                  ),
                )}
              </select>
            </label>

            <label>
              Teacher
              <select
                required
                value={form.teacherId}
                onChange={(e) =>
                  setForm({ ...form, teacherId: e.target.value })
                }
              >
                <option value="">Select a teacher</option>
                {teachers.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.name} — {t.department}
                  </option>
                ))}
              </select>
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
                    : "Create subject"}
              </button>
            </div>
          </form>
        </div>
      )}

      <style jsx>{`
        .subject-group {
          margin-bottom: 2rem;
        }
        .subject-group-title {
          font-size: 0.85rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--text-muted);
          margin-bottom: 0.6rem;
          padding-left: 0.1rem;
        }
        .subject-table {
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
          padding: 0.75rem 1rem;
          text-align: left;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: var(--text-muted);
          white-space: nowrap;
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
        .subject-name {
          font-weight: 500;
          color: var(--text);
        }
        .code-pill {
          font-family: var(--font-mono, monospace);
          font-size: 0.78rem;
          font-weight: 600;
          letter-spacing: 0.04em;
        }
        .semester-badge {
          display: inline-block;
          padding: 0.2rem 0.55rem;
          border-radius: 999px;
          font-size: 0.78rem;
          font-weight: 600;
          background: var(--accent-light, rgba(99, 102, 241, 0.1));
          color: var(--accent, #6366f1);
        }
        .teacher-cell {
          color: var(--text-secondary);
        }
        .row-actions {
          display: flex;
          gap: 0.25rem;
          align-items: center;
        }
        .text-btn.muted {
          color: var(--text-muted);
        }
        .text-btn.muted:hover {
          color: var(--text);
        }
        .text-btn.danger {
          color: var(--error, #ef4444);
        }
        .empty-state {
          text-align: center;
          padding: 3rem;
          color: var(--text-muted);
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
        select:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        @media (max-width: 640px) {
          th:nth-child(4),
          td:nth-child(4) {
            display: none;
          }
          .row-actions {
            flex-direction: column;
            align-items: flex-start;
            gap: 0;
          }
        }
      `}</style>
    </>
  );
}
