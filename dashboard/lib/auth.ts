import type { NextAuthOptions } from "next-auth";
import type { OAuthConfig } from "next-auth/providers/oauth";
import { hasGitHubAuth } from "./config";

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
 * assertion broke the callback in this runtime). JWT sessions, no DB adapter —
 * the user's identity is their GitHub id carried in the token.
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
      return profile;
    }
  },
  profile(profile: GitHubProfile) {
    return {
      id: String(profile.id ?? profile.login ?? "user"),
      name: profile.name ?? profile.login ?? "You",
      email: profile.email ?? null,
      image: profile.avatar_url ?? null,
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
  pages: { signIn: "/dashboard/login" }
};
