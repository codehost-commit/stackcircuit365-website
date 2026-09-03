"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginButtons({ demo }: { demo: boolean }) {
  const router = useRouter();
  if (demo) {
    return (
      <button
        type="button"
        onClick={() => router.push("/dashboard/p/prj_demo")}
        className="w-full bg-ink px-5 py-3 font-mono text-[13px] uppercase tracking-widest text-paper"
      >
        Enter demo dashboard →
      </button>
    );
  }
  return (
    <button
      type="button"
      onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
      className="w-full bg-ink px-5 py-3 font-mono text-[13px] uppercase tracking-widest text-paper"
    >
      Sign in with GitHub
    </button>
  );
}
