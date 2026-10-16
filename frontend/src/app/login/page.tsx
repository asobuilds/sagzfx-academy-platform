"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { endpoints, ApiError } from "@/lib/api";
import PageIntro from "@/components/educational/PageIntro";
import HowToGuide from "@/components/educational/HowToGuide";
import InlineHelp from "@/components/educational/InlineHelp";
import NextStepCue from "@/components/educational/NextStepCue";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;
    setError(null);
    setLoading(true);

    try {
      await endpoints.login(email, password);
      await endpoints.me();
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 401) {
          setError("We couldn't sign you in with those details. Check your email and password, then try again.");
        } else if (err.status === 422) {
          setError("Please enter a valid email address and password, then try again.");
        } else {
          setError("We couldn't sign you in right now. Please try again.");
        }
      } else {
        setError("We couldn't connect to SAGZFX right now. Please check your connection and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full min-h-12 rounded-xl border bg-black/30 px-4 py-3 text-base text-slate-100 caret-cyan-300 placeholder:text-slate-400 outline-none transition focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A1424]";
  const inputStyle = { borderColor: "var(--border-strong)", backgroundColor: "rgba(0, 0, 0, 0.3)", color: "var(--text-on-dark)", colorScheme: "dark" as const };

  return (
    <main className="min-h-[calc(100vh-4rem)] px-4 py-8 sm:px-6 sm:py-12 lg:flex lg:items-center lg:py-16">
      <div className="mx-auto grid w-full max-w-5xl gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,440px)] lg:items-center lg:gap-14">
        <section className="min-w-0 space-y-5">
          <PageIntro
            title="Sign in to SAGZFX"
            description="Sign in to continue your lessons, view your learning plan, and use your practice account."
          />
          <div className="hidden max-w-md space-y-4 lg:block">
            <p className="text-sm leading-7 text-slate-300">
              Your dashboard brings your available lessons and virtual practice account together in one place.
              Take your time with each lesson, check your understanding, and practise without risking your own money.
            </p>
            <p className="text-sm leading-7 text-slate-400">
              A trading setup can fail. Use what you learn to make more careful decisions, not to expect guaranteed results.
            </p>
          </div>
        </section>

        <div className="min-w-0 space-y-5">
          <HowToGuide
            storageKey="login"
            steps={[
              "Enter the email address you used to register.",
              "Enter your password.",
              "Select Sign in to open your dashboard.",
            ]}
          />

          <form onSubmit={onSubmit} className="glass-strong space-y-5 rounded-2xl p-5 sm:p-7">
            {error && (
              <div role="alert" className="rounded-xl border border-red-400/40 bg-red-950/40 px-4 py-3 text-sm leading-relaxed text-red-100">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-slate-100">
                Email address
              </label>
              <InlineHelp text="Use the same email address you used when creating your account.">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className={inputClass}
                  style={inputStyle}
                />
              </InlineHelp>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-slate-100">
                Password
              </label>
              <InlineHelp text="Enter the password you chose when creating your account.">
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your password"
                    className={`${inputClass} pr-14`}
                    style={inputStyle}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    aria-pressed={showPassword}
                    aria-controls="password"
                    className="absolute inset-y-0 right-1 flex min-h-11 min-w-11 items-center justify-center rounded-lg text-slate-300 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
                  >
                    {showPassword ? (
                      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M10.6 5.2A10.8 10.8 0 0112 5c5 0 9 4.2 10 7a12 12 0 01-3.2 4.7M6.1 6.1C4.2 7.5 2.8 9.6 2 12c1 2.8 5 7 10 7 1.6 0 3.1-.4 4.4-1.2M9.9 9.9a3 3 0 004.2 4.2" />
                      </svg>
                    ) : (
                      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </InlineHelp>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="brand-gradient min-h-12 w-full rounded-xl px-5 py-3 font-semibold text-white transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>

            <p className="text-center text-sm text-slate-300">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="font-semibold text-cyan-300 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400">
                Create one
              </Link>
            </p>
          </form>

          <NextStepCue
            message="After signing in, your dashboard will open with your available lessons."
            available={false}
          />
        </div>
      </div>
    </main>
  );
}
