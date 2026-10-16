"use client";

import { useEffect, useId, useState } from "react";
import Link from "next/link";
import type { ModuleSummary } from "@/lib/api";
import EducationalEmptyState from "@/components/educational/EducationalEmptyState";
import ModuleRow from "./ModuleRow";

const tiers = [
  { key: "beginner", label: "Beginner" },
  { key: "market_structure", label: "Market Structure" },
  { key: "advanced", label: "Advanced" },
  { key: "masterclass", label: "Masterclass" },
] as const;

function TierSection({ tierKey, label, modules, registered }: { tierKey: string; label: string; modules: ModuleSummary[]; registered: boolean }) {
  const unlocked = modules.some((mod) => mod.unlocked);
  const [open, setOpen] = useState(!registered && unlocked);
  const id = useId();
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`sagzfx:curriculum:${tierKey}`);
      if (saved === "open" || saved === "closed") {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setOpen(saved === "open");
      }
    } catch {
      // The disclosure remains usable when local storage is disabled.
    }
  }, [tierKey]);
  const toggle = () => {
    const next = !open;
    setOpen(next);
    try { localStorage.setItem(`sagzfx:curriculum:${tierKey}`, next ? "open" : "closed"); } catch { /* In-memory state still works. */ }
  };
  return (
    <section className="glass overflow-hidden rounded-2xl border border-white/10">
      <h3>
        <button type="button" aria-expanded={open} aria-controls={id} onClick={toggle} className="flex min-h-16 w-full items-center justify-between gap-3 px-4 py-4 text-left focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-cyan-400 sm:px-6">
          <span className="font-semibold text-slate-100">{label} <span className="ml-1 text-xs font-normal text-slate-400">{modules.length} modules</span></span>
          <span aria-hidden="true" className="text-cyan-300">{open ? "−" : "+"}</span>
        </button>
      </h3>
      <div id={id} hidden={!open} className="space-y-2 border-t border-white/10 p-3 sm:p-4">
        {!unlocked && (
          <p className="rounded-xl bg-white/5 p-3 text-sm leading-relaxed text-slate-300">
            This tier is not included in your current plan. Check the <Link href="/pricing" className="font-semibold text-cyan-300 underline underline-offset-2">Pricing page</Link> to see which plan includes it.
          </p>
        )}
        {modules.length === 0 ? (
          <p className="p-3 text-sm text-slate-300">No lessons are listed in this tier right now. Check your dashboard again later.</p>
        ) : modules.map((mod) => <ModuleRow key={mod.module_id} module={mod} />)}
      </div>
    </section>
  );
}

export default function CurriculumSection({ modules, registered }: { modules: ModuleSummary[]; registered: boolean }) {
  const groups = new Map<string, ModuleSummary[]>();
  for (const tier of tiers) groups.set(tier.key, []);
  for (const mod of modules) {
    const key = mod.tier_level.toLowerCase().replace(/[\s-]+/g, "_");
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(mod);
  }
  for (const group of groups.values()) group.sort((a, b) => a.sort_order - b.sort_order);
  return (
    <section aria-labelledby="curriculum-title" className="space-y-5">
      <div className="space-y-1">
        <h2 id="curriculum-title" className="text-2xl font-bold tracking-tight sm:text-3xl">Your learning path</h2>
        <p className="text-sm leading-relaxed text-slate-300">Open the lessons available in your plan. Locked lessons are shown for reference.</p>
      </div>
      {registered && <EducationalEmptyState title="No paid lessons available yet" why="Your free account is ready." action="Choose a learning plan to unlock paid lessons, or open Practice Trading to use the free simulator." where="Plans are on the Pricing page. Practice is in the top navigation." href="/pricing" actionLabel="View learning plans" />}
      <div className="space-y-3">
        {tiers.map(({ key, label }) => <TierSection key={key} tierKey={key} label={label} modules={groups.get(key) ?? []} registered={registered} />)}
        {Array.from(groups.entries()).filter(([key]) => !tiers.some((tier) => tier.key === key)).map(([key, items]) => (
          <TierSection key={key} tierKey={key} label={key.replace(/_/g, " ")} modules={items} registered={registered} />
        ))}
      </div>
    </section>
  );
}
