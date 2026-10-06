"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { endpoints, type User } from "@/lib/api";

export default function PaymentSuccessPage() {
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let attempts = 0;
    const check = async () => {
      attempts += 1;
      try {
        const current = await endpoints.me();
        setUser(current);
        if (current.learning_plan !== "registered" || attempts >= 5) setChecking(false);
        else setTimeout(check, 1500);
      } catch {
        setChecking(false);
      }
    };
    void check();
  }, []);

  const activated = user && user.learning_plan !== "registered";
  return (
    <section className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
      <span className={`pill ${activated ? "pill-green" : "pill-blue"}`}>{activated ? "Payment confirmed" : "Verifying payment"}</span>
      <h1 className="text-4xl font-bold">{activated ? "Your class is active." : "We are checking your account."}</h1>
      <p style={{ color: "var(--text-secondary)" }}>
        {activated
          ? `Your ${user.learning_plan} plan is active. Your one-month class period has started and lifetime mentorship is enabled.`
          : checking ? "Paystack has returned you to SAGZFX. We are waiting for the verified payment webhook before granting access."
          : "Your account has not been upgraded yet. Do not pay again until the transaction status is confirmed."}
      </p>
      <div className="flex justify-center gap-3 flex-wrap">
        <Link href="/dashboard" className="px-6 py-3 rounded-xl brand-gradient text-white font-semibold">Go to dashboard</Link>
        {!activated && <Link href="/pricing" className="px-6 py-3 rounded-xl glass font-semibold">Back to pricing</Link>}
      </div>
    </section>
  );
}
