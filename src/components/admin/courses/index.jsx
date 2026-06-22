"use client";

import { Icon } from "@/constant";
import { api, listResource } from "@/lib/client-api";
import { useCallback, useEffect, useState } from "react";

const emptyForm = { name: "", code: "", totalSemesters: 6, studentCount: 0 };

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const load = useCallback(async () => {
    try { setCourses((await listResource("courses")).items); setError(""); }
    catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { Promise.resolve().then(load); }, [load]);
  const add = async (event) => {
    event.preventDefault();
    try {
      await api("/api/courses", { method: "POST", body: JSON.stringify(form) });
      setOpen(false); setForm(emptyForm); await load();
    } catch (e) { setError(e.message); }
  };
  const remove = async (id) => {
    if (!confirm("Delete this course?")) return;
    try { await api(`/api/courses/${id}`, { method: "DELETE" }); await load(); }
    catch (e) { setError(e.message); }
  };
  const filtered = courses.filter((c) => `${c.name} ${c.code}`.toLowerCase().includes(query.toLowerCase()));
  return <>
    <header className="content-head"><div><p className="eyebrow">ACADEMICS</p><h1>Courses</h1><p>Manage courses and semester structures.</p></div><button className="primary" onClick={() => setOpen(true)}><Icon name="plus" size={18}/> Add course</button></header>
    {error && <p className="error">{error}</p>}
    <article className="panel table-panel"><div className="table-tools"><div className="search"><Icon name="search" size={18}/><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search courses..."/></div><span>{filtered.length} courses</span></div>
      <div className="table-scroll"><table><thead><tr><th>Course</th><th>Code</th><th>Semesters</th><th>Students</th><th>Status</th><th></th></tr></thead><tbody>
        {loading ? <tr><td colSpan="6">Loading courses…</td></tr> : filtered.map((c, i) => <tr key={c._id}><td><div className="course-cell"><span className={`course-icon c${i%4}`}><Icon name="book" size={18}/></span><b>{c.name}</b></div></td><td><code>{c.code}</code></td><td>{c.totalSemesters}</td><td>{c.studentCount}</td><td><span className={`status ${c.isActive ? "active" : ""}`}>{c.isActive ? "Active" : "Inactive"}</span></td><td><button className="dots" onClick={() => remove(c._id)} aria-label={`Delete ${c.name}`}>×</button></td></tr>)}
      </tbody></table></div></article>
    {open && <div className="modal-backdrop" onMouseDown={() => setOpen(false)}><form className="modal" onSubmit={add} onMouseDown={(e) => e.stopPropagation()}><div className="modal-head"><div><h2>Add a course</h2><p>Create a new academic programme.</p></div><button type="button" onClick={() => setOpen(false)}><Icon name="close"/></button></div>
      <label>Course name<input autoFocus required value={form.name} onChange={(e) => setForm({...form,name:e.target.value})}/></label><div className="form-row"><label>Course code<input required value={form.code} onChange={(e) => setForm({...form,code:e.target.value.toUpperCase()})}/></label><label>Total semesters<input type="number" min="1" max="12" value={form.totalSemesters} onChange={(e) => setForm({...form,totalSemesters:e.target.value})}/></label></div><label>Student count<input type="number" min="0" value={form.studentCount} onChange={(e) => setForm({...form,studentCount:e.target.value})}/></label><div className="modal-actions"><button type="button" className="secondary" onClick={() => setOpen(false)}>Cancel</button><button className="primary">Create course</button></div>
    </form></div>}
  </>;
}
