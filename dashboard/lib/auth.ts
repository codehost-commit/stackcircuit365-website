import type { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { hasGitHubAuth } from "./config";
import { recordAuthError } from "./authDebug";

/**
 * GitHub sign-in with JWT sessions (no DB adapter needed for auth — user
 * identity is the GitHub id carried in the token). Projects are owned by that
 * id in the application database.
 */
export const authOptions: NextAuthOptions = {
  providers: hasGitHubAuth
    ? [
        GitHubProvider({
          clientId: (process.env.GITHUB_ID ?? "").trim(),
          clientSecret: (process.env.GITHUB_SECRET ?? "").trim(),
          // openid-client asserts an issuer during the callback; GitHub's OAuth
          // (non-OIDC) config leaves it unset, which throws "issuer must be
          // configured on the issuer". Set it explicitly to GitHub's host.
          issuer: "https://github.com"
        })
      ]
    : [],
  session: { strategy: "jwt" },
  secret: (process.env.NEXTAUTH_SECRET ?? "dev-only-insecure-secret").trim(),
  debug: true,
  logger: {
    error(code, meta) {
      // Print the real reason + call site on ONE grep-able JSON line (SCAUTHERR).
      try {
        const anyMeta = meta as unknown as {
          error?: { name?: string; message?: string; error?: string; error_description?: string; stack?: string };
          message?: string;
          providerId?: string;
        };
        const err = anyMeta?.error ?? (anyMeta as { name?: string; message?: string; stack?: string });
        const rec = {
          at: new Date().toISOString(),
          code: String(code),
          name: err?.name,
          message: err?.message ?? anyMeta?.message,
          opError: (err as { error?: string })?.error,
          opDesc: (err as { error_description?: string })?.error_description,
          stack: (err?.stack ?? "").split("\n").slice(0, 10).join(" | ")
        };
        recordAuthError(rec);
        // eslint-disable-next-line no-console
        console.error("SCAUTHERR " + JSON.stringify(rec));
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error("SCAUTHERR-logfail", e);
      }
    },
    warn() {
      /* silence */
    },
    debug() {
      /* silence */
    }
  },
  callbacks: {
    async jwt({ token, profile }) {
      if (profile && (profile as { id?: number | string }).id != null) {
        token.ghId = String((profile as { id: number | string }).id);
        token.ghLogin = (profile as { login?: string }).login;
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
