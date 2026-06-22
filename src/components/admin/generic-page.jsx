"use client";

import { Icon } from "@/constant";
import { api, listResource } from "@/lib/client-api";
import { useCallback, useEffect, useMemo, useState } from "react";

const configs = {
  subjects: { eyebrow: "ACADEMICS", title: "Subjects", description: "Organise subjects, semesters and faculty assignments.", resource: "subjects", add: "Add subject" },
  campaigns: { eyebrow: "ENGAGEMENT", title: "Campaigns", description: "Plan and monitor student feedback collection windows.", resource: "campaigns", add: "New campaign" },
  "question-bank": { eyebrow: "CONTENT", title: "Question bank", description: "Build the reusable questions shown in every survey.", resource: "questions", add: "Add question" },
  feedback: { eyebrow: "RESPONSES", title: "Feedback", description: "Explore anonymous student submissions and suggestions.", resource: "feedback" },
  analytics: { eyebrow: "INSIGHTS", title: "Analytics", description: "Understand participation and academic experience at a glance." },
  settings: { eyebrow: "CONFIGURATION", title: "Settings", description: "Manage administrators and portal preferences.", resource: "admins", add: "Add administrator" },
};

export const isAdminSection = (section) => Boolean(configs[section]);
const categoryLabel = { infrastructure: "Infrastructure", academic: "Academic experience", teacher: "Teacher feedback" };
const initials = (name = "") => name.split(/\s+/).map((x) => x[0]).join("").slice(0, 2).toUpperCase();
const date = (value, withTime = false) => value ? new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric", ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}) }).format(new Date(value)) : "—";
const campaignState = (item) => { const now = Date.now(); if (!item.isActive) return ["Inactive", "muted"]; if (new Date(item.startDate) > now) return ["Scheduled", "scheduled"]; if (new Date(item.endDate) < now) return ["Ended", "muted"]; return ["Live", "active"]; };

export default function GenericPage({ section }) {
  const config = configs[section];
  const [items, setItems] = useState([]);
  const [refs, setRefs] = useState({ courses: [], teachers: [] });
  const [analytics, setAnalytics] = useState(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [open, setOpen] = useState(false);
  const [detail, setDetail] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      if (section === "analytics") {
        const [teachers, courses, campaigns] = await Promise.all([api("/api/analytics/teachers"), api("/api/analytics/courses"), api("/api/analytics/campaigns")]);
        setAnalytics({ teachers, courses, campaigns });
      } else {
        const calls = [listResource(config.resource)];
        if (["subjects", "campaigns"].includes(section)) calls.push(listResource("courses"));
        if (section === "subjects") calls.push(listResource("teachers"));
        const result = await Promise.all(calls);
        setItems(result[0].items || []);
        if (section === "subjects") setRefs({ courses: result[1].items, teachers: result[2].items });
        if (section === "campaigns") setRefs((r) => ({ ...r, courses: result[1].items }));
      }
      setError("");
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, [config.resource, section]);

  useEffect(() => { load(); }, [load]);
  const filtered = useMemo(() => items.filter((item) => {
    const haystack = JSON.stringify(item).toLowerCase();
    const searchMatch = haystack.includes(query.toLowerCase());
    if (!searchMatch || filter === "all") return searchMatch;
    if (section === "question-bank") return item.category === filter;
    if (section === "subjects" || section === "settings") return filter === "active" ? item.isActive : !item.isActive;
    if (section === "campaigns") return campaignState(item)[0].toLowerCase() === filter;
    return searchMatch;
  }), [items, query, filter, section]);

  const submit = async (event) => {
    event.preventDefault(); setSaving(true); setError("");
    try {
      const body = { ...form };
      if (section === "campaigns") body.courseIds = form.courseIds || [];
      await api(`/api/${config.resource}`, { method: "POST", body: JSON.stringify(body) });
      setOpen(false); setForm({}); await load();
    } catch (e) { setError(e.message); }
    finally { setSaving(false); }
  };
  const toggle = async (item) => { try { await api(`/api/${config.resource}/${item._id}`, { method: "PATCH", body: JSON.stringify({ isActive: !item.isActive }) }); await load(); } catch (e) { setError(e.message); } };
  const remove = async (item) => { if (!confirm(`Delete “${item.name || item.title || item.question}”?`)) return; try { await api(`/api/${config.resource}/${item._id}`, { method: "DELETE" }); await load(); } catch (e) { setError(e.message); } };

  if (section === "analytics") return <AnalyticsPage config={config} data={analytics} loading={loading} error={error} />;
  return <>
    <PageHeader config={config} onAdd={() => { setForm({}); setOpen(true); }} />
    {error && <div className="notice error-notice"><Icon name="question" size={17} />{error}</div>}
    <Summary section={section} items={items} />
    <section className="panel resource-panel">
      <Toolbar section={section} query={query} setQuery={setQuery} filter={filter} setFilter={setFilter} count={filtered.length} />
      {loading ? <Loading /> : filtered.length ? <ResourceTable section={section} items={filtered} onToggle={toggle} onDelete={remove} onDetail={setDetail} /> : <Empty query={query} onAdd={config.add ? () => setOpen(true) : null} />}
    </section>
    {open && <Editor section={section} form={form} setForm={setForm} refs={refs} onClose={() => setOpen(false)} onSubmit={submit} saving={saving} />}
    {detail && <FeedbackDetail item={detail} onClose={() => setDetail(null)} />}
  </>;
}

function PageHeader({ config, onAdd }) { return <header className="content-head"><div><p className="eyebrow">{config.eyebrow}</p><h1>{config.title}</h1><p>{config.description}</p></div>{config.add && <button className="primary" onClick={onAdd}><Icon name="plus" size={18} />{config.add}</button>}</header>; }

function Summary({ section, items }) {
  if (section === "subjects") return <div className="mini-stats"><Mini label="Total subjects" value={items.length} icon="building"/><Mini label="Active" value={items.filter(x => x.isActive).length} icon="check" tone="green"/><Mini label="Faculty assigned" value={new Set(items.map(x => x.teacherId?._id)).size} icon="users" tone="pink"/></div>;
  if (section === "campaigns") return <div className="mini-stats"><Mini label="All campaigns" value={items.length} icon="campaign"/><Mini label="Live now" value={items.filter(x => campaignState(x)[0] === "Live").length} icon="feedback" tone="green"/><Mini label="Scheduled" value={items.filter(x => campaignState(x)[0] === "Scheduled").length} icon="chart" tone="amber"/></div>;
  if (section === "question-bank") return <div className="mini-stats"><Mini label="Total questions" value={items.length} icon="question"/><Mini label="Active" value={items.filter(x => x.isActive).length} icon="check" tone="green"/><Mini label="Categories" value={new Set(items.map(x => x.category)).size} icon="book" tone="pink"/></div>;
  if (section === "feedback") return <div className="mini-stats"><Mini label="Submissions" value={items.length} icon="feedback"/><Mini label="Courses reached" value={new Set(items.map(x => x.courseId?._id)).size} icon="book" tone="green"/><Mini label="With suggestions" value={items.filter(x => x.collegeSuggestion || x.additionalSuggestion).length} icon="question" tone="amber"/></div>;
  return <div className="mini-stats"><Mini label="Administrators" value={items.length} icon="users"/><Mini label="Active access" value={items.filter(x => x.isActive).length} icon="shield" tone="green"/></div>;
}
function Mini({ label, value, icon, tone = "blue" }) { return <article className="panel mini-stat"><span className={`stat-icon ${tone}`}><Icon name={icon}/></span><div><small>{label}</small><strong>{value}</strong></div></article>; }

function Toolbar({ section, query, setQuery, filter, setFilter, count }) {
  const options = section === "question-bank" ? [["all","All categories"],["infrastructure","Infrastructure"],["academic","Academic"],["teacher","Teacher"]] : section === "campaigns" ? [["all","All statuses"],["live","Live"],["scheduled","Scheduled"],["inactive","Inactive"]] : ["subjects","settings"].includes(section) ? [["all","All statuses"],["active","Active"],["inactive","Inactive"]] : [["all","All responses"]];
  return <div className="resource-toolbar"><div className="search"><Icon name="search" size={17}/><input aria-label="Search" placeholder={`Search ${section.replace("-", " ")}…`} value={query} onChange={e => setQuery(e.target.value)}/></div><div className="toolbar-right"><select value={filter} onChange={e => setFilter(e.target.value)}>{options.map(([value,label]) => <option key={value} value={value}>{label}</option>)}</select><span>{count} {count === 1 ? "record" : "records"}</span></div></div>;
}

function ResourceTable({ section, items, onToggle, onDelete, onDetail }) {
  const heads = { subjects:["Subject","Course","Semester","Faculty","Status",""], campaigns:["Campaign","Courses","Timeline","Status",""], "question-bank":["Question","Category","Order","Status",""], feedback:["Submission","Course","Semester","Campaign",""], settings:["Administrator","Role","Last login","Status",""] }[section];
  return <div className="table-scroll"><table className="resource-table"><thead><tr>{heads.map((h,i) => <th key={i}>{h}</th>)}</tr></thead><tbody>{items.map((item) => <tr key={item._id}>{section === "subjects" && <><td><div className="primary-cell"><span className="record-icon blue"><Icon name="building" size={17}/></span><div><b>{item.name}</b><small>{item.code}</small></div></div></td><td>{item.courseId?.name || "—"}<small className="cell-sub">{item.courseId?.code}</small></td><td>Semester {item.semester}</td><td><div className="avatar-name"><span className="avatar">{initials(item.teacherId?.name)}</span>{item.teacherId?.name || "Unassigned"}</div></td><td><Status active={item.isActive}/></td><Actions item={item} onToggle={onToggle} onDelete={onDelete}/></>}
      {section === "campaigns" && <><td><div className="primary-cell"><span className="record-icon pink"><Icon name="campaign" size={17}/></span><div><b>{item.title}</b><small>{item.description || "Feedback campaign"}</small></div></div></td><td>{item.courseIds?.map(x => x.code).join(", ") || "—"}<small className="cell-sub">{item.courseIds?.length || 0} course(s)</small></td><td>{date(item.startDate)}<small className="cell-sub">to {date(item.endDate)}</small></td><td><StateStatus state={campaignState(item)}/></td><Actions item={item} onToggle={onToggle} onDelete={onDelete}/></>}
      {section === "question-bank" && <><td className="question-cell"><b>{item.question}</b></td><td><span className={`category ${item.category}`}>{categoryLabel[item.category]}</span></td><td>#{item.sortOrder}</td><td><Status active={item.isActive}/></td><Actions item={item} onToggle={onToggle} onDelete={onDelete}/></>}
      {section === "feedback" && <><td><b>#{item._id.slice(-6).toUpperCase()}</b><small className="cell-sub">{date(item.createdAt, true)}</small></td><td>{item.courseId?.name || "—"}<small className="cell-sub">{item.courseId?.code}</small></td><td>Semester {item.semester}</td><td>{item.campaignId?.title || "—"}</td><td><button className="view-btn" onClick={() => onDetail(item)}>View response <Icon name="arrow" size={15}/></button></td></>}
      {section === "settings" && <><td><div className="avatar-name"><span className="avatar largeish">{initials(item.name)}</span><div><b>{item.name}</b><small className="cell-sub">{item.email}</small></div></div></td><td><span className="category academic">Administrator</span></td><td>{date(item.lastLogin, true)}</td><td><Status active={item.isActive}/></td><Actions item={item} onToggle={onToggle} onDelete={onDelete}/></>}</tr>)}</tbody></table></div>;
}
function Actions({ item, onToggle, onDelete }) { return <td><div className="row-actions"><button onClick={() => onToggle(item)}>{item.isActive ? "Disable" : "Enable"}</button><button className="danger-link" onClick={() => onDelete(item)}>Delete</button></div></td>; }
function Status({ active }) { return <span className={`status ${active ? "active" : "muted"}`}><i/>{active ? "Active" : "Inactive"}</span>; }
function StateStatus({ state: [label,tone] }) { return <span className={`status ${tone}`}><i/>{label}</span>; }
function Loading() { return <div className="loading-state"><span className="spinner"/><p>Loading records…</p></div>; }
function Empty({ query, onAdd }) { return <div className="empty-state"><span><Icon name="search" size={25}/></span><h3>{query ? "No matching records" : "Nothing here yet"}</h3><p>{query ? "Try a different search or filter." : "Create the first record to get this page moving."}</p>{onAdd && !query && <button className="secondary" onClick={onAdd}><Icon name="plus" size={16}/> Add record</button>}</div>; }

function Editor({ section, form, setForm, refs, onClose, onSubmit, saving }) {
  const update = (key, value) => setForm((x) => ({ ...x, [key]: value }));
  const titles = { subjects:"Add subject", campaigns:"Create campaign", "question-bank":"Add survey question", settings:"Add administrator" };
  return <div className="modal-backdrop" onMouseDown={onClose}><form className="modal editor-modal" onSubmit={onSubmit} onMouseDown={e => e.stopPropagation()}><div className="modal-head"><div><p className="eyebrow">NEW RECORD</p><h2>{titles[section]}</h2></div><button type="button" onClick={onClose} aria-label="Close"><Icon name="close"/></button></div>
    {section === "subjects" && <><Field label="Subject name" value={form.name} onChange={v => update("name",v)} placeholder="e.g. Data Structures"/><div className="form-row"><Field label="Subject code" value={form.code} onChange={v => update("code",v)} placeholder="CS301"/><Field label="Semester" type="number" min="1" max="12" value={form.semester} onChange={v => update("semester",v)}/></div><Select label="Course" value={form.courseId} onChange={v => update("courseId",v)} options={refs.courses.map(x => [x._id,`${x.code} — ${x.name}`])}/><Select label="Assigned teacher" value={form.teacherId} onChange={v => update("teacherId",v)} options={refs.teachers.map(x => [x._id,x.name])}/></>}
    {section === "campaigns" && <><Field label="Campaign title" value={form.title} onChange={v => update("title",v)} placeholder="Mid-semester feedback 2026"/><TextArea label="Description (optional)" value={form.description} onChange={v => update("description",v)}/><label className="field-label">Courses<span className="course-picker">{refs.courses.map(x => <button type="button" className={form.courseIds?.includes(x._id) ? "selected" : ""} key={x._id} onClick={() => update("courseIds", form.courseIds?.includes(x._id) ? form.courseIds.filter(id => id !== x._id) : [...(form.courseIds || []),x._id])}><i>{form.courseIds?.includes(x._id) && <Icon name="check" size={13}/>}</i>{x.code}</button>)}</span></label><div className="form-row"><Field label="Starts" type="datetime-local" value={form.startDate} onChange={v => update("startDate",v)}/><Field label="Ends" type="datetime-local" value={form.endDate} onChange={v => update("endDate",v)}/></div><label className="switch-row"><span><b>Activate immediately</b><small>Students can access it during the selected dates.</small></span><input type="checkbox" checked={form.isActive || false} onChange={e => update("isActive",e.target.checked)}/></label></>}
    {section === "question-bank" && <><TextArea label="Question" required value={form.question} onChange={v => update("question",v)} placeholder="How would you rate…?"/><div className="form-row"><Select label="Category" value={form.category} onChange={v => update("category",v)} options={Object.entries(categoryLabel).map(([v,l]) => [v,l])}/><Field label="Display order" type="number" min="0" value={form.sortOrder ?? 0} onChange={v => update("sortOrder",v)}/></div></>}
    {section === "settings" && <><Field label="Full name" value={form.name} onChange={v => update("name",v)}/><Field label="Email address" type="email" value={form.email} onChange={v => update("email",v)}/><Field label="Temporary password" type="password" minLength="8" value={form.password} onChange={v => update("password",v)} help="At least 8 characters"/></>}
    <div className="modal-actions"><button type="button" className="secondary" onClick={onClose}>Cancel</button><button className="primary" disabled={saving}>{saving ? "Saving…" : "Create record"}</button></div></form></div>;
}
function Field({ label, value = "", onChange, help, ...props }) { return <label className="field-label">{label}<input required value={value} onChange={e => onChange(e.target.value)} {...props}/>{help && <small>{help}</small>}</label>; }
function TextArea({ label, value = "", onChange, ...props }) { return <label className="field-label">{label}<textarea value={value} onChange={e => onChange(e.target.value)} {...props}/></label>; }
function Select({ label, value = "", onChange, options }) { return <label className="field-label">{label}<select required value={value} onChange={e => onChange(e.target.value)}><option value="">Select an option</option>{options.map(([v,l]) => <option value={v} key={v}>{l}</option>)}</select></label>; }

function FeedbackDetail({ item, onClose }) { const teacherRatings = item.teacherFeedback?.flatMap(x => x.ratings || []) || []; const all = [...(item.infrastructure || []),...(item.academic || []),...teacherRatings]; const average = all.length ? (all.reduce((s,x) => s+x.rating,0)/all.length).toFixed(1) : "—"; return <div className="modal-backdrop" onMouseDown={onClose}><div className="modal response-modal" onMouseDown={e => e.stopPropagation()}><div className="modal-head"><div><p className="eyebrow">ANONYMOUS RESPONSE</p><h2>Submission #{item._id.slice(-6).toUpperCase()}</h2><p>{date(item.createdAt,true)} · Semester {item.semester}</p></div><button onClick={onClose}><Icon name="close"/></button></div><div className="response-score"><span><Icon name="star"/> {average}</span><div><b>Overall rating</b><small>Across {all.length} answered questions</small></div></div><div className="response-meta"><div><small>Course</small><b>{item.courseId?.name}</b></div><div><small>Campaign</small><b>{item.campaignId?.title}</b></div></div><Suggestion title="College suggestion" text={item.collegeSuggestion}/><Suggestion title="Additional suggestion" text={item.additionalSuggestion}/><div className="modal-actions"><button className="primary" onClick={onClose}>Done</button></div></div></div>; }
function Suggestion({ title, text }) { return <div className="suggestion"><small>{title}</small><p>{text || "No suggestion provided."}</p></div>; }

function AnalyticsPage({ config, data, loading, error }) {
  const teachers = data?.teachers; const courses = data?.courses || []; const campaigns = data?.campaigns || [];
  const responses = campaigns.reduce((s,x) => s+x.totalResponses,0); const averageParticipation = campaigns.filter(x => x.participationRate != null); const participation = averageParticipation.length ? Math.round(averageParticipation.reduce((s,x) => s+x.participationRate,0)/averageParticipation.length) : 0;
  return <><PageHeader config={config}/>{error && <div className="notice error-notice">{error}</div>}{loading ? <Loading/> : <><div className="mini-stats analytics-stats"><Mini label="Overall rating" value={`${teachers?.overallAverage || 0}/5`} icon="star" tone="amber"/><Mini label="Total responses" value={responses} icon="feedback"/><Mini label="Avg. participation" value={`${participation}%`} icon="chart" tone="green"/><Mini label="Course semesters" value={courses.length} icon="book" tone="pink"/></div><div className="analytics-grid"><article className="panel analytics-card"><div className="panel-title"><div><h2>Campaign participation</h2><p>Response rate against enrolled students</p></div><Icon name="campaign"/></div><div className="progress-list">{campaigns.length ? campaigns.slice(0,6).map(x => <div key={x._id}><div><b>{x.title}</b><span>{x.totalResponses} responses · {x.participationRate ?? 0}%</span></div><div className="progress"><i style={{width:`${Math.min(x.participationRate || 0,100)}%`}}/></div></div>) : <p className="muted-copy">No campaign data yet.</p>}</div></article><article className="panel analytics-card"><div className="panel-title"><div><h2>Top rated faculty</h2><p>Average across all campaigns</p></div><Icon name="users"/></div><div className="rank-list">{teachers?.topRated?.length ? teachers.topRated.slice(0,5).map((x,i) => <div key={x.teacherId}><strong>{i+1}</strong><span className="avatar">{initials(x.name)}</span><div><b>{x.name}</b><small>{x.department} · {x.totalResponses} reviews</small></div><em><Icon name="star" size={14}/>{x.averageRating}</em></div>) : <p className="muted-copy">No faculty ratings yet.</p>}</div></article></div><article className="panel resource-panel analytics-table"><div className="panel-title"><div><h2>Course performance</h2><p>Ratings grouped by course and semester</p></div></div><div className="table-scroll"><table><thead><tr><th>Course</th><th>Semester</th><th>Average rating</th><th>Rating volume</th></tr></thead><tbody>{courses.map(x => <tr key={`${x.courseId}-${x.semester}`}><td><b>{x.course}</b></td><td>Semester {x.semester}</td><td><span className="rating-value"><Icon name="star" size={14}/>{x.averageRating}</span></td><td><div className="volume-bar"><i style={{width:`${Math.min(x.responses,100)}%`}}/><span>{x.responses}</span></div></td></tr>)}</tbody></table></div></article></>}</>;
}
