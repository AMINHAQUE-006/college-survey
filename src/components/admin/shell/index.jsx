"use client";

import { Icon } from "@/constant";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navigation = [
  { label: "Dashboard", icon: "chart", href: "/admin" },
  { label: "Courses", icon: "book", href: "/admin/courses" },
  { label: "Teachers", icon: "users", href: "/admin/teachers" },
  { label: "Subjects", icon: "building", href: "/admin/subjects" },
  { label: "Campaigns", icon: "campaign", href: "/admin/campaigns", badge: 3 },
  { label: "Question Bank", icon: "question", href: "/admin/question-bank" },
  { label: "Feedback", icon: "feedback", href: "/admin/feedback" },
  { label: "Analytics", icon: "chart", href: "/admin/analytics" },
  { label: "Settings", icon: "settings", href: "/admin/settings" },
];

export default function AdminShell({ children }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="admin-shell">
      <aside className={open ? "open" : ""}>
        <div className="brand">
          <span>
            <Icon name="cap" size={25} />
          </span>

          <div>
            <b>CampusVoice</b>
            <small>ADMIN PORTAL</small>
          </div>

          <button className="side-close" onClick={() => setOpen(false)}>
            <Icon name="close" />
          </button>
        </div>

        <nav>
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={pathname === item.href ? "active" : ""}
              onClick={() => setOpen(false)}
            >
              <Icon name={item.icon} />
              <span>{item.label}</span>

              {item.badge && <em>{item.badge}</em>}
            </Link>
          ))}
        </nav>

        <div className="side-bottom">
          <Link href="/">
            <Icon name="shield" />
            <span>Student Portal</span>
          </Link>

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

      {open && <div className="side-scrim" onClick={() => setOpen(false)} />}

      <main className="admin-main">
        {/* Mobile Header */}
        <div className="mobile-top">
          <button onClick={() => setOpen(true)}>
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

        <div className="admin-content">{children}</div>
      </main>
    </div>
  );
}
