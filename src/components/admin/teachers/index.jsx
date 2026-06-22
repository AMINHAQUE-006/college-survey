"use client";

import { Icon } from "@/constant";
import { api, listResource } from "@/lib/client-api";
import { useCallback, useEffect, useState } from "react";

const empty = { name: "", employeeId: "", designation: "", department: "" };
const initials = (name = "") =>
  name
    .split(/\s+/)
    .map((x) => x[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export default function Teachers() {
  const [teachers, setTeachers] = useState([]);
  const [ratings, setRatings] = useState({});
  const [form, setForm] = useState(empty);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const load = useCallback(async () => {
    try {
      const [records, analytics] = await Promise.all([
        listResource("teachers"),
        api("/api/analytics/teachers"),
      ]);
      setTeachers(records.items);
      setRatings(
        Object.fromEntries(analytics.topRated.map((x) => [x.teacherId, x])),
      );
      setError("");
    } catch (e) {
      setError(e.message);
    }
  }, []);
  useEffect(() => {
    Promise.resolve().then(load);
  }, [load]);
  const add = async (e) => {
    e.preventDefault();
    try {
      await api("/api/teachers", {
        method: "POST",
        body: JSON.stringify(form),
      });
      setOpen(false);
      setForm(empty);
      await load();
    } catch (err) {
      setError(err.message);
    }
  };
  const remove = async (id) => {
    if (!confirm("Delete this teacher?")) return;
    try {
      await api(`/api/teachers/${id}`, { method: "DELETE" });
      await load();
    } catch (e) {
      setError(e.message);
    }
  };
  return (
    <>
      <header className="content-head">
        <div>
          <p className="eyebrow">FACULTY</p>
          <h1>Teachers</h1>
          <p>Faculty profiles and performance at a glance.</p>
        </div>
        <button className="primary" onClick={() => setOpen(true)}>
          <Icon name="plus" size={18} /> Add teacher
        </button>
      </header>
      {error && <p className="error">{error}</p>}
      <section className="teacher-cards">
        {teachers.map((teacher, index) => {
          const score = ratings[teacher._id];
          return (
            <article className="panel teacher-card" key={teacher._id}>
              <div className="teacher-card-top">
                <span className={`avatar large a${index % 4}`}>
                  {initials(teacher.name)}
                </span>
                <span className={`status ${teacher.isActive ? "active" : ""}`}>
                  {teacher.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <h2>{teacher.name}</h2>
              <p>{teacher.department}</p>
              <div className="subject-pill">{teacher.designation}</div>
              <div className="teacher-metrics">
                <div>
                  <Icon name="star" size={17} />
                  <b>{score?.averageRating ?? "—"}</b>
                  <span>Rating</span>
                </div>
                <div>
                  <b>{score?.totalResponses ?? 0}</b>
                  <span>Responses</span>
                </div>
              </div>
              <button className="text-btn" onClick={() => remove(teacher._id)}>
                Delete
              </button>
            </article>
          );
        })}
      </section>
      {open && (
        <div className="modal-backdrop" onMouseDown={() => setOpen(false)}>
          <form
            className="modal"
            onSubmit={add}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="modal-head">
              <div>
                <h2>Add a teacher</h2>
                <p>Create a faculty profile.</p>
              </div>
              <button type="button" onClick={() => setOpen(false)}>
                <Icon name="close" />
              </button>
            </div>
            {[
              ["Name", "name"],
              ["Employee ID", "employeeId"],
              ["Designation", "designation"],
              ["Department", "department"],
            ].map(([label, key]) => (
              <label key={key}>
                {label}
                <input
                  required
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                />
              </label>
            ))}
            <div className="modal-actions">
              <button
                type="button"
                className="secondary"
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>
              <button className="primary">Create teacher</button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
