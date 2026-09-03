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
    <div className="min-h-screen bg-paper">
      <div className="mx-auto flex max-w-6xl gap-0 px-0 sm:px-6 sm:py-8">
        <Sidebar projectId={project.id} status={project.status} />
        <main className="min-w-0 flex-1 bg-paper p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
