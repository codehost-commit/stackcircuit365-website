# StackCircuit365 — site + hosted dashboard

One Next.js app that serves **both** the marketing site and the hosted control
panel for [StackCircuit365](https://www.npmjs.com/package/stackcircuit365):

| Path | What it is |
| --- | --- |
| `/` | The marketing site (home, about, legal, walkthroughs) |
| `/dashboard` | The hosted dashboard — sign in with GitHub, connect a project, review status/incidents/deploys/policy/alerts |
| `/api/...` | The agent API + auth callbacks |

So the live URLs are `stackcircuit.dev` and `stackcircuit.dev/dashboard/...`
— no separate subdomain.

**Relay model (safety-first):** the dashboard stores only non-secret metadata
(incidents, deploys, health, your alert email, and your decisions). It **never
holds your Vercel or GitHub tokens**. When you approve a rollback, the dashboard
records the decision and your self-hosted agent performs it. A breach of the
dashboard can never touch anyone's production.

## The one switch you care about: `SC_NOTIFY`

A single environment variable turns **all** outbound notifications (email +
Slack) on or off:

- `SC_NOTIFY=0` (default) — **silent.** Nothing is ever sent. The dashboard
  still works fully: GitHub sign-in, connecting projects, incidents, approvals.
  Use this while your mailbox isn't live yet.
- `SC_NOTIFY=1` — **active.** Configured channels send.

You can leave `SMTP_USER` / `SMTP_PASS` / `MAIL_FROM` blank while `SC_NOTIFY=0`.

## Run it locally (demo mode — zero setup)

With no environment variables set, the app runs in **demo mode**: auth is
bypassed and it serves the seed dataset, so you can browse the whole UI.

```bash
npm install
npm run dev        # → http://localhost:3000  (site)  ·  /dashboard  (control panel)
```

## Go live

1. **Database** — create a Postgres (Neon or Supabase). Set `DATABASE_URL`, then:
   ```bash
   npm run db:push      # creates the tables from prisma/schema.prisma
   ```
2. **GitHub OAuth app** — github.com → Settings → Developer settings → OAuth Apps → New.
   - Homepage URL: `https://stackcircuit.dev`
   - Authorization callback URL: `https://stackcircuit.dev/api/auth/callback/github`
   - Set `GITHUB_ID`, `GITHUB_SECRET`, `NEXTAUTH_URL=https://stackcircuit.dev`, and
     `NEXTAUTH_SECRET` (`openssl rand -base64 32`).
3. **Link signing** — set `LINK_SECRET` (`openssl rand -base64 32`).
4. **Notifications (optional, later)** — when your GoDaddy mailbox is live, set
   `SMTP_USER` / `SMTP_PASS` / `MAIL_FROM` and flip `SC_NOTIFY=1`.

As soon as `DATABASE_URL` **and** the GitHub OAuth vars are set, demo mode turns
off and real auth + data take over.

## Deploy to Vercel (stackcircuit.dev)

1. Push this app to its GitHub repo.
2. Import it at https://vercel.com/new. Build command `prisma generate && next build`
   is already in `package.json`.
3. Add all env vars from `.env.example` in the Vercel project settings.
4. Add the domain `stackcircuit.dev` (Vercel → Settings → Domains) and point DNS there.

## How the agent connects

Your StackCircuit365 agent (`stackcircuit365-serve`) pushes events and polls for
approvals. Point it at the **site origin** (the API lives at `/api`, not under
`/dashboard`):

```
SC_CLOUD_URL=https://stackcircuit.dev
SC_PROJECT_KEY=<the project key you created in the dashboard>
```

- Agent → `POST /api/agent/ingest`  (deploys, incidents, status; bearer = project key)
- Agent ← `GET /api/agent/actions`  (approved rollbacks to execute)
- Agent → `POST /api/agent/actions` (acknowledge execution)

## Pages

`/dashboard/p/[projectId]` home · `/status` · `/incidents` (+ detail) ·
`/deploys` · `/policy` · `/alerts`

## Security notes

- Sign-in is GitHub OAuth; sessions are JWT (no passwords stored).
- The project key is a machine credential. You paste it **once** into an
  authenticated form to claim a project — never into a URL. Only its SHA-256
  hash is stored.
- Email approval links are signed and expiring, and only *identify* an action;
  performing it still requires a signed-in session.
