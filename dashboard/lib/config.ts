/** Central switches. The app runs fully in demo mode until these are set. */
export const hasDatabase = !!process.env.DATABASE_URL;
export const hasGitHubAuth = !!process.env.GITHUB_ID && !!process.env.GITHUB_SECRET;
export const hasSmtp = !!process.env.SMTP_USER && !!process.env.SMTP_PASS;

/** Demo mode: no DB and no OAuth → seed data, auth bypassed to a demo user. */
export const DEMO_MODE = !hasDatabase || !hasGitHubAuth;

/** Public base URL of this dashboard (used in email links). Lives under
 *  /dashboard on the main site. */
export const DASHBOARD_URL =
  process.env.DASHBOARD_URL ?? "https://stackcircuit.dev/dashboard";

/**
 * Master notifications switch. One variable turns ALL outbound notifications
 * (email + Slack) on or off, independent of whether SMTP/Slack are configured.
 *   SC_NOTIFY=0  (default) → silent: nothing is sent, ever. The dashboard still
 *                            works fully — sign-in, projects, incidents, approvals.
 *   SC_NOTIFY=1            → active: configured channels send.
 * Flip this to 1 once your mailbox is live.
 */
export const notificationsEnabled = process.env.SC_NOTIFY === "1";

/** Secret used to sign single-use email action links. */
export const LINK_SECRET =
  process.env.LINK_SECRET ?? "dev-only-insecure-link-secret-change-me";
