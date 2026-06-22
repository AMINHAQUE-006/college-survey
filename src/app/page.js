"use client";

import { Icon } from "@/constant";
import { api, listResource } from "@/lib/client-api";
import Navbar from "@/components/public/navbar";
import { useEffect, useMemo, useState } from "react";

const Rating = ({ value, onChange }) => (
  <div className="rating" role="radiogroup" aria-label="Rating out of five">
    {[1, 2, 3, 4, 5].map((n) => (
      <button
        key={n}
        type="button"
        onClick={() => onChange(n)}
        className={n <= value ? "filled" : ""}
        aria-label={`${n} stars`}
      >
        <Icon name="star" size={25} />
      </button>
    ))}
  </div>
);
const fingerprint = () => {
  let id = localStorage.getItem("campusvoice-device");
  if (!id) {
    id = `${crypto.randomUUID()}-${crypto.randomUUID()}`;
    localStorage.setItem("campusvoice-device", id);
  }
  return id;
};

export default function Home() {
  const [courses, setCourses] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [courseId, setCourseId] = useState("");
  const [semester, setSemester] = useState("");
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    Promise.all([
      listResource("courses", "isActive=true"),
      listResource("campaigns", "isActive=true"),
    ])
      .then(([c, p]) => {
        setCourses(c.items);
        setCampaigns(p.items);
      })
      .catch((e) => setError(e.message));
  }, []);
  const course = courses.find((x) => x._id === courseId);
  const campaign = campaigns.find(
    (x) =>
      x.courseIds.some((c) => (c._id || c) === courseId) &&
      new Date(x.startDate) <= new Date() &&
      new Date(x.endDate) >= new Date(),
  );
  if (done)
    return (
      <Success
        onReset={() => {
          setDone(false);
          setStarted(false);
          setCourseId("");
          setSemester("");
        }}
      />
    );
  if (started)
    return (
      <Survey
        course={course}
        campaign={campaign}
        semester={Number(semester)}
        onBack={() => setStarted(false)}
        onDone={() => setDone(true)}
      />
    );
  return (
    <div className="public-page">
      <Navbar onAdmin />
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
              Your identity is never collected.
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
            {error && <p className="error">{error}</p>}
            <label>
              Course
              <select
                value={courseId}
                onChange={(e) => {
                  setCourseId(e.target.value);
                  setSemester("");
                }}
              >
                <option value="">Choose your course</option>
                {courses.map((c) => (
                  <option value={c._id} key={c._id}>
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
                {Array.from(
                  { length: course?.totalSemesters || 0 },
                  (_, i) => i + 1,
                ).map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>
            {courseId && !campaign && (
              <p className="error">
                No active feedback campaign is available for this course.
              </p>
            )}
            <button
              className="primary full"
              disabled={!campaign || !semester}
              onClick={() => setStarted(true)}
            >
              Begin feedback <Icon name="arrow" size={18} />
            </button>
            <small className="lock">
              <Icon name="shield" size={15} /> Secure & anonymous
            </small>
          </div>
        </section>
        <Privacy />
      </main>
      <footer>
        © 2026 CampusVoice · Anonymous College Feedback System{" "}
        <span>Privacy by design</span>
      </footer>
    </div>
  );
}

function Survey({ course, campaign, semester, onBack, onDone }) {
  const [step, setStep] = useState(1);
  const [questions, setQuestions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [ratings, setRatings] = useState({});
  const [collegeSuggestion, setCollegeSuggestion] = useState("");
  const [additionalSuggestion, setAdditionalSuggestion] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  useEffect(() => {
    Promise.all([
      listResource("questions", "isActive=true"),
      listResource(
        "subjects",
        `courseId=${course._id}&semester=${semester}&isActive=true`,
      ),
    ])
      .then(([q, s]) => {
        setQuestions(q.items);
        setSubjects(s.items);
      })
      .catch((e) => setError(e.message));
  }, [course._id, semester]);
  const category =
    step === 1 ? "infrastructure" : step === 2 ? "academic" : "teacher";
  const current = questions
    .filter((q) => q.category === category)
    .sort((a, b) => a.sortOrder - b.sortOrder);
  const keys =
    step === 3
      ? subjects.flatMap((s) => current.map((q) => `t:${s._id}:${q._id}`))
      : current.map((q) => `${category}:${q._id}`);
  const complete = keys.length > 0 && keys.every((k) => ratings[k]);
  const submit = async () => {
    setSubmitting(true);
    setError("");
    try {
      const mapCategory = (cat) =>
        questions
          .filter((q) => q.category === cat)
          .map((q) => ({
            questionId: q._id,
            rating: ratings[`${cat}:${q._id}`],
          }));
      const teacherFeedback = subjects.map((s) => ({
        teacherId: s.teacherId._id,
        subjectId: s._id,
        ratings: current.map((q) => ({
          questionId: q._id,
          rating: ratings[`t:${s._id}:${q._id}`],
        })),
      }));
      await api("/api/feedback", {
        method: "POST",
        body: JSON.stringify({
          campaignId: campaign._id,
          courseId: course._id,
          semester,
          infrastructure: mapCategory("infrastructure"),
          academic: mapCategory("academic"),
          teacherFeedback,
          collegeSuggestion,
          additionalSuggestion,
          fingerprint: fingerprint(),
        }),
      });
      onDone();
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <div className="public-page">
      <Navbar />
      <main className="survey-wrap">
        <div className="survey-top">
          <button
            className="back"
            onClick={step === 1 ? onBack : () => setStep(step - 1)}
          >
            ← Back
          </button>
          <span>
            {course.code} · Semester {semester}
          </span>
        </div>
        <div className="stepper">
          {["Infrastructure", "Academic", "Teachers", "Suggestions"].map(
            (x, i) => (
              <div key={x} className={i + 1 <= step ? "on" : ""}>
                <i>{i + 1 < step ? <Icon name="check" size={14} /> : i + 1}</i>
                <span>{x}</span>
              </div>
            ),
          )}
        </div>
        <article className="survey-card">
          <p className="eyebrow">STEP {step} OF 4</p>
          <h1>
            {
              [
                "College infrastructure",
                "Academic environment",
                "Teacher feedback",
                "Anything else you’d like us to know?",
              ][step - 1]
            }
          </h1>
          {error && <p className="error">{error}</p>}
          {step < 3 && (
            <QuestionList
              questions={current}
              ratings={ratings}
              setRatings={setRatings}
              prefix={`${category}:`}
            />
          )}{" "}
          {step === 3 &&
            subjects.map((s) => (
              <div key={s._id}>
                <h2>
                  {s.teacherId.name} · {s.name}
                </h2>
                <QuestionList
                  questions={current}
                  ratings={ratings}
                  setRatings={setRatings}
                  prefix={`t:${s._id}:`}
                />
              </div>
            ))}
          {step === 4 && (
            <>
              <label>
                College suggestion
                <textarea
                  value={collegeSuggestion}
                  onChange={(e) => setCollegeSuggestion(e.target.value)}
                  maxLength="2000"
                />
              </label>
              <label>
                Additional suggestion
                <textarea
                  value={additionalSuggestion}
                  onChange={(e) => setAdditionalSuggestion(e.target.value)}
                  maxLength="2000"
                />
              </label>
            </>
          )}
          <div className="survey-actions">
            <span>
              {step < 4
                ? `${keys.filter((k) => ratings[k]).length} of ${keys.length} rated`
                : "Suggestions are optional"}
            </span>
            <button
              className="primary"
              disabled={submitting || (step < 4 && !complete)}
              onClick={() => (step < 4 ? setStep(step + 1) : submit())}
            >
              {step === 4
                ? submitting
                  ? "Submitting…"
                  : "Submit anonymous feedback"
                : "Continue"}{" "}
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
function QuestionList({ questions, ratings, setRatings, prefix }) {
  return (
    <div className="question-list">
      {questions.map((q) => (
        <div className="question" key={q._id}>
          <div>
            <b>{q.question}</b>
          </div>
          <Rating
            value={ratings[prefix + q._id] || 0}
            onChange={(v) => setRatings({ ...ratings, [prefix + q._id]: v })}
          />
        </div>
      ))}
    </div>
  );
}
function Success({ onReset }) {
  return (
    <div className="public-page">
      <Navbar onAdmin />
      <main className="success">
        <div className="success-mark">
          <Icon name="check" size={38} />
        </div>
        <p className="eyebrow">FEEDBACK SUBMITTED</p>
        <h1>Thank you for speaking up.</h1>
        <p>Your anonymous feedback has been recorded.</p>
        <button className="secondary" onClick={onReset}>
          Return to home
        </button>
      </main>
    </div>
  );
}
function Privacy() {
  return (
    <section className="privacy-section">
      <div>
        <p className="eyebrow">YOUR PRIVACY MATTERS</p>
        <h2>
          Honest feedback needs
          <br />a safe space.
        </h2>
        <p>
          CampusVoice protects your identity and only uses responses to improve
          the college experience.
        </p>
      </div>
      <div className="privacy-grid">
        {[
          [
            "shield",
            "No personal data",
            "We never ask for identifying details.",
          ],
          [
            "feedback",
            "Genuinely anonymous",
            "Responses are grouped with others.",
          ],
          [
            "check",
            "One fair response",
            "A privacy-safe device check prevents duplicates.",
          ],
          [
            "chart",
            "Real improvements",
            "Leadership sees trends, not identities.",
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
  );
}
