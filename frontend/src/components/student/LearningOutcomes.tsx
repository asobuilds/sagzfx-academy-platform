"use client";

import { useId, useState } from "react";

export default function LearningOutcomes({ outcomes, compact = false }: { outcomes: string[]; compact?: boolean }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  if (!outcomes.length) return null;
  const list = (
    <>
      <p className="mt-2 text-sm leading-relaxed text-slate-300">These are the ideas you should be able to explain after studying this lesson.</p>
      <ul className="mt-4 list-disc space-y-3 pl-5 text-sm leading-relaxed text-slate-200">
        {outcomes.map((outcome, index) => <li key={index}>{outcome}</li>)}
      </ul>
    </>
  );
  if (compact) return (
    <section className="glass rounded-2xl p-5 lg:hidden">
      <h2><button type="button" aria-expanded={open} aria-controls={id} onClick={() => setOpen((value) => !value)} className="flex min-h-11 w-full items-center justify-between text-left font-semibold focus-visible:outline-2 focus-visible:outline-cyan-400">What you&apos;ll learn <span aria-hidden="true">{open ? "−" : "+"}</span></button></h2>
      <div id={id} hidden={!open}>{list}</div>
    </section>
  );
  return (
    <aside aria-label="Learning outcomes" className="glass-strong rounded-2xl p-6">
      <h2 className="text-lg font-semibold">What you&apos;ll learn</h2>
      {list}
    </aside>
  );
}
