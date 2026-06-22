"use client";

import { Icon } from "@/constant";
import { api } from "@/lib/client-api";
import Link from "next/link";
import { useEffect, useState } from "react";
import Stat from "./stat";
import TrendChart from "./trend-chart";

const initials=(name="")=>name.split(/\s+/).map(x=>x[0]).join("").slice(0,2).toUpperCase();
export default function Dashboard() {
  const [data,setData]=useState(null); const [teachers,setTeachers]=useState([]); const [error,setError]=useState("");
  useEffect(()=>{ Promise.all([api("/api/analytics/dashboard"),api("/api/analytics/teachers")]).then(([d,t])=>{setData(d);setTeachers(t.topRated);}).catch(e=>setError(e.message)); },[]);
  const d=data||{totalFeedback:0,activeCampaigns:0,totalTeachers:0,totalCourses:0,feedbackTrend:[]};
  return <><header className="content-head"><div><p className="eyebrow">OVERVIEW</p><h1>Admin dashboard</h1><p>Live feedback activity across your college.</p></div><Link className="primary" href="/admin/campaigns"><Icon name="plus" size={18}/> New campaign</Link></header>{error&&<p className="error">{error}</p>}
  <section className="stats-grid"><Stat icon="feedback" label="Total feedback" value={d.totalFeedback.toLocaleString()} delta="Live" tone="blue"/><Stat icon="campaign" label="Active campaigns" value={d.activeCampaigns} delta="Live" tone="pink"/><Stat icon="users" label="Total teachers" value={d.totalTeachers} delta="Active" tone="green"/><Stat icon="book" label="Total courses" value={d.totalCourses} delta="Active" tone="amber"/></section>
  <section className="dashboard-grid"><article className="panel chart-panel"><div className="panel-head"><div><h2>Feedback trend</h2><p>Recent submissions</p></div></div><TrendChart data={d.feedbackTrend}/></article><article className="panel"><div className="panel-head"><div><h2>Top rated teachers</h2><p>Based on submitted feedback</p></div></div><div className="teacher-list">{teachers.slice(0,5).map((t,i)=><div className="teacher-row" key={t.teacherId}><span className="rank">{i+1}</span><span className={`avatar a${i%4}`}>{initials(t.name)}</span><div><b>{t.name}</b><small>{t.department}</small></div><div className="teacher-score"><Icon name="star" size={16}/><b>{t.averageRating}</b><small>{t.totalResponses} reviews</small></div></div>)}</div></article></section></>;
}
