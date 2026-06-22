import { Icon, teachers } from "@/constant";

export default function Teachers() {
  return <><header className="content-head"><div><p className="eyebrow">FACULTY</p><h1>Teachers</h1><p>Faculty profiles, subjects and performance at a glance.</p></div><button className="primary"><Icon name="plus" size={18} /> Add teacher</button></header><section className="teacher-cards">{teachers.map((teacher, index) => <article className="panel teacher-card" key={teacher.name}><div className="teacher-card-top"><span className={`avatar large a${index % 4}`}>{teacher.initials}</span><span className="status active">Active</span></div><h2>{teacher.name}</h2><p>{teacher.department}</p><div className="subject-pill">{teacher.subject}</div><div className="teacher-metrics"><div><Icon name="star" size={17} /><b>{teacher.rating}</b><span>Rating</span></div><div><b>{teacher.responses}</b><span>Responses</span></div></div></article>)}</section></>;
}
