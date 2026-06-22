import { Icon, teachers } from "@/constant";
import Stat from "./stat";
import TrendChart from "./trend-chart";

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

export default Dashboard;
