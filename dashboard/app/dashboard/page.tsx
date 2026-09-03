import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { listProjects } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function Index() {
  const user = await getSessionUser();
  if (!user) redirect("/dashboard/login");
  const projects = await listProjects(user.id);
  if (projects.length === 0) redirect("/dashboard/connect");
  redirect(`/dashboard/p/${projects[0].id}`);
}
