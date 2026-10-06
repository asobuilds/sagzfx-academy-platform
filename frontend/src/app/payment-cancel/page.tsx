import Link from "next/link";

export default function PaymentCancelPage() {
  return (
    <section className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
      <span className="pill pill-red">Payment not completed</span>
      <h1 className="text-4xl font-bold">No plan was activated.</h1>
      <p style={{ color: "var(--text-secondary)" }}>You can return to pricing and start checkout again when you are ready.</p>
      <Link href="/pricing" className="inline-block px-6 py-3 rounded-xl brand-gradient text-white font-semibold">Return to pricing</Link>
    </section>
  );
}
