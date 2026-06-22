import { Icon } from "@/constant";
import { useState } from "react";

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

export default Courses;
