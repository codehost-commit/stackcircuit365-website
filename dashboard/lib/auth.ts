import type { NextAuthOptions } from "next-auth";
import type { OAuthConfig } from "next-auth/providers/oauth";
import { hasGitHubAuth } from "./config";
import { saveDbg } from "./authDebug";

const clientId = (process.env.GITHUB_ID ?? "").trim();
const clientSecret = (process.env.GITHUB_SECRET ?? "").trim();
const callbackUrl =
  (process.env.NEXTAUTH_URL ?? "").replace(/\/+$/, "") + "/api/auth/callback/github";

interface GitHubProfile {
  id?: number;
  login?: string;
  name?: string;
  email?: string | null;
  avatar_url?: string;
}

/**
 * GitHub OAuth done with plain HTTP for the token exchange and profile fetch,
 * bypassing openid-client (whose "issuer must be configured on the issuer"
 * assertion was breaking the callback). JWT sessions, no DB adapter.
 */
const githubProvider = {
  id: "github",
  name: "GitHub",
  type: "oauth",
  clientId,
  clientSecret,
  authorization: {
    url: "https://github.com/login/oauth/authorize",
    params: { scope: "read:user user:email" }
  },
  token: {
    url: "https://github.com/login/oauth/access_token",
    // Exchange the code for a token ourselves.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async request(context: any) {
      const code: string = context?.params?.code ?? "";
      const body = new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: callbackUrl
      });
      const res = await fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        headers: {
          "content-type": "application/x-www-form-urlencoded",
          accept: "application/json"
        },
        body
      });
      const tokens = (await res.json()) as Record<string, unknown>;
      await saveDbg({
        step: "token",
        status: res.status,
        hasAccessToken: Boolean(tokens.access_token),
        error: tokens.error,
        error_description: tokens.error_description
      });
      return { tokens };
    }
  },
  userinfo: {
    url: "https://api.github.com/user",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async request(context: any) {
      const tokens: { access_token?: string } = context?.tokens ?? {};
      const res = await fetch("https://api.github.com/user", {
        headers: {
          authorization: `Bearer ${tokens.access_token ?? ""}`,
          "user-agent": "stackcircuit365",
          accept: "application/vnd.github+json"
        }
      });
      const profile = (await res.json()) as GitHubProfile;
      // GitHub may hide the primary email on the profile; fetch it if missing.
      if (!profile.email && tokens.access_token) {
        try {
          const eRes = await fetch("https://api.github.com/user/emails", {
            headers: {
              authorization: `Bearer ${tokens.access_token}`,
              "user-agent": "stackcircuit365",
              accept: "application/vnd.github+json"
            }
          });
          const emails = (await eRes.json()) as Array<{ email: string; primary: boolean; verified: boolean }>;
          const primary = Array.isArray(emails)
            ? emails.find((e) => e.primary && e.verified) ?? emails.find((e) => e.verified)
            : undefined;
          if (primary) profile.email = primary.email;
        } catch {
          /* email is optional */
        }
      }
      await saveDbg({ step: "userinfo", status: res.status, login: profile.login, id: profile.id });
      return profile;
    }
  },
  profile(profile: GitHubProfile) {
    return {
      id: String(profile.id ?? profile.login ?? "user"),
      name: profile.name ?? profile.login ?? "You",
      email: profile.email ?? null,
      image: profile.avatar_url ?? null,
      // carried into the token via the jwt callback
      login: profile.login
    } as { id: string; name: string; email: string | null; image: string | null; login?: string };
  }
};

export const authOptions: NextAuthOptions = {
  providers: hasGitHubAuth
    ? [githubProvider as unknown as OAuthConfig<GitHubProfile>]
    : [],
  session: { strategy: "jwt" },
  secret: (process.env.NEXTAUTH_SECRET ?? "dev-only-insecure-secret").trim(),
  callbacks: {
    async jwt({ token, profile }) {
      const p = profile as GitHubProfile | undefined;
      if (p && p.id != null) {
        token.ghId = String(p.id);
        token.ghLogin = p.login;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id =
          (token.ghId as string) ?? token.sub ?? "user";
        (session.user as { login?: string }).login = token.ghLogin as string;
      }
      return session;
    }
  },
  logger: {
    async error(code, meta) {
      try {
        const anyMeta = meta as unknown as {
          error?: { name?: string; message?: string; stack?: string };
          message?: string;
          providerId?: string;
        };
        const err = anyMeta?.error ?? (anyMeta as { name?: string; message?: string; stack?: string });
        await saveDbg({
          step: "logger.error",
          code: String(code),
          name: err?.name,
          message: err?.message ?? anyMeta?.message,
          stack: (err?.stack ?? "").split("\n").slice(0, 10).join(" | ")
        });
      } catch {
        /* ignore */
      }
    },
    warn() {
      /* silence */
    },
    debug() {
      /* silence */
    }
  },
  pages: { signIn: "/dashboard/login" }
};
