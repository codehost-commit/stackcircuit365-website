import type {
  Project,
  Incident,
  Deploy,
  Alert,
  Overview
} from "./types";

/**
 * Demo dataset — mirrors the "minute after you ship" mockups so the dashboard
 * is fully browsable with zero setup (no database, no OAuth). Real data
 * replaces this once DATABASE_URL and the GitHub OAuth app are configured.
 */

export const DEMO_PROJECT: Project = {
  id: "prj_demo",
  name: "production // stackcircuit.dev",
  productionUrl: "https://stackcircuit.dev",
  status: "healthy",
  recoveryMode: "guarded",
  liveDeploymentId: "dpl_9f21c",
  knownGoodId: "dpl_9f21c"
};

export const DEMO_OVERVIEW: Overview = {
  deploysWatched: 14,
  incidentsContained: 3,
  healthyToday: 100,
  versionsSaved: 4,
  checksToday: 12,
  lastCheckAt: "20 seconds ago"
};

export const DEMO_INCIDENTS: Incident[] = [
  {
    id: "inc_7c33a",
    kind: "release regression",
    severity: "critical",
    status: "recovered",
    confidence: 0.93,
    suspectDeploymentId: "dpl_7c33a",
    suspectCommit: "a1b2c3d",
    rollbackTargetId: "dpl_9f21c",
    openedAt: "14:03:47",
    closedAt: "14:05:38",
    action: "auto_rollback",
    timeline: [
      { at: "14:03:47", label: "health 500 × 4 · p95 3.2s", tag: "DETECTED", tone: "red" },
      { at: "14:04:05", label: "attributed to dpl_7c33a", tag: "COMMIT A1B2C3D", tone: "amber" },
      { at: "14:04:12", label: "auto-rollback authorized", tag: "GUARDED", tone: "amber" },
      { at: "14:05:38", label: "rollback verified", tag: "DPL_9F21C", tone: "green" }
    ]
  },
  {
    id: "inc_5a10b",
    kind: "release regression",
    severity: "major",
    status: "recovered",
    confidence: 0.88,
    suspectDeploymentId: "dpl_5a10b",
    suspectCommit: "9ffee21",
    rollbackTargetId: "dpl_41c9e",
    openedAt: "Sep 1 · 09:22",
    closedAt: "Sep 1 · 09:25",
    action: "auto_rollback",
    timeline: [
      { at: "09:22:10", label: "error rate 41% over 5m", tag: "DETECTED", tone: "red" },
      { at: "09:22:44", label: "attributed to dpl_5a10b", tag: "COMMIT 9FFEE21", tone: "amber" },
      { at: "09:25:01", label: "rollback verified", tag: "DPL_41C9E", tone: "green" }
    ]
  },
  {
    id: "inc_2b77f",
    kind: "dependency outage",
    severity: "major",
    status: "needs_human",
    confidence: 0.34,
    suspectDeploymentId: undefined,
    suspectCommit: undefined,
    rollbackTargetId: "dpl_9f21c",
    openedAt: "Aug 28 · 17:41",
    action: "require_human",
    needsApproval: true,
    timeline: [
      { at: "17:41:02", label: "checkout failing · Stripe elevated errors", tag: "DEPENDENCY", tone: "amber" },
      { at: "17:41:20", label: "no recent deploy — not a code regression", tag: "HELD", tone: "amber" }
    ]
  }
];

export const DEMO_DEPLOYS: Deploy[] = [
  { id: "dpl_9f21c", commit: "a1b2c3d", message: "fix: cache-control header", state: "ready", target: "production", createdAt: "4m ago", knownGood: true },
  { id: "dpl_7c33a", commit: "a1b2c3d", message: "refactor: swap data fetching layer", state: "ready", target: "production", createdAt: "22m ago", knownGood: false },
  { id: "dpl_41c9e", commit: "77aa0b2", message: "feat: add pricing page", state: "ready", target: "production", createdAt: "3h ago", knownGood: true },
  { id: "dpl_18ee0", commit: "c0ffee1", message: "chore: bump deps", state: "error", target: "production", createdAt: "5h ago", knownGood: false },
  { id: "dpl_0a930", commit: "deadbee", message: "feat: dark mode", state: "ready", target: "production", createdAt: "1d ago", knownGood: true }
];

export const DEMO_ALERTS: Alert[] = [
  { id: "al_1", at: "14:03:52", channel: "email", subject: "CRITICAL incident: release regression on stackcircuit.dev", incidentId: "inc_7c33a" },
  { id: "al_2", at: "14:05:40", channel: "slack", subject: "Recovered: production restored (auto-rollback)", incidentId: "inc_7c33a" },
  { id: "al_3", at: "Sep 1 · 09:25", channel: "email", subject: "Recovered: production restored", incidentId: "inc_5a10b" },
  { id: "al_4", at: "Aug 28 · 17:41", channel: "email", subject: "Human review needed: probable dependency outage", incidentId: "inc_2b77f" }
];
