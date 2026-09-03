export type IssueStatus = "healthy" | "watching" | "incident" | "critical";

export const STATUS_META: Record<
  IssueStatus,
  { label: string; color: string; tip: string }
> = {
  healthy: { label: "Healthy", color: "#0f7a3d", tip: "Healthy · all checks passing" },
  watching: { label: "Watching", color: "#c98a00", tip: "Watching · post-deploy window open" },
  incident: { label: "Incident", color: "#d97706", tip: "Incident · a regression is being handled" },
  critical: { label: "Critical", color: "#b42318", tip: "Critical · production is down" }
};

export type Severity = "minor" | "major" | "critical";
export type RecoveryMode = "observe" | "approval" | "guarded" | "auto";

export interface Project {
  id: string;
  name: string;
  productionUrl: string;
  status: IssueStatus;
  recoveryMode: RecoveryMode;
  liveDeploymentId: string;
  knownGoodId: string;
}

export interface TimelineEntry {
  at: string;
  label: string;
  tag?: string;
  tone?: "green" | "amber" | "red";
}

export interface Incident {
  id: string;
  kind: string;
  severity: Severity;
  status: string;
  confidence: number;
  suspectDeploymentId?: string;
  suspectCommit?: string;
  rollbackTargetId?: string;
  openedAt: string;
  closedAt?: string;
  action: string; // policy action
  timeline: TimelineEntry[];
  /** Set when a human decision is required. */
  needsApproval?: boolean;
}

export interface Deploy {
  id: string;
  commit: string;
  message: string;
  state: "ready" | "error" | "building";
  target: "production" | "preview";
  createdAt: string;
  knownGood: boolean;
}

export interface Alert {
  id: string;
  at: string;
  channel: "email" | "slack";
  subject: string;
  incidentId?: string;
}

export interface Overview {
  deploysWatched: number;
  incidentsContained: number;
  healthyToday: number; // percent
  versionsSaved: number;
  checksToday: number;
  lastCheckAt: string;
}
