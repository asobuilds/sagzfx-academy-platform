type Props = {
  unlockedCount: number;
  total: number;
  tier: string;
  classEnds: string | null | undefined;
  community: string | null;
};

export default function LearningPlanSummary({ unlockedCount, total, tier, classEnds, community }: Props) {
  const classDate = classEnds ? new Date(classEnds) : null;
  const formattedDate = classDate && !Number.isNaN(classDate.getTime())
    ? classDate.toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })
    : "Not active";
  const stats = [
    { label: "Modules Unlocked", value: `${unlockedCount} / ${total}` },
    { label: "Plan", value: tier.toUpperCase() },
    { label: "Class Ends", value: formattedDate },
    { label: "Practice Account", value: "Free $10,000" },
    { label: "Community", value: community || "Not available" },
  ];
  return (
    <section aria-label="Your learning plan summary">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map(({ label, value }) => (
          <div key={label} className="glass min-w-0 space-y-2 rounded-xl p-3 sm:p-4">
            <h2 className="text-[11px] font-medium uppercase tracking-wide text-slate-400">{label}</h2>
            <p className="break-words text-sm font-semibold text-slate-100 sm:text-base">{value}</p>
          </div>
        ))}
      </div>
      <p className="mt-2 text-xs text-slate-400">Class Ends shows when your current paid class access is scheduled to finish.</p>
    </section>
  );
}
