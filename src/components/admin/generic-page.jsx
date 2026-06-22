import { Icon } from "@/constant";

const pageData = {
  subjects: [
    "ACADEMICS",
    "Subjects",
    "42",
    "Manage subject allocation, semester mapping and assigned faculty.",
    "building",
  ],
  campaigns: [
    "ENGAGEMENT",
    "Campaigns",
    "3 active",
    "Schedule and control anonymous feedback collection windows.",
    "campaign",
  ],
  "question-bank": [
    "CONTENT",
    "Question Bank",
    "36",
    "Organize reusable questions across infrastructure, academic and teacher categories.",
    "question",
  ],
  feedback: [
    "RESPONSES",
    "Feedback",
    "2,847",
    "Review ratings and suggestions without collecting student identity.",
    "feedback",
  ],
  analytics: [
    "INSIGHTS",
    "Analytics",
    "4.5",
    "Compare courses, semesters, departments and teacher performance.",
    "chart",
  ],
  settings: [
    "CONFIGURATION",
    "Settings",
    "Portal settings",
    "Configure college details, security and admin access.",
    "settings",
  ],
};

export function isAdminSection(section) {
  return Boolean(pageData[section]);
}

export default function GenericPage({ section }) {
  const [eyebrow, title, value, description, icon] = pageData[section];
  const canAdd = ["subjects", "campaigns", "question-bank"].includes(section);
  const categories = [
    ["Infrastructure", 4.2, "building", "blue"],
    ["Academic environment", 4.5, "book", "pink"],
    ["Teacher quality", 4.6, "users", "green"],
  ];
  return (
    <>
      <header className="content-head">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
        {canAdd && (
          <button className="primary">
            <Icon name="plus" size={18} /> Add{" "}
            {section === "campaigns" ? "campaign" : "item"}
          </button>
        )}
      </header>
      <article className="panel generic">
        <div className="generic-icon">
          <Icon name={icon} size={28} />
        </div>
        <h2>{value}</h2>
        <p>
          {title === "Analytics"
            ? "Overall feedback score"
            : `${title} in the system`}
        </p>
        <div className="category-grid">
          {categories.map(([label, score, itemIcon, tone]) => (
            <div key={label}>
              <span className={`stat-icon ${tone}`}>
                <Icon name={itemIcon} />
              </span>
              <div>
                <b>{label}</b>
                <small>{score} average score</small>
              </div>
            </div>
          ))}
        </div>
      </article>
    </>
  );
}
