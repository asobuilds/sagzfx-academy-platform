type Props = { features: readonly string[]; label: string };
export default function PlanFeatureList({ features, label }: Props) {
  return <section aria-label={label} className="space-y-3">
    <h3 className="text-sm font-semibold text-slate-100">What you&apos;ll learn</h3>
    <ul className="space-y-2">{features.map((feature) => <li key={feature} className="flex items-start gap-2 text-sm leading-relaxed text-slate-300"><span aria-hidden="true" className="mt-0.5 text-cyan-300">✓</span><span>{feature}</span></li>)}</ul>
  </section>;
}
