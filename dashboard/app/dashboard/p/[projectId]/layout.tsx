import { redirect } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { getSessionUser } from "@/lib/session";
import { getProject } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function ProjectLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { projectId: string };
}) {
  const user = await getSessionUser();
  if (!user) redirect("/dashboard/login");
  const project = await getProject(user.id, params.projectId);
  if (!project) redirect("/dashboard/connect");

  return (
    <div className="flex min-h-screen bg-paper">
      <Sidebar projectId={project.id} status={project.status} userName={user.name} />
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
