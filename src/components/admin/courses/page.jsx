"use client";

import { courses as initialCourses } from "@/constant";
import { useState } from "react";
import Courses from ".";

export default function CoursesPage() {
  const [courses, setCourses] = useState(initialCourses);
  return <Courses courses={courses} setCourses={setCourses} />;
}
