export default function PaymentExplanation() {
  return <section aria-labelledby="payment-heading" className="glass space-y-4 rounded-2xl p-5 sm:p-7">
    <h2 id="payment-heading" className="text-2xl font-bold">How payment works</h2>
    <ol className="list-decimal space-y-3 pl-5 text-sm leading-relaxed text-slate-200">
      <li>After choosing a plan, you&apos;ll be taken to Paystack to complete your payment.</li>
      <li>Available payment methods depend on the options Paystack shows at checkout. These may include cards, bank transfers, USSD, and mobile money.</li>
      <li>Your access is updated after SAGZFX confirms the payment. This is usually quick, but may take a few minutes.</li>
      <li>If payment is still pending, do not start another payment immediately. Refresh your dashboard or contact support.</li>
    </ol>
    <p className="rounded-xl bg-white/5 p-4 text-sm leading-relaxed text-slate-300">Every plan includes SAGZFX Practice Trading with virtual money — the same simulator, regardless of plan.</p>
  </section>;
}
