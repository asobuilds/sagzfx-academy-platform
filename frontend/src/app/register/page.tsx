"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { endpoints, ApiError } from "@/lib/api";
import PageIntro from "@/components/educational/PageIntro";
import HowToGuide from "@/components/educational/HowToGuide";
import InlineHelp from "@/components/educational/InlineHelp";
import NextStepCue from "@/components/educational/NextStepCue";

const inputClass = "w-full min-h-12 rounded-xl border bg-black/30 px-4 py-3 text-base text-slate-100 caret-cyan-300 placeholder:text-slate-400 outline-none transition focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A1424]";
const inputStyle = { borderColor: "var(--border-strong)", backgroundColor: "rgba(0, 0, 0, 0.3)", color: "var(--text-on-dark)", colorScheme: "dark" as const };

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;
    setError(null);
    if (fullName.trim().length < 2) {
      setError("Please enter your full name.");
      return;
    }
    if (password.length < 8) {
      setError("Your password must contain at least 8 characters.");
      return;
    }
    setLoading(true);
    try {
      await endpoints.register(fullName.trim(), email.trim(), password);
      await endpoints.login(email.trim(), password);
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      if (err instanceof ApiError) {
        const detail = typeof err.detail === "string" ? err.detail.toLowerCase() : "";
        if (err.status === 409 || (err.status === 400 && /already|exist|duplicate|registered|taken/.test(detail))) {
          setError("This email address may already have an account. Try signing in instead.");
        } else if (err.status === 422) {
          setError("Please check your name, email address, and password, then try again.");
        } else {
          setError("We couldn't create your account right now. Please try again.");
        }
      } else {
        setError("We couldn't connect to SAGZFX right now. Please check your connection and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] px-4 py-8 sm:px-6 sm:py-12 lg:flex lg:items-center lg:py-16">
      <div className="mx-auto grid w-full max-w-5xl gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,440px)] lg:items-center lg:gap-14">
        <section className="min-w-0 space-y-5">
          <PageIntro title="Create your free account" description="Create an account to use the practice simulator and explore the learning plans available at SAGZFX." />
          <div className="hidden max-w-md space-y-4 lg:block">
            <p className="text-sm leading-7 text-slate-300">You can explore the platform and practise with virtual money before choosing a paid learning plan.</p>
            <p className="text-sm leading-7 text-slate-400">Study at your own pace and check your understanding as you go. A trading setup can fail, so focus on learning rather than promises of results.</p>
          </div>
        </section>
        <div className="min-w-0 space-y-5">
          <HowToGuide storageKey="register" steps={[
            "Enter your full name.",
            "Add an email address you can access.",
            "Create a password with at least 8 characters.",
            "Select Create free account to open your dashboard.",
          ]} />
          <form onSubmit={onSubmit} className="glass-strong space-y-5 rounded-2xl p-5 sm:p-7">
            {error && <div role="alert" className="rounded-xl border border-red-400/40 bg-red-950/40 px-4 py-3 text-sm leading-relaxed text-red-100">{error}</div>}
            <div className="space-y-2">
              <label htmlFor="full-name" className="block text-sm font-medium text-slate-100">Full name</label>
              <InlineHelp text="Enter the name you want to use on your student account.">
                <input id="full-name" name="name" type="text" autoComplete="name" required minLength={2} value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="Your full name" className={inputClass} style={inputStyle} />
              </InlineHelp>
            </div>
            <div className="space-y-2">
              <label htmlFor="register-email" className="block text-sm font-medium text-slate-100">Email address</label>
              <InlineHelp text="You'll use this email address when signing in.">
                <input id="register-email" name="email" type="email" autoComplete="email" inputMode="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" className={inputClass} style={inputStyle} />
              </InlineHelp>
            </div>
            <div className="space-y-2">
              <label htmlFor="register-password" className="block text-sm font-medium text-slate-100">Password</label>
              <InlineHelp id="register-password-help" text="At least 8 characters. Choose a password you do not use on other websites.">
                <div className="relative">
                  <input id="register-password" aria-describedby="register-password-help" name="password" type={showPassword ? "text" : "password"} autoComplete="new-password" required minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Create a password" className={`${inputClass} pr-14`} style={inputStyle} />
                  <button type="button" onClick={() => setShowPassword((current) => !current)} aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword} aria-controls="register-password" className="absolute inset-y-0 right-1 flex min-h-11 min-w-11 items-center justify-center rounded-lg text-slate-300 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400">
                    {showPassword ? (
                      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M10.6 5.2A10.8 10.8 0 0112 5c5 0 9 4.2 10 7a12 12 0 01-3.2 4.7M6.1 6.1C4.2 7.5 2.8 9.6 2 12c1 2.8 5 7 10 7 1.6 0 3.1-.4 4.4-1.2M9.9 9.9a3 3 0 004.2 4.2" /></svg>
                    ) : (
                      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></svg>
                    )}
                  </button>
                </div>
              </InlineHelp>
            </div>
            <p className="rounded-xl border border-cyan-400/20 bg-cyan-950/20 p-3 text-sm leading-relaxed text-slate-200"><strong>Free registration:</strong> You do not need to pay to create an account. Paid lessons require a learning plan.</p>
            <button type="submit" disabled={loading} className="brand-gradient min-h-12 w-full rounded-xl px-5 py-3 font-semibold text-white transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 disabled:cursor-not-allowed disabled:opacity-60">{loading ? "Creating account..." : "Create free account"}</button>
            <p className="text-center text-sm text-slate-300">Already have an account?{" "}<Link href="/login" className="font-semibold text-cyan-300 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400">Sign in</Link></p>
          </form>
          <NextStepCue message="Visit your dashboard, try the free practice simulator, or compare the learning plans." available={false} />
        </div>
      </div>
    </main>
  );
}
