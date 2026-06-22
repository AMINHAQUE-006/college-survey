"use client";

import { Icon } from "@/constant";
import { listResource } from "@/lib/client-api";
import { useCallback, useEffect, useState } from "react";

const fmt = (iso) =>
  iso
    ? new Date(iso).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "—";

const avg = (ratings = []) =>
  ratings.length === 0
    ? null
    : (ratings.reduce((s, r) => s + r.rating, 0) / ratings.length).toFixed(1);

const StarBar = ({ value }) => {
  const pct = ((Number(value) / 5) * 100).toFixed(0);
  return (
    <div className="star-bar">
      <div className="star-fill" style={{ width: `${pct}%` }} />
    </div>
  );
};

export default function Feedback() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);

  const load = useCallback(async () => {
    try {
      const data = await listResource("feedback");
      setItems(data.items);
      setError("");
    } catch (e) {
      setError(e.message);
    }
  }, []);

  useEffect(() => {
    Promise.resolve().then(load);
  }, [load]);

  return (
    <>
      <header className="content-head">
        <div>
          <p className="eyebrow">RESPONSES</p>
          <h1>Feedback</h1>
          <p>{items.length} anonymous submissions collected.</p>
        </div>
      </header>

      {error && <p className="error">{error}</p>}

      {items.length === 0 ? (
        <div className="empty-state panel">
          <p>No feedback submissions yet.</p>
        </div>
      ) : (
        <div className="panel feedback-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Campaign</th>
                <th>Course</th>
                <th>Semester</th>
                <th>Teachers rated</th>
                <th>Submitted</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((fb) => (
                <tr key={fb._id}>
                  <td>{fb.campaignId?.title ?? "—"}</td>
                  <td>{fb.courseId?.name ?? "—"}</td>
                  <td>
                    <span className="semester-badge">Sem {fb.semester}</span>
                  </td>
                  <td className="center-cell">
                    {fb.teacherFeedback?.length ?? 0}
                  </td>
                  <td className="muted-cell">{fmt(fb.createdAt)}</td>
                  <td>
                    <button
                      className="text-btn"
                      onClick={() => setSelected(fb)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail drawer */}
      {selected && (
        <div className="modal-backdrop" onMouseDown={() => setSelected(null)}>
          <div
            className="modal modal-wide feedback-detail"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="modal-head">
              <div>
                <h2>Submission detail</h2>
                <p>{fmt(selected.createdAt)}</p>
              </div>
              <button type="button" onClick={() => setSelected(null)}>
                <Icon name="close" />
              </button>
            </div>

            <div className="detail-meta">
              <div className="detail-meta-item">
                <span className="detail-label">Campaign</span>
                <span>{selected.campaignId?.title ?? "—"}</span>
              </div>
              <div className="detail-meta-item">
                <span className="detail-label">Course</span>
                <span>{selected.courseId?.name ?? "—"}</span>
              </div>
              <div className="detail-meta-item">
                <span className="detail-label">Semester</span>
                <span>Semester {selected.semester}</span>
              </div>
            </div>

            {(selected.teacherFeedback || []).map((tf, i) => {
              const score = avg(tf.ratings);
              return (
                <div key={i} className="teacher-block">
                  <div className="teacher-block-head">
                    <div>
                      <p className="tb-name">
                        {tf.teacherId?.name ?? "Teacher"}
                      </p>
                      <p className="tb-sub">
                        {tf.subjectId?.name ?? "Subject"}
                      </p>
                    </div>
                    {score && (
                      <div className="score-badge">
                        <Icon name="star" size={13} />
                        {score}
                      </div>
                    )}
                  </div>
                  <div className="ratings-list">
                    {(tf.ratings || []).map((r, j) => (
                      <div key={j} className="rating-row">
                        <span className="rating-q">
                          {r.questionId?.question ?? `Q${j + 1}`}
                        </span>
                        <div className="rating-right">
                          <StarBar value={r.rating} />
                          <span className="rating-val">{r.rating}/5</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  {tf.comment && <p className="tf-comment">"{tf.comment}"</p>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <style jsx>{`
        .feedback-table-wrap {
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
          padding: 0.7rem 1rem;
          text-align: left;
          font-size: 0.72rem;
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
        .semester-badge {
          display: inline-block;
          padding: 0.2rem 0.55rem;
          border-radius: 999px;
          font-size: 0.78rem;
          font-weight: 600;
          background: var(--accent-light, rgba(99, 102, 241, 0.1));
          color: var(--accent, #6366f1);
        }
        .center-cell {
          text-align: center;
        }
        .muted-cell {
          color: var(--text-muted);
          font-size: 0.82rem;
        }
        .empty-state {
          text-align: center;
          padding: 3rem;
          color: var(--text-muted);
        }
        /* Detail modal */
        .modal-wide {
          max-width: 560px;
        }
        .feedback-detail {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          max-height: 85vh;
          overflow-y: auto;
        }
        .detail-meta {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.5rem;
          background: var(--surface-alt, rgba(99, 102, 241, 0.05));
          border-radius: var(--radius, 8px);
          padding: 0.75rem 1rem;
        }
        .detail-meta-item {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }
        .detail-label {
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: var(--text-muted);
        }
        .teacher-block {
          border: 1px solid var(--border);
          border-radius: var(--radius, 8px);
          padding: 0.875rem 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .teacher-block-head {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }
        .tb-name {
          font-weight: 600;
          font-size: 0.9rem;
          margin: 0;
        }
        .tb-sub {
          font-size: 0.8rem;
          color: var(--text-muted);
          margin: 0;
        }
        .score-badge {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--accent, #6366f1);
          background: var(--accent-light, rgba(99, 102, 241, 0.1));
          padding: 0.2rem 0.55rem;
          border-radius: 999px;
        }
        .ratings-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .rating-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.82rem;
        }
        .rating-q {
          flex: 1;
          color: var(--text-secondary);
          line-height: 1.4;
        }
        .rating-right {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-shrink: 0;
        }
        .star-bar {
          width: 80px;
          height: 6px;
          background: var(--border);
          border-radius: 999px;
          overflow: hidden;
        }
        .star-fill {
          height: 100%;
          background: var(--accent, #6366f1);
          border-radius: 999px;
        }
        .rating-val {
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--text-muted);
          min-width: 2rem;
        }
        .tf-comment {
          font-size: 0.85rem;
          color: var(--text-secondary);
          font-style: italic;
          border-left: 2px solid var(--accent, #6366f1);
          padding-left: 0.75rem;
          margin: 0;
        }
        @media (max-width: 640px) {
          .detail-meta {
            grid-template-columns: 1fr 1fr;
          }
          th:nth-child(4),
          td:nth-child(4) {
            display: none;
          }
        }
      `}</style>
    </>
  );
}
