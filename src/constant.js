export const Icon = ({ name, size = 20 }) => {
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

export const teachers = [
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

export const courses = [
  { name: "Bachelor of Computer Applications", code: "BCA", semesters: 6, students: 420 },
  { name: "Master of Computer Applications", code: "MCA", semesters: 4, students: 188 },
  { name: "Bachelor of Business Administration", code: "BBA", semesters: 6, students: 356 },
  { name: "Master of Business Administration", code: "MBA", semesters: 4, students: 214 },
];
