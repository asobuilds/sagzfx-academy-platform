"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ApiError, endpoints, type User } from "@/lib/api";
import PageIntro from "@/components/educational/PageIntro";
import HowToGuide from "@/components/educational/HowToGuide";
import NextStepCue from "@/components/educational/NextStepCue";
import PricingCard, { type Plan } from "@/components/student/PricingCard";
import PlanComparisonTable from "@/components/student/PlanComparisonTable";
import PaymentExplanation from "@/components/student/PaymentExplanation";
import MotivationSection from "@/components/student/MotivationSection";
import PricingFAQ from "@/components/student/PricingFAQ";

const plans: readonly Plan[] = [
  {
    slug: "beginner", name: "Beginner", price: "₦150,000",
    audience: "Start here if you are new to forex and want to understand how markets work before you risk any money.",
    modules: 12, mentorship: "Not included", action: "Choose Beginner",
    features: ["Introduction to Forex", "Currency pairs & market sessions", "Pips, lots, spreads & leverage", "Buy/Sell & order types", "Trading platforms (MT4/MT5)", "Candlestick basics", "Support & Resistance", "Trendlines & market direction", "Stop Loss & Take Profit", "Basic Risk Management", "Trading Psychology", "How to read a simple chart"],
  },
  {
    slug: "advanced", name: "Advanced", price: "₦250,000",
    audience: "For students who already understand the basics and want to study market structure, supply and demand, and advanced concepts.",
    modules: 46, mentorship: "Not included", action: "Choose Advanced",
    features: ["Everything in Beginner, plus:", "Market Structure foundations", "Break of Structure (BOS), CHOCH", "Supply & Demand zones", "Liquidity & liquidity sweeps", "Fair Value Gaps (FVG)", "Order Blocks", "Premium & Discount", "Multi-Timeframe Analysis", "Advanced Market Structure", "Institutional order flow", "Smart Money Concepts (SMC)", "Risk-to-reward, trade management, journaling"],
  },
  {
    slug: "masters", name: "Masters & One-on-One", price: "₦500,000",
    audience: "For committed students who want the full curriculum, including Masterclass topics and lifetime mentorship.",
    modules: 57, mentorship: "Lifetime access to SAGZFX-hosted mentorship", action: "Choose Masters",
    features: ["Everything in Advanced, plus:", "Top-down analysis", "Market bias", "Liquidity identification", "Entry confirmation", "SL & TP targeting", "Risk calculation", "Trade management", "Journaling", "Reviewing and improving your strategy"],
  },
];

export default function PricingPage() {
  const [user, setUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [busy, setBusy] = useState<Plan["slug"] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    endpoints.me().then((account) => { if (active) setUser(account); })
      .catch(() => { if (active) setUser(null); })
      .finally(() => { if (active) setAuthChecked(true); });
    return () => { active = false; };
  }, []);

  async function checkout(slug: Plan["slug"]) {
    if (busy) return;
    setBusy(slug);
    setError(null);
    try {
      const callback = `${window.location.origin}/payment-success`;
      const result = await endpoints.initPayment(slug, callback);
      if (!result.checkout_url.startsWith("https://")) throw new Error("Invalid checkout URL");
      window.location.assign(result.checkout_url);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        window.location.assign("/login?next=/pricing");
        return;
      }
      setError(err instanceof ApiError && err.status === 400
        ? "We couldn't start this payment. Check your account and try again."
        : "We couldn't open Paystack right now. Please try again later.");
      setBusy(null);
    }
  }

  const tier = user?.learning_plan?.toLowerCase() ?? (user?.has_paid_tuition ? "paid" : "registered");
  const isPaid = Boolean(user && (user.has_paid_tuition || ["beginner", "advanced", "masters"].includes(tier)));
  return (
    <main className="mx-auto max-w-7xl space-y-10 px-4 py-9 md:space-y-12 md:px-8 md:py-14">
      <PageIntro title="Choose your learning plan" description="Compare the lessons included in each plan and choose the level that matches what you want to study." />
      <HowToGuide storageKey="pricing" steps={[
        "Read what each plan includes.",
        "Check the class duration and mentorship information.",
        "Choose a plan you are ready to study.",
        "Follow the payment instructions to complete your enrolment.",
      ]} />
      {error && <div role="alert" className="rounded-xl border border-rose-400/40 bg-rose-500/10 p-4 text-sm text-rose-100">{error}</div>}
      <section aria-label="Learning plan options" className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-3">
        {plans.map((plan) => <PricingCard key={plan.slug} plan={plan} busy={busy === plan.slug} disabled={busy !== null} onChoose={checkout} />)}
      </section>
      <PlanComparisonTable />
      <PaymentExplanation />
      <MotivationSection />
      <PricingFAQ />
      <NextStepCue
        message={!authChecked ? "Review the learning plans while we check your account." : !user
          ? "Create a free account to explore the platform before choosing a plan."
          : isPaid
            ? "Your plan is already active. Return to your dashboard to continue your lessons."
            : "Choose the plan that matches where you are today. You can upgrade at any time."}
        href={!authChecked ? undefined : !user ? "/register" : isPaid ? "/dashboard" : "/pricing"}
        linkLabel={!authChecked ? undefined : !user ? "Create free account" : isPaid ? "Go to dashboard" : "Compare plans above"}
      />
      <p className="text-center text-sm text-slate-400">Need an account first? <Link href="/register" className="font-semibold text-cyan-300 underline underline-offset-4">Register for free</Link>.</p>
    </main>
  );
}
