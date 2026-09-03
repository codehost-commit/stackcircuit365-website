import nodemailer from "nodemailer";
import { hasSmtp, notificationsEnabled, DASHBOARD_URL } from "./config";
import { signAction } from "./tokens";

/**
 * Email via GoDaddy SMTP (smtpout.secureserver.net). Configure SMTP_USER /
 * SMTP_PASS with your GoDaddy mailbox. In demo mode (no SMTP) this logs instead
 * of sending, so the flow is testable without credentials.
 */
function transport() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST ?? "smtpout.secureserver.net",
    port: Number(process.env.SMTP_PORT ?? 465),
    secure: true,
    auth: { user: process.env.SMTP_USER!, pass: process.env.SMTP_PASS! }
  });
}

const FROM = process.env.MAIL_FROM ?? "StackCircuit365 <alerts@stackcircuit.dev>";

export async function sendMail(to: string, subject: string, text: string, html?: string) {
  // Master switch (SC_NOTIFY): when off, never send — nothing leaves the app.
  if (!notificationsEnabled) {
    // eslint-disable-next-line no-console
    console.log(`[email:off SC_NOTIFY=0] would send to=${to} subject=${subject}`);
    return;
  }
  if (!hasSmtp) {
    // eslint-disable-next-line no-console
    console.log(`[email:demo] to=${to} subject=${subject}\n${text}`);
    return;
  }
  await transport().sendMail({ from: FROM, to, subject, text, html });
}

/** An incident alert that deep-links into the dashboard (approve requires login). */
export async function sendIncidentAlert(opts: {
  to: string;
  projectId: string;
  incidentId: string;
  subject: string;
  summary: string;
  needsApproval: boolean;
}) {
  const view = `${DASHBOARD_URL}/p/${opts.projectId}/incidents/${opts.incidentId}`;
  let cta = `View the incident:\n${view}`;
  if (opts.needsApproval) {
    const token = signAction({
      projectId: opts.projectId,
      incidentId: opts.incidentId,
      action: "approve_rollback"
    });
    const approve = `${view}?t=${token}`;
    cta = `Review and approve the rollback (you'll be asked to sign in):\n${approve}`;
  }
  const text = `${opts.summary}\n\n${cta}\n\n— StackCircuit365`;
  await sendMail(opts.to, opts.subject, text);
}
