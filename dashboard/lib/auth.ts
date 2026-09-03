import type { NextAuthOptions, CookiesOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { hasGitHubAuth } from "./config";

/**
 * Derive the registrable cookie domain from NEXTAUTH_URL so auth cookies are
 * shared across the apex and www hosts (e.g. `.stackcircuit.dev`). Without this,
 * a sign-in that begins on one host and returns from GitHub on the other loses
 * its one-time state cookie and fails with `OAuthCallback`. Returns undefined
 * for localhost / IPs so local dev keeps NextAuth's default host-only cookies.
 */
function sharedCookieDomain(): string | undefined {
  try {
    const host = new URL(process.env.NEXTAUTH_URL ?? "").hostname;
    if (!host || host === "localhost" || /^[0-9.]+$/.test(host)) return undefined;
    const parts = host.split(".");
    if (parts.length < 2) return undefined;
    return "." + parts.slice(-2).join(".");
  } catch {
    return undefined;
  }
}

/**
 * When we have a shared domain, define every auth cookie with that Domain and
 * `Secure`. The CSRF cookie is renamed off the `__Host-` prefix because that
 * prefix forbids a Domain attribute (host-only by spec).
 */
function buildCookies(): Partial<CookiesOptions> | undefined {
  const domain = sharedCookieDomain();
  if (!domain) return undefined;
  const base = { httpOnly: true, sameSite: "lax" as const, path: "/", secure: true, domain };
  return {
    sessionToken: { name: "__Secure-next-auth.session-token", options: base },
    callbackUrl: { name: "__Secure-next-auth.callback-url", options: { ...base, httpOnly: false } },
    csrfToken: { name: "__Secure-next-auth.csrf-token", options: base },
    pkceCodeVerifier: { name: "__Secure-next-auth.pkce.code_verifier", options: { ...base, maxAge: 900 } },
    state: { name: "__Secure-next-auth.state", options: { ...base, maxAge: 900 } },
    nonce: { name: "__Secure-next-auth.nonce", options: base }
  };
}

/**
 * GitHub sign-in with JWT sessions (no DB adapter needed for auth — user
 * identity is the GitHub id carried in the token). Projects are owned by that
 * id in the application database.
 */
export const authOptions: NextAuthOptions = {
  providers: hasGitHubAuth
    ? [
        GitHubProvider({
          // Trim to defend against a trailing space/newline pasted into the
          // env value, which makes GitHub reject the token exchange with the
          // opaque "issuer must be configured on the issuer" error.
          clientId: (process.env.GITHUB_ID ?? "").trim(),
          clientSecret: (process.env.GITHUB_SECRET ?? "").trim()
        })
      ]
    : [],
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET ?? "dev-only-insecure-secret",
  ...(buildCookies() ? { cookies: buildCookies() } : {}),
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
