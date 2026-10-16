"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { endpoints, type PaymentStatus } from "@/lib/api";

export default function PaymentSuccessPage() {
  const [reference] = useState<string | null>(() =>
    typeof window === "undefined"
      ? null
      : new URLSearchParams(window.location.search).get("reference"),
  );
  const [payment, setPayment] = useState<PaymentStatus | null>(null);
  const [checking, setChecking] = useState(Boolean(reference));
  const [error, setError] = useState<string | null>(
    reference ? null : "No Paystack payment reference was provided.",
  );

  useEffect(() => {
    if (!reference) return;

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let attempts = 0;
    const check = async () => {
      attempts += 1;
      try {
        const result = await endpoints.paymentStatus(reference);
        if (cancelled) return;
        setPayment(result);
        if (result.status === "confirmed" || attempts >= 5) {
          setChecking(false);
        } else {
          timer = setTimeout(check, 1500);
        }
      } catch {
        if (cancelled) return;
        setError("We could not verify this payment reference.");
        setChecking(false);
      }
    };
    void check();
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [reference]);

  const activated = payment?.status === "confirmed";
  return (
    <section className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
      <span className={`pill ${activated ? "pill-green" : "pill-blue"}`}>{activated ? "Payment confirmed" : "Verifying payment"}</span>
      <h1 className="text-4xl font-bold">{activated ? "Your payment is confirmed." : "We are checking your payment."}</h1>
      <p style={{ color: "var(--text-secondary)" }}>
        {activated
          ? `Your ${payment.learning_plan} learning plan has been activated.`
          : error
            ? error
            : checking
              ? "Waiting for Paystack's verified payment notification."
              : "This transaction is not yet confirmed. Do not pay again until its status has been checked."}
      </p>
      <div className="flex justify-center gap-3 flex-wrap">
        <Link href="/dashboard" className="px-6 py-3 rounded-xl brand-gradient text-white font-semibold">Go to dashboard</Link>
        {!activated && <Link href="/pricing" className="px-6 py-3 rounded-xl glass font-semibold">Back to pricing</Link>}
      </div>
    </section>
  );
}
