import GenericPage, { isAdminSection } from "@/components/admin/generic-page";
import { notFound } from "next/navigation";

export default async function Page({ params }) {
  const { section } = await params;
  if (!isAdminSection(section)) notFound();
  return <GenericPage section={section} />;
}
