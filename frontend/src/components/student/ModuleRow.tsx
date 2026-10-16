import Link from "next/link";
import type { ModuleSummary } from "@/lib/api";

export default function ModuleRow({ module }: { module: ModuleSummary }) {
  const inner = (
    <>
      <span className="w-24 shrink-0 font-mono text-xs text-slate-400 sm:w-28">{module.module_id}</span>
      <span className="min-w-0 flex-1 text-sm font-medium leading-relaxed text-slate-100">{module.title}</span>
      <span className={`shrink-0 rounded-full border px-2 py-1 text-[11px] font-semibold ${module.unlocked ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-200" : "border-slate-600 bg-slate-800/60 text-slate-300"}`}>
        {module.unlocked ? "Available" : "🔒 Locked"}
      </span>
      <span aria-hidden="true" className="hidden text-cyan-300 sm:inline">{module.unlocked ? "→" : "—"}</span>
    </>
  );
  const rowClass = "flex min-w-0 flex-wrap items-center gap-x-3 gap-y-2 rounded-xl border border-white/10 px-3 py-3 sm:flex-nowrap sm:px-4";
  return module.unlocked ? (
    <Link href={`/module/${encodeURIComponent(module.module_id)}`} className={`${rowClass} transition hover:border-cyan-400/40 hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400`} aria-label={`Open module ${module.module_id}: ${module.title}`}>
      {inner}
    </Link>
  ) : (
    <div className={`${rowClass} opacity-65`} aria-label={`Module ${module.module_id}: ${module.title}, locked`}>
      {inner}
    </div>
  );
}
