import PlanFeatureList from "./PlanFeatureList";
export type Plan = {
  slug: "beginner" | "advanced" | "masters";
  name: string;
  price: string;
  audience: string;
  features: readonly string[];
  modules: number;
  mentorship: string;
  action: string;
};
type Props = { plan: Plan; busy: boolean; disabled: boolean; onChoose: (slug: Plan["slug"]) => void };
export default function PricingCard({ plan, busy, disabled, onChoose }: Props) {
  return <article className="glass-strong flex min-w-0 flex-col rounded-3xl border border-white/10 p-6 sm:p-7" aria-labelledby={`plan-${plan.slug}`}>
    <div className="space-y-3">
      <h2 id={`plan-${plan.slug}`} className="text-2xl font-bold">{plan.name}</h2>
      <p className="text-3xl font-bold text-cyan-200 sm:text-4xl">{plan.price}</p>
      <p className="text-sm leading-relaxed text-slate-300">{plan.audience}</p>
      <p className="text-sm text-slate-200"><strong>{plan.modules} modules</strong> · One-month class period</p>
      <p className="text-sm text-slate-300">Mentorship: {plan.mentorship}</p>
    </div>
    <div className="my-6 border-t border-white/10" />
    <PlanFeatureList features={plan.features} label={`${plan.name} topics`} />
    <div className="mt-auto pt-8">
      <button type="button" disabled={disabled} onClick={() => onChoose(plan.slug)} aria-busy={busy}
        className="brand-gradient min-h-12 w-full rounded-xl px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 disabled:cursor-wait disabled:opacity-60">
        {busy ? "Opening Paystack…" : plan.action}
      </button>
    </div>
  </article>;
}
