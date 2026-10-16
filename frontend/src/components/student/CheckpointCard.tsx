"use client";

import { useState } from "react";
import TermDefinition from "@/components/educational/TermDefinition";
import type { ModuleDetail } from "@/lib/api";
import type { GlossaryKey } from "@/lib/glossary";

type Checkpoint = NonNullable<ModuleDetail["checkpoint_questions"]>;
const terms: { pattern: RegExp; key: GlossaryKey }[] = [
  { pattern: /\bbase currency\b/i, key: "base-currency" },
  { pattern: /\bquote currency\b/i, key: "quote-currency" },
  { pattern: /\bcurrency pair\b/i, key: "currency-pair" },
  { pattern: /\bstop.loss\b/i, key: "stop-loss" },
  { pattern: /\blot size\b/i, key: "lot-size" },
  { pattern: /\bentry price\b/i, key: "entry-price" },
  { pattern: /\bspread\b/i, key: "spread" },
  { pattern: /\bforex\b/i, key: "forex" },
  { pattern: /\bpips?\b/i, key: "pip" },
  { pattern: /\bposition\b/i, key: "position" },
];

function PromptWithDefinition({ prompt }: { prompt: string }) {
  const matches = terms.map(({ pattern, key }) => ({ match: pattern.exec(prompt), key }))
    .filter((item): item is { match: RegExpExecArray; key: GlossaryKey } => item.match !== null)
    .sort((a, b) => a.match.index - b.match.index);
  const first = matches[0];
  if (!first) return <>{prompt}</>;
  const { match, key } = first;
  return <>{prompt.slice(0, match.index)}<TermDefinition term={match[0]} glossaryKey={key} />{prompt.slice(match.index + match[0].length)}</>;
}

export default function CheckpointCard({ checkpoint, moduleId }: { checkpoint: Checkpoint; moduleId: string }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const correct = selected === checkpoint.correct_index;
  return (
    <section id="checkpoint" aria-labelledby="checkpoint-heading" className="rounded-2xl border border-amber-400/30 bg-amber-400/5 p-5 sm:p-7">
      <p className="text-xs font-bold uppercase tracking-widest text-amber-200">Checkpoint</p>
      <h2 id="checkpoint-heading" className="mt-2 text-xl font-bold">Check your understanding</h2>
      <form onSubmit={(event) => { event.preventDefault(); if (selected !== null) setRevealed(true); }} className="mt-5 space-y-5">
        <fieldset disabled={revealed} className="space-y-3">
          <legend className="mb-4 text-base leading-relaxed text-slate-100"><PromptWithDefinition prompt={checkpoint.prompt} /></legend>
          {checkpoint.options.map((option, index) => (
            <label key={index} className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/15 bg-white/5 p-4 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-cyan-400">
              <input type="radio" name={`checkpoint-${moduleId}`} checked={selected === index} onChange={() => setSelected(index)} className="mt-1 h-4 w-4 shrink-0 accent-cyan-400" />
              <span className="text-sm leading-relaxed text-slate-100"><span className="mr-2 font-semibold">{String.fromCharCode(65 + index)}.</span>{option}</span>
            </label>
          ))}
        </fieldset>
        {!revealed ? (
          <button type="submit" disabled={selected === null} className="brand-gradient min-h-11 rounded-xl px-6 py-3 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 disabled:opacity-50">Check answer</button>
        ) : (
          <div role="status" aria-live="polite" className={`rounded-xl border p-4 text-sm leading-relaxed ${correct ? "border-emerald-400/40 bg-emerald-400/10" : "border-amber-400/40 bg-amber-400/10"}`}>
            <p className="font-semibold">{correct ? "Correct" : "Not quite"}</p>
            <p className="mt-2 text-slate-200">{checkpoint.explanation}</p>
            <button type="button" onClick={() => { setSelected(null); setRevealed(false); }} className="mt-3 min-h-11 font-semibold text-cyan-300 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-cyan-400">Try again</button>
          </div>
        )}
      </form>
    </section>
  );
}
