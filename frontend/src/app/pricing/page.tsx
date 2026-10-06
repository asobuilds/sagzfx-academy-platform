"use client";

import Link from "next/link";
import { useState } from "react";
import { ApiError, endpoints, getToken } from "@/lib/api";

const plans = [
  { slug: "beginner", name: "Beginner", price: "₦150,000", access: "12 Beginner modules" },
  { slug: "advanced", name: "Advanced", price: "₦250,000", access: "Beginner + Market Structure + Advanced" },
  { slug: "masters", name: "Masters & One-on-One", price: "₦500,000", access: "All 47 modules + Masterclass" },
] as const;

export default function PricingPage() {
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function checkout(slug: string) {
    if (!getToken()) {
      window.location.assign("/login?next=/pricing");
      return;
    }
    setBusy(slug);
    setError(null);
    try {
      const callback = `${window.location.origin}/payment-success`;
      const result = await endpoints.initPayment(slug, callback);
      window.location.assign(result.checkout_url);
    } catch (err) {
      setError(err instanceof ApiError ? String(err.detail) : "Unable to start payment.");
      setBusy(null);
    }
  }

  return (
    <section className="px-4 md:px-8 py-16 max-w-7xl mx-auto space-y-10">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="pill pill-blue">SAGZFX Training Plans</span>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Choose your learning plan</h1>
        <p style={{ color: "var(--text-secondary)" }}>
          Every paid class runs for one month and includes lifetime mentorship. After the class period,
          modules you opened remain available; unopened modules lock.
        </p>
      </div>
      {error && <div className="max-w-2xl mx-auto pill pill-red">{error}</div>}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <article key={plan.slug} className="glass-strong rounded-3xl p-7 space-y-6">
            <div>
              <h2 className="text-2xl font-bold">{plan.name}</h2>
              <p className="text-4xl font-bold mt-3 text-gradient">{plan.price}</p>
              <p className="text-sm mt-2" style={{ color: "var(--text-muted)" }}>1 month class · Lifetime mentorship</p>
            </div>
            <p style={{ color: "var(--text-secondary)" }}>{plan.access}</p>
            <button
              type="button"
              disabled={busy !== null}
              onClick={() => checkout(plan.slug)}
              className="w-full px-6 py-3 rounded-xl brand-gradient text-white font-semibold disabled:opacity-50"
            >
              {busy === plan.slug ? "Opening Paystack…" : "Pay securely with Paystack"}
            </button>
          </article>
        ))}
      </div>
      <p className="text-center text-sm" style={{ color: "var(--text-muted)" }}>
        Need an account first? <Link className="text-cyan-700 font-semibold" href="/register">Register here</Link>.
      </p>
    </section>
  );
}
