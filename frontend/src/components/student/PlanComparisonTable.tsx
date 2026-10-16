const rows: { feature: string; values: [string, string, string] }[] = [
  { feature: "Modules unlocked", values: ["12", "46", "57"] },
  { feature: "Beginner lessons", values: ["Yes", "Yes", "Yes"] },
  { feature: "Market Structure", values: ["—", "Yes", "Yes"] },
  { feature: "Advanced lessons", values: ["—", "Yes", "Yes"] },
  { feature: "Masterclass lessons", values: ["—", "—", "Yes"] },
  { feature: "Class period", values: ["1 month", "1 month", "1 month"] },
  { feature: "Lifetime mentorship", values: ["—", "—", "Yes"] },
  { feature: "Practice trading", values: ["Yes", "Yes", "Yes"] },
  { feature: "Discord community", values: ["Yes", "Yes", "Yes"] },
];
export default function PlanComparisonTable() {
  return <section aria-labelledby="comparison-heading" className="space-y-4">
    <h2 id="comparison-heading" className="text-2xl font-bold">Compare the plans</h2>
    <div className="overflow-x-auto rounded-2xl border border-white/15" tabIndex={0} role="region" aria-label="Scrollable plan comparison">
      <table className="w-full min-w-[580px] border-collapse text-left text-sm">
        <caption className="sr-only">Features included with each learning plan</caption>
        <thead className="bg-white/10"><tr><th scope="col" className="p-4">Feature</th><th scope="col" className="p-4">Beginner</th><th scope="col" className="p-4">Advanced</th><th scope="col" className="p-4">Masters</th></tr></thead>
        <tbody>{rows.map((row) => <tr key={row.feature} className="border-t border-white/10"><th scope="row" className="p-4 font-medium text-slate-200">{row.feature}</th>{row.values.map((value, index) => <td key={index} className="p-4 text-slate-300">{value}</td>)}</tr>)}</tbody>
      </table>
    </div>
    <p className="text-sm leading-relaxed text-slate-400">Practice Trading and the community are available to free registered students too.</p>
  </section>;
}
