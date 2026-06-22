"use client";
import Navbar from "@/components/public/Navbar";
import { useMemo, useState } from "react";

const Icon = ({ name, size = 20 }) => {
  const paths = {
    cap: (
      <>
        <path d="m2 9 10-5 10 5-10 5L2 9Z" />
        <path d="M6 11.5V16c3 2.7 9 2.7 12 0v-4.5M22 9v6" />
      </>
    ),
    shield: (
      <>
        <path d="M12 3 4.5 6v5.6c0 4.6 3.2 7.9 7.5 9.4 4.3-1.5 7.5-4.8 7.5-9.4V6L12 3Z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
    chart: (
      <>
        <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
      </>
    ),
    users: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
    book: (
      <>
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V4H6.5A2.5 2.5 0 0 0 4 6.5v13Z" />
        <path d="M8 8h8M8 12h6" />
      </>
    ),
    building: (
      <>
        <path d="M3 21h18M6 21V7l6-4 6 4v14M9 10h.01M15 10h.01M9 14h.01M15 14h.01M10 21v-4h4v4" />
      </>
    ),
    campaign: (
      <>
        <path d="m3 11 14-5v12L3 13v-2Z" />
        <path d="M11.6 16.1 13 21H7l-1.6-6.9M20 10v4" />
      </>
    ),
    question: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M9.7 9a2.5 2.5 0 1 1 3.8 2.1c-.9.5-1.5 1-1.5 2M12 17h.01" />
      </>
    ),
    feedback: (
      <>
        <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z" />
        <path d="M8 9h8M8 13h5" />
      </>
    ),
    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3A1.7 1.7 0 0 0 10 3V2.8h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z" />
      </>
    ),
    logout: (
      <>
        <path d="M10 17l5-5-5-5M15 12H3M21 3v18" />
      </>
    ),
    arrow: (
      <>
        <path d="m9 18 6-6-6-6" />
      </>
    ),
    plus: (
      <>
        <path d="M12 5v14M5 12h14" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </>
    ),
    star: (
      <path d="m12 2.8 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-2.9L6.4 20l1.1-6.2L3 9.4l6.2-.9L12 2.8Z" />
    ),
    check: <path d="m5 12 4 4L19 6" />,
    close: <path d="m6 6 12 12M18 6 6 18" />,
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  };
  return (
    <svg
      className="icon"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {paths[name]}
    </svg>
  );
};

const coursesSeed = [
  {
    name: "Bachelor of Computer Applications",
    code: "BCA",
    semesters: 6,
    students: 420,
  },
  {
    name: "Master of Computer Applications",
    code: "MCA",
    semesters: 4,
    students: 188,
  },
  {
    name: "Bachelor of Business Administration",
    code: "BBA",
    semesters: 6,
    students: 356,
  },
  {
    name: "Master of Business Administration",
    code: "MBA",
    semesters: 4,
    students: 214,
  },
];

const teachers = [
  {
    name: "Dr. Ananya Sharma",
    initials: "AS",
    subject: "Database Management",
    department: "Computer Science",
    rating: 4.8,
    responses: 286,
  },
  {
    name: "Prof. Rahul Mehta",
    initials: "RM",
    subject: "Web Technologies",
    department: "Computer Science",
    rating: 4.6,
    responses: 264,
  },
  {
    name: "Dr. Priya Nair",
    initials: "PN",
    subject: "Business Statistics",
    department: "Management",
    rating: 4.5,
    responses: 219,
  },
  {
    name: "Prof. Arjun Kapoor",
    initials: "AK",
    subject: "Data Structures",
    department: "Computer Science",
    rating: 4.3,
    responses: 198,
  },
  {
    name: "Dr. Meera Iyer",
    initials: "MI",
    subject: "Organizational Behavior",
    department: "Management",
    rating: 4.2,
    responses: 176,
  },
];

const nav = [
  ["Dashboard", "chart"],
  ["Courses", "book"],
  ["Teachers", "users"],
  ["Subjects", "building"],
  ["Campaigns", "campaign"],
  ["Question Bank", "question"],
  ["Feedback", "feedback"],
  ["Analytics", "chart"],
  ["Settings", "settings"],
];

const Stat = ({ icon, label, value, delta, tone }) => (
  <article className="stat-card">
    <div className={`stat-icon ${tone}`}>
      <Icon name={icon} />
    </div>
    <div>
      <p>{label}</p>
      <h3>{value}</h3>
      <small>
        <b>↗ {delta}</b> vs last month
      </small>
    </div>
  </article>
);

const Rating = ({ value, onChange, compact = false }) => (
  <div
    className={`rating ${compact ? "compact" : ""}`}
    role="radiogroup"
    aria-label="Rating out of five"
  >
    {[1, 2, 3, 4, 5].map((n) => (
      <button
        key={n}
        type="button"
        onClick={() => onChange?.(n)}
        className={n <= value ? "filled" : ""}
        aria-label={`${n} stars`}
      >
        <Icon name="star" size={compact ? 15 : 25} />
      </button>
    ))}
  </div>
);

function Dashboard() {
  return (
    <>
      <header className="content-head">
        <div>
          <p className="eyebrow">OVERVIEW</p>
          <h1>
            Good morning, Admin <span>👋</span>
          </h1>
          <p>Here’s what’s happening with feedback across your college.</p>
        </div>
        <button className="primary">
          <Icon name="plus" size={18} /> New campaign
        </button>
      </header>
      <section className="stats-grid">
        <Stat
          icon="feedback"
          label="Total feedback"
          value="2,847"
          delta="12.4%"
          tone="blue"
        />
        <Stat
          icon="campaign"
          label="Active campaigns"
          value="3"
          delta="1 new"
          tone="pink"
        />
        <Stat
          icon="users"
          label="Total teachers"
          value="48"
          delta="4.2%"
          tone="green"
        />
        <Stat
          icon="book"
          label="Total courses"
          value="12"
          delta="2 new"
          tone="amber"
        />
      </section>
      <section className="dashboard-grid">
        <article className="panel chart-panel">
          <div className="panel-head">
            <div>
              <h2>Feedback trend</h2>
              <p>Submissions over the last 7 months</p>
            </div>
            <select>
              <option>Last 7 months</option>
            </select>
          </div>
          <TrendChart />
        </article>
        <article className="panel score-panel">
          <div className="panel-head">
            <div>
              <h2>Overall scores</h2>
              <p>Average across all feedback</p>
            </div>
          </div>
          {[
            ["Infrastructure", 4.2, "blue"],
            ["Academic", 4.5, "pink"],
            ["Teachers", 4.6, "green"],
          ].map(([n, v, c]) => (
            <div className="score-row" key={n}>
              <div>
                <span>{n}</span>
                <b>
                  {v}
                  <small>/5</small>
                </b>
              </div>
              <div className="bar">
                <i className={c} style={{ width: `${v * 20}%` }} />
              </div>
            </div>
          ))}
          <div className="overall">
            <div className="ring">
              <b>4.5</b>
              <span>out of 5</span>
            </div>
            <div>
              <strong>Excellent</strong>
              <p>Based on 2,847 responses</p>
            </div>
          </div>
        </article>
      </section>
      <section className="dashboard-grid lower">
        <article className="panel">
          <div className="panel-head">
            <div>
              <h2>Top rated teachers</h2>
              <p>Based on current campaign feedback</p>
            </div>
            <button className="text-btn">
              View all <Icon name="arrow" size={15} />
            </button>
          </div>
          <div className="teacher-list">
            {teachers.slice(0, 4).map((t, i) => (
              <div className="teacher-row" key={t.name}>
                <span className="rank">{i + 1}</span>
                <span className={`avatar a${i}`}>{t.initials}</span>
                <div>
                  <b>{t.name}</b>
                  <small>{t.subject}</small>
                </div>
                <div className="teacher-score">
                  <Icon name="star" size={16} />
                  <b>{t.rating}</b>
                  <small>{t.responses} reviews</small>
                </div>
              </div>
            ))}
          </div>
        </article>
        <article className="panel">
          <div className="panel-head">
            <div>
              <h2>Recent activity</h2>
              <p>Latest anonymous submissions</p>
            </div>
            <button className="text-btn">
              View all <Icon name="arrow" size={15} />
            </button>
          </div>
          <div className="activity-list">
            {[
              [
                "BCA • Semester 4",
                "Infrastructure & Teacher",
                "2 min ago",
                "blue",
              ],
              ["MBA • Semester 2", "Academic & Teacher", "18 min ago", "pink"],
              ["MCA • Semester 3", "Infrastructure", "42 min ago", "green"],
              ["BBA • Semester 6", "Complete feedback", "1 hr ago", "amber"],
            ].map((x) => (
              <div className="activity" key={x[2]}>
                <i className={x[3]} />
                <div>
                  <b>{x[0]}</b>
                  <small>{x[1]}</small>
                </div>
                <time>{x[2]}</time>
              </div>
            ))}
          </div>
        </article>
      </section>
    </>
  );
}

function TrendChart() {
  const points = "15,145 85,126 155,134 225,91 295,102 365,62 435,34";
  return (
    <div className="trend">
      <div className="ylabels">
        <span>600</span>
        <span>450</span>
        <span>300</span>
        <span>150</span>
        <span>0</span>
      </div>
      <svg viewBox="0 0 450 170" preserveAspectRatio="none">
        <defs>
          <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--primary)" stopOpacity=".2" />
            <stop offset="1" stopColor="var(--primary)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[25, 60, 95, 130, 165].map((y) => (
          <line key={y} x1="0" x2="450" y1={y} y2={y} className="gridline" />
        ))}
        <polygon points={`${points} 435,165 15,165`} fill="url(#fade)" />
        <polyline points={points} className="trendline" />
        {points.split(" ").map((p, i) => {
          const [x, y] = p.split(",");
          return <circle key={i} cx={x} cy={y} r="4" />;
        })}
      </svg>
      <div className="xlabels">
        {["Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((x) => (
          <span key={x}>{x}</span>
        ))}
      </div>
    </div>
  );
}

function Courses({ courses, setCourses }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    code: "",
    semesters: 6,
    students: 0,
  });
  const filtered = courses.filter((c) =>
    (c.name + c.code).toLowerCase().includes(query.toLowerCase()),
  );
  const add = (e) => {
    e.preventDefault();
    if (!form.name || !form.code) return;
    setCourses([
      ...courses,
      { ...form, semesters: +form.semesters, students: +form.students },
    ]);
    setOpen(false);
    setForm({ name: "", code: "", semesters: 6, students: 0 });
  };
  return (
    <>
      <header className="content-head">
        <div>
          <p className="eyebrow">ACADEMICS</p>
          <h1>Courses</h1>
          <p>Manage courses and semester structures.</p>
        </div>
        <button className="primary" onClick={() => setOpen(true)}>
          <Icon name="plus" size={18} /> Add course
        </button>
      </header>
      <article className="panel table-panel">
        <div className="table-tools">
          <div className="search">
            <Icon name="search" size={18} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search courses..."
            />
          </div>
          <span>{filtered.length} courses</span>
        </div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Course</th>
                <th>Code</th>
                <th>Semesters</th>
                <th>Students</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <tr key={c.code}>
                  <td>
                    <div className="course-cell">
                      <span className={`course-icon c${i % 4}`}>
                        <Icon name="book" size={18} />
                      </span>
                      <b>{c.name}</b>
                    </div>
                  </td>
                  <td>
                    <code>{c.code}</code>
                  </td>
                  <td>{c.semesters}</td>
                  <td>{c.students}</td>
                  <td>
                    <span className="status active">Active</span>
                  </td>
                  <td>
                    <button
                      className="dots"
                      onClick={() =>
                        setCourses(courses.filter((x) => x.code !== c.code))
                      }
                    >
                      •••
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
      {open && (
        <div className="modal-backdrop" onMouseDown={() => setOpen(false)}>
          <form
            className="modal"
            onSubmit={add}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="modal-head">
              <div>
                <h2>Add a course</h2>
                <p>Create a new academic programme.</p>
              </div>
              <button type="button" onClick={() => setOpen(false)}>
                <Icon name="close" />
              </button>
            </div>
            <label>
              Course name
              <input
                autoFocus
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Bachelor of Arts"
              />
            </label>
            <div className="form-row">
              <label>
                Course code
                <input
                  value={form.code}
                  onChange={(e) =>
                    setForm({ ...form, code: e.target.value.toUpperCase() })
                  }
                  placeholder="BA"
                />
              </label>
              <label>
                Total semesters
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={form.semesters}
                  onChange={(e) =>
                    setForm({ ...form, semesters: e.target.value })
                  }
                />
              </label>
            </div>
            <div className="modal-actions">
              <button
                type="button"
                className="secondary"
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>
              <button className="primary">Create course</button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

function Teachers() {
  return (
    <>
      <header className="content-head">
        <div>
          <p className="eyebrow">FACULTY</p>
          <h1>Teachers</h1>
          <p>Faculty profiles, subjects and performance at a glance.</p>
        </div>
        <button className="primary">
          <Icon name="plus" size={18} /> Add teacher
        </button>
      </header>
      <section className="teacher-cards">
        {teachers.map((t, i) => (
          <article className="panel teacher-card" key={t.name}>
            <div className="teacher-card-top">
              <span className={`avatar large a${i % 4}`}>{t.initials}</span>
              <span className="status active">Active</span>
            </div>
            <h2>{t.name}</h2>
            <p>{t.department}</p>
            <div className="subject-pill">{t.subject}</div>
            <div className="teacher-metrics">
              <div>
                <Icon name="star" size={17} />
                <b>{t.rating}</b>
                <span>Rating</span>
              </div>
              <div>
                <b>{t.responses}</b>
                <span>Responses</span>
              </div>
            </div>
          </article>
        ))}
      </section>
    </>
  );
}

function GenericPage({ name }) {
  const data = {
    Subjects: [
      "42",
      "Subjects mapped across courses",
      "Manage subject allocation, semester mapping and assigned faculty.",
    ],
    Campaigns: [
      "3 active",
      "Feedback campaigns",
      "Schedule and control anonymous feedback collection windows.",
    ],
    "Question Bank": [
      "36",
      "Dynamic questions",
      "Organize reusable questions across infrastructure, academic and teacher categories.",
    ],
    Feedback: [
      "2,847",
      "Anonymous responses",
      "Review ratings and suggestions without collecting student identity.",
    ],
    Analytics: [
      "4.5",
      "College analytics",
      "Compare courses, semesters, departments and teacher performance.",
    ],
    Settings: [
      "",
      "Portal settings",
      "Configure college details, security, Turnstile and admin access.",
    ],
  }[name];
  return (
    <>
      <header className="content-head">
        <div>
          <p className="eyebrow">MANAGEMENT</p>
          <h1>{data[1]}</h1>
          <p>{data[2]}</p>
        </div>
        {!["Analytics", "Settings", "Feedback"].includes(name) && (
          <button className="primary">
            <Icon name="plus" size={18} /> Add{" "}
            {name === "Campaigns" ? "campaign" : "item"}
          </button>
        )}
      </header>
      <article className="panel generic">
        <div className="generic-icon">
          <Icon
            name={nav.find((n) => n[0] === name)?.[1] || "chart"}
            size={28}
          />
        </div>
        <h2>{data[0]}</h2>
        <p>
          {name === "Analytics"
            ? "Overall feedback score"
            : `${name} in the system`}
        </p>
        <div className="category-grid">
          {["Infrastructure", "Academic environment", "Teacher quality"].map(
            (x, i) => (
              <div key={x}>
                <span className={`stat-icon ${["blue", "pink", "green"][i]}`}>
                  <Icon name={["building", "book", "users"][i]} />
                </span>
                <div>
                  <b>{x}</b>
                  <small>{[4.2, 4.5, 4.6][i]} average score</small>
                </div>
              </div>
            ),
          )}
        </div>
      </article>
    </>
  );
}

function Admin({ onPublic }) {
  const [active, setActive] = useState("Dashboard");
  const [mobile, setMobile] = useState(false);
  const [courses, setCourses] = useState(coursesSeed);
  return (
    <div className="admin-shell">
      <aside className={mobile ? "open" : ""}>
        <div className="brand">
          <span>
            <Icon name="cap" size={25} />
          </span>
          <div>
            <b>CampusVoice</b>
            <small>ADMIN PORTAL</small>
          </div>
          <button className="side-close" onClick={() => setMobile(false)}>
            <Icon name="close" />
          </button>
        </div>
        <nav>
          {nav.map(([n, i]) => (
            <button
              key={n}
              className={active === n ? "active" : ""}
              onClick={() => {
                setActive(n);
                setMobile(false);
              }}
            >
              <Icon name={i} />
              <span>{n}</span>
              {n === "Campaigns" && <em>3</em>}
            </button>
          ))}
        </nav>
        <div className="side-bottom">
          <button onClick={onPublic}>
            <Icon name="shield" />
            <span>Student portal</span>
          </button>
          <div className="admin-user">
            <span className="avatar">AD</span>
            <div>
              <b>Admin User</b>
              <small>Super Admin</small>
            </div>
            <button>
              <Icon name="logout" size={18} />
            </button>
          </div>
        </div>
      </aside>
      {mobile && (
        <div className="side-scrim" onClick={() => setMobile(false)} />
      )}
      <main className="admin-main">
        <div className="mobile-top">
          <button onClick={() => setMobile(true)}>
            <Icon name="menu" />
          </button>
          <div className="brand">
            <span>
              <Icon name="cap" />
            </span>
            <b>CampusVoice</b>
          </div>
          <span className="avatar">AD</span>
        </div>
        <div className="admin-content">
          {active === "Dashboard" ? (
            <Dashboard />
          ) : active === "Courses" ? (
            <Courses courses={courses} setCourses={setCourses} />
          ) : active === "Teachers" ? (
            <Teachers />
          ) : (
            <GenericPage name={active} />
          )}
        </div>
      </main>
    </div>
  );
}

const infraQuestions = [
  "Classroom facilities and learning environment",
  "Library resources and accessibility",
  "Computer lab equipment and availability",
  "Campus Wi-Fi reliability",
  "Cleanliness and maintenance",
];
const academicQuestions = [
  "Regularity of classes",
  "Quality of laboratory sessions",
  "Timetable management",
  "Syllabus completion on time",
];

function Survey({ course, semester, onDone, onBack }) {
  const [step, setStep] = useState(1);
  const [ratings, setRatings] = useState({});
  const [suggestion, setSuggestion] = useState("");
  const questions =
    step === 1
      ? infraQuestions
      : step === 2
        ? academicQuestions
        : [
            "Subject knowledge",
            "Communication skills",
            "Doubt solving",
            "Punctuality",
            "Student engagement",
            "Fair evaluation",
          ];
  const prefix = step === 1 ? "i" : step === 2 ? "a" : "t";
  const complete = questions.every((_, i) => ratings[prefix + i]);
  const title =
    step === 1
      ? "College infrastructure"
      : step === 2
        ? "Academic environment"
        : "Teacher feedback";
  return (
    <div className="public-page">
      <Navbar onAdmin={() => {}} />
      <main className="survey-wrap">
        <div className="survey-top">
          <button
            className="back"
            onClick={step === 1 ? onBack : () => setStep(step - 1)}
          >
            ← Back
          </button>
          <span>
            {course} · Semester {semester}
          </span>
        </div>
        <div className="stepper">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className={n <= step ? "on" : ""}>
              <i>{n < step ? <Icon name="check" size={14} /> : n}</i>
              <span>
                {
                  ["Infrastructure", "Academic", "Teachers", "Suggestions"][
                    n - 1
                  ]
                }
              </span>
            </div>
          ))}
        </div>
        <article className="survey-card">
          <p className="eyebrow">STEP {step} OF 4</p>
          <h1>{step === 4 ? "Anything else you’d like us to know?" : title}</h1>
          <p>
            {step === 4
              ? "Share an optional suggestion. Please avoid including personal information."
              : "Rate each area honestly from 1 (poor) to 5 (excellent)."}
          </p>
          {step < 4 ? (
            <div className="question-list">
              {questions.map((q, i) => (
                <div className="question" key={q}>
                  <div>
                    <b>{q}</b>
                    {step === 3 && (
                      <small>Dr. Ananya Sharma · Database Management</small>
                    )}
                  </div>
                  <Rating
                    value={ratings[prefix + i] || 0}
                    onChange={(v) =>
                      setRatings({ ...ratings, [prefix + i]: v })
                    }
                  />
                </div>
              ))}
            </div>
          ) : (
            <textarea
              value={suggestion}
              onChange={(e) => setSuggestion(e.target.value)}
              maxLength={1000}
              placeholder="Your suggestions can help improve the college experience..."
            />
          )}
          <div className="survey-actions">
            <span>
              {step < 4
                ? `${Object.keys(ratings).filter((k) => k.startsWith(prefix)).length} of ${questions.length} rated`
                : `${suggestion.length}/1000`}
            </span>
            <button
              className="primary"
              disabled={step < 4 && !complete}
              onClick={() => (step < 4 ? setStep(step + 1) : onDone())}
            >
              {step === 4 ? "Submit anonymous feedback" : "Continue"}{" "}
              <Icon name={step === 4 ? "check" : "arrow"} size={17} />
            </button>
          </div>
        </article>
        <p className="privacy-foot">
          <Icon name="shield" size={16} /> Your response cannot be linked back
          to you.
        </p>
      </main>
    </div>
  );
}

function PublicPortal({ onAdmin }) {
  const [course, setCourse] = useState("");
  const [semester, setSemester] = useState("");
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);
  const semesters = useMemo(
    () =>
      Array.from(
        { length: coursesSeed.find((c) => c.code === course)?.semesters || 0 },
        (_, i) => i + 1,
      ),
    [course],
  );
  if (done)
    return (
      <div className="public-page">
        <Navbar onAdmin={onAdmin} />
        <main className="success">
          <div className="success-mark">
            <Icon name="check" size={38} />
          </div>
          <p className="eyebrow">FEEDBACK SUBMITTED</p>
          <h1>Thank you for speaking up.</h1>
          <p>
            Your anonymous feedback has been recorded. It will help us build a
            better learning experience for everyone.
          </p>
          <div className="anon-chip">
            <Icon name="shield" />
            <div>
              <b>Your privacy is protected</b>
              <span>
                No name, email, roll number, or phone number was collected.
              </span>
            </div>
          </div>
          <button
            className="secondary"
            onClick={() => {
              setDone(false);
              setStarted(false);
              setCourse("");
              setSemester("");
            }}
          >
            Return to home
          </button>
        </main>
      </div>
    );
  if (started)
    return (
      <Survey
        course={course}
        semester={semester}
        onDone={() => setDone(true)}
        onBack={() => setStarted(false)}
      />
    );
  return (
    <div className="public-page">
      <Navbar onAdmin={onAdmin} />
      <main>
        <section className="hero">
          <div className="hero-copy">
            <span className="secure-pill">
              <Icon name="shield" size={16} /> 100% ANONYMOUS
            </span>
            <h1>
              Your voice shapes
              <br />
              <em>a better campus.</em>
            </h1>
            <p>
              Share honest feedback about your teachers and college facilities.
              It takes less than 5 minutes—and your identity is never collected.
            </p>
            <div className="trust-row">
              <span>✓ No name</span>
              <span>✓ No roll number</span>
              <span>✓ No email</span>
            </div>
          </div>
          <div className="start-card">
            <div className="card-head">
              <span className="step-number">1</span>
              <div>
                <h2>Start your feedback</h2>
                <p>Select your course and semester.</p>
              </div>
            </div>
            <label>
              Course
              <select
                value={course}
                onChange={(e) => {
                  setCourse(e.target.value);
                  setSemester("");
                }}
              >
                <option value="">Choose your course</option>
                {coursesSeed.map((c) => (
                  <option value={c.code} key={c.code}>
                    {c.code} — {c.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Semester
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                disabled={!course}
              >
                <option value="">Choose your semester</option>
                {semesters.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>
            <button
              className="primary full"
              disabled={!course || !semester}
              onClick={() => setStarted(true)}
            >
              Begin feedback <Icon name="arrow" size={18} />
            </button>
            <small className="lock">
              <Icon name="shield" size={15} /> Secure & anonymous
            </small>
          </div>
        </section>
        <section className="privacy-section">
          <div>
            <p className="eyebrow">YOUR PRIVACY MATTERS</p>
            <h2>
              Honest feedback needs
              <br />a safe space.
            </h2>
            <p>
              CampusVoice is designed from the ground up to protect your
              identity. We only use your response to improve the college
              experience.
            </p>
          </div>
          <div className="privacy-grid">
            {[
              [
                "shield",
                "No personal data",
                "We never ask for your name, email, roll number, or phone.",
              ],
              [
                "feedback",
                "Genuinely anonymous",
                "Your responses are grouped with others and cannot identify you.",
              ],
              [
                "check",
                "One fair response",
                "A privacy-safe device check prevents duplicate submissions.",
              ],
              [
                "chart",
                "Real improvements",
                "College leadership sees trends and insights—not identities.",
              ],
            ].map((x) => (
              <article key={x[1]}>
                <span>
                  <Icon name={x[0]} />
                </span>
                <div>
                  <h3>{x[1]}</h3>
                  <p>{x[2]}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
      <footer>
        © 2026 CampusVoice · Anonymous College Feedback System{" "}
        <span>Privacy by design</span>
      </footer>
    </div>
  );
}

export default function Home() {
  const [mode, setMode] = useState("public");
  return mode === "public" ? (
    <PublicPortal onAdmin={() => setMode("admin")} />
  ) : (
    <Admin onPublic={() => setMode("public")} />
  );
}
