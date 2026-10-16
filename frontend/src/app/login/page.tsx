"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { endpoints, ApiError } from "@/lib/api";
import PageIntro from "@/components/educational/PageIntro";
import HowToGuide from "@/components/educational/HowToGuide";
import InlineHelp from "@/components/educational/InlineHelp";
import NextStepCue from "@/components/educational/NextStepCue";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await endpoints.login(email, password);
      // Cookies are now set. Verify session, then redirect.
      await endpoints.me();
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 401) {
          setError("Invalid email or password.");
        } else if (err.status === 422) {
          setError("Please enter a valid email and password.");
        } else if (typeof err.detail === "string") {
          setError(err.detail);
        } else {
          setError("Login failed. Please try again.");
        }
      } else {
        setError("Network error. Is the backend running?");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md space-y-8">
        <PageIntro title="Sign in to SAGZFX" description="Sign in to continue your lessons, view your learning plan, and use your practice account." className="text-center" />
        <HowToGuide storageKey="login" steps={[
          "Enter the email address you used to register.",
          "Enter your password.",
          "Select Sign in to open your dashboard.",
        ]} />

        {/* Form card */}
        <form
          onSubmit={onSubmit}
          className="glass-strong rounded-3xl p-8 space-y-5"
        >
          {error && (
            <div className="pill pill-red w-full justify-center py-3 px-4 rounded-xl text-sm normal-case tracking-normal">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label
              htmlFor="login-email"
              className="text-xs uppercase tracking-wider"
              style={{ color: "var(--text-muted)" }}
            >
              Email
            </label>
            <InlineHelp text="Use the same email address you used when creating your account.">
              <input
                id="login-email"
                autoComplete="email"
                type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-xl bg-black/30 border outline-none focus:border-cyan-500/60 transition text-sm"
              style={{
                borderColor: "var(--border-subtle)",
                color: "var(--text-primary)",
              }}
              />
            </InlineHelp>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="login-password"
              className="text-xs uppercase tracking-wider"
              style={{ color: "var(--text-muted)" }}
            >
              Password
            </label>
            <InlineHelp text="Enter the password you chose when creating your account.">
              <input
                id="login-password"
                autoComplete="current-password"
                type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-black/30 border outline-none focus:border-cyan-500/60 transition text-sm"
              style={{
                borderColor: "var(--border-subtle)",
                color: "var(--text-primary)",
              }}
              />
            </InlineHelp>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl brand-gradient text-white font-semibold hover-lift shadow-lg shadow-blue-500/20 disabled:opacity-60 disabled:cursor-not-allowed transition"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>

          <p
            className="text-center text-sm pt-2"
            style={{ color: "var(--text-secondary)" }}
          >
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-cyan-400 hover:text-cyan-300 font-medium"
            >
              Create one
            </Link>
          </p>
        </form>
        <NextStepCue message="After signing in, open your dashboard to find your available lessons." href="/dashboard" linkLabel="Go to dashboard" available={false} fallback="After signing in, your dashboard will open with your available lessons." />
      </div>
    </section>
  );
}
