import type { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { hasGitHubAuth } from "./config";

/**
 * GitHub sign-in with JWT sessions (no DB adapter needed for auth — user
 * identity is the GitHub id carried in the token). Projects are owned by that
 * id in the application database.
 */
export const authOptions: NextAuthOptions = {
  providers: hasGitHubAuth
    ? [
        GitHubProvider({
          // Trim to defend against a trailing space/newline in the env value,
          // which makes GitHub reject the token exchange with the opaque
          // "issuer must be configured on the issuer" error.
          clientId: (process.env.GITHUB_ID ?? "").trim(),
          clientSecret: (process.env.GITHUB_SECRET ?? "").trim()
        })
      ]
    : [],
  session: { strategy: "jwt" },
  secret: (process.env.NEXTAUTH_SECRET ?? "dev-only-insecure-secret").trim(),
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
