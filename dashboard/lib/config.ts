/** Central switches. The app runs fully in demo mode until these are set. */
export const hasDatabase = !!process.env.DATABASE_URL;
export const hasGitHubAuth = !!process.env.GITHUB_ID && !!process.env.GITHUB_SECRET;
export const hasSmtp = !!process.env.SMTP_USER && !!process.env.SMTP_PASS;

/** Demo mode: no DB and no OAuth → seed data, auth bypassed to a demo user. */
export const DEMO_MODE = !hasDatabase || !hasGitHubAuth;

/** Public base URL of this dashboard (used in email links). */
export const DASHBOARD_URL =
  process.env.DASHBOARD_URL ?? "https://dashboard.stackcircuit.dev";

/** Secret used to sign single-use email action links. */
export const LINK_SECRET =
  process.env.LINK_SECRET ?? "dev-only-insecure-link-secret-change-me";
