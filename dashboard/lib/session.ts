import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { DEMO_MODE } from "./config";

export interface SessionUser {
  id: string;
  name: string;
  login?: string;
  image?: string;
  demo?: boolean;
}

/**
 * The signed-in user, or a stand-in demo user when the app is running without
 * GitHub OAuth configured. Never returns null in demo mode so the dashboard is
 * always browsable; in production, pages redirect to /login when this is null.
 */
export async function getSessionUser(): Promise<SessionUser | null> {
  if (DEMO_MODE) {
    return { id: "demo", name: "Demo User", login: "demo", demo: true };
  }
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;
  const u = session.user as { id?: string; name?: string; login?: string; image?: string };
  return {
    id: u.id ?? "user",
    name: u.name ?? "You",
    login: u.login,
    image: u.image
  };
}
