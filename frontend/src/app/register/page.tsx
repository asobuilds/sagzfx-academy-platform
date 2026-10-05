"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { endpoints, setTokens, ApiError } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await endpoints.register(fullName, email, password);
      // Auto-login after register
      const tokens = await endpoints.login(email, password);
      setTokens(tokens.access_token, tokens.refresh_token);
      router.push("/dashboard");
    } catch (err) {
      if (err instanceof ApiError) {
        setError(typeof err.detail === "string" ? err.detail : "Registration failed.");
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

        {/* Header */}
        <div className="text-center space-y-3">
          <span className="pill pill-green">Free Registration</span>
          <h1
            className="text-3xl md:text-4xl font-bold tracking-tight"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Start your <span className="text-gradient">journey</span>
          </h1>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Free account · Beginner track · Exness demo environment
          </p>
        </div>

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
            <label className="text-xs uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
              Full Name
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your name"
              className="w-full px-4 py-3 rounded-xl bg-black/30 border outline-none focus:border-cyan-500/60 transition text-sm"
              style={{ borderColor: "var(--border-subtle)", color: "var(--text-primary)" }}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-xl bg-black/30 border outline-none focus:border-cyan-500/60 transition text-sm"
              style={{ borderColor: "var(--border-subtle)", color: "var(--text-primary)" }}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
              Password
            </label>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              className="w-full px-4 py-3 rounded-xl bg-black/30 border outline-none focus:border-cyan-500/60 transition text-sm"
              style={{ borderColor: "var(--border-subtle)", color: "var(--text-primary)" }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl brand-gradient text-white font-semibold hover-lift shadow-lg shadow-blue-900/40 disabled:opacity-60 disabled:cursor-not-allowed transition"
          >
            {loading ? "Creating account..." : "Create free account"}
          </button>

          <p className="text-center text-sm pt-2" style={{ color: "var(--text-secondary)" }}>
            Already have an account?{" "}
            <Link href="/login" className="text-cyan-400 hover:text-cyan-300 font-medium">
              Sign in
            </Link>
          </p>
        </form>

      </div>
    </section>
  );
}
