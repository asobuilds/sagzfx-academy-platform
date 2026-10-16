import Link from "next/link";
import type { ModuleSummary } from "@/lib/api";

type Props = { previous: ModuleSummary | null; next: ModuleSummary | null };

function NavItem({ item, direction }: { item: ModuleSummary | null; direction: "previous" | "next" }) {
  const prefix = direction === "previous" ? "← Previous" : "Next";
  if (!item || !item.unlocked) return (
    <div aria-disabled="true" className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-slate-400">
      {item ? `🔒 ${prefix}: ${item.title} — locked` : `${prefix}: no lesson in this tier`}
    </div>
  );
  return (
    <Link href={`/module/${encodeURIComponent(item.module_id)}`} className="flex min-h-16 items-center rounded-xl border border-white/20 bg-white/5 p-4 text-sm font-semibold text-slate-100 transition hover:border-cyan-400/40 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400">
      {direction === "previous" ? `← Previous: ${item.title}` : `Next: ${item.title} →`}
    </Link>
  );
}

export default function LessonNavigation({ previous, next }: Props) {
  return (
    <nav aria-label="Lesson navigation" className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <NavItem item={previous} direction="previous" />
      <NavItem item={next} direction="next" />
    </nav>
  );
}
