const faqs = [
  { q: "Do I need to pay to create an account?", a: "No. Registration is free. Paid lessons require a plan." },
  { q: "What happens after my one-month class ends?", a: "Modules you opened during your class remain available to you. Modules you did not open will lock. You can re-enrol for another class period." },
  { q: "What does lifetime mentorship mean?", a: "Masters students receive continuing access to SAGZFX mentorship for as long as the academy operates. It does not include a fixed number of sessions per month." },
  { q: "Can I upgrade from Beginner to Advanced later?", a: "Yes. You can purchase a higher plan at any time. Your access will upgrade to include the additional modules." },
  { q: "Is this financial advice?", a: "No. SAGZFX teaches forex market structure, risk management, and analytical skills. Nothing on this platform is financial advice, and trading involves a real risk of loss." },
];
export default function PricingFAQ() {
  return <section aria-labelledby="pricing-faq" className="space-y-4">
    <h2 id="pricing-faq" className="text-2xl font-bold">Frequently asked questions</h2>
    <div className="space-y-3">{faqs.map(({ q, a }) => <details key={q} className="glass group rounded-xl border border-white/10 p-4 sm:p-5"><summary className="cursor-pointer font-semibold leading-relaxed text-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400">{q}</summary><p className="mt-3 text-sm leading-relaxed text-slate-300">{a}</p></details>)}</div>
  </section>;
}
