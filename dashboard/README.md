# StackCircuit365 Dashboard

The hosted control panel for [StackCircuit365](https://www.npmjs.com/package/stackcircuit365) —
**dashboard.stackcircuit.dev**. Sign in with GitHub, connect a project with the key your agent
prints, and review status, incidents, deploys, policy, and alerts. When a rollback needs your
approval, the email links you here.

**Relay model (safety-first):** the dashboard stores only non-secret metadata (incidents,
deploys, health, your alert email, and your decisions). It **never holds your Vercel or GitHub
tokens**. When you approve a rollback, the dashboard records the decision and your self-hosted
agent performs it. A breach of the dashboard can never touch anyone's production.

## Run it locally (demo mode — zero setup)

With no environment variables set, the app runs in **demo mode**: auth is bypassed and it
serves the seed dataset, so you can browse the whole UI immediately.

```bash
npm install
npm run dev        # → http://localhost:3000  (redirects to /p/prj_demo)
```

## Go live

1. **Database** — create a Postgres (Neon or Supabase). Set `DATABASE_URL`, then:
   ```bash
   npm run db:push      # creates the tables from prisma/schema.prisma
   ```
2. **GitHub OAuth app** — github.com → Settings → Developer settings → OAuth Apps → New.
   - Homepage: `https://dashboard.stackcircuit.dev`
   - Authorization callback URL: `https://dashboard.stackcircuit.dev/api/auth/callback/github`
   - Set `GITHUB_ID`, `GITHUB_SECRET`, `NEXTAUTH_URL`, and `NEXTAUTH_SECRET` (`openssl rand -base64 32`).
3. **Email (GoDaddy)** — set `SMTP_USER` / `SMTP_PASS` to your GoDaddy mailbox and `MAIL_FROM`.
4. **Link signing** — set `LINK_SECRET` (`openssl rand -base64 32`).

Copy `.env.example` → `.env` and fill these in. As soon as `DATABASE_URL` **and** the GitHub
OAuth vars are set, demo mode turns off and real auth + data take over.

## Deploy to Vercel (dashboard.stackcircuit.dev)

1. Push this folder to its own GitHub repo (e.g. `stackcircuit365-dashboard`).
2. Import it at https://vercel.com/new. The build command is `prisma generate && next build`
   (already in `package.json`).
3. Add all the env vars from `.env.example` in the Vercel project settings.
4. Add the domain `dashboard.stackcircuit.dev` (Vercel → Settings → Domains) and point the DNS
   `CNAME` there.

## How the agent connects

Your StackCircuit365 agent (`stackcircuit365-serve`) pushes events and polls for approvals:

```
SC_CLOUD_URL=https://dashboard.stackcircuit.dev
SC_PROJECT_KEY=<the project key you created in the dashboard>
```

- Agent → `POST /api/agent/ingest`  (deploys, incidents, status; bearer = project key)
- Agent ← `GET /api/agent/actions`  (approved rollbacks to execute)
- Agent → `POST /api/agent/actions` (acknowledge execution)

## Pages

`/p/[projectId]` home · `/status` · `/incidents` (+ detail) · `/deploys` · `/policy` · `/alerts`

## Security notes

- Sign-in is GitHub OAuth; sessions are JWT (no passwords stored).
- The project key is a machine credential. You paste it **once** into an authenticated form to
  claim a project — never into a URL. Only its SHA-256 hash is stored.
- Email approval links are signed and expiring, and only *identify* an action; performing it
  still requires a signed-in session.
