import Link from "next/link";

export default function AssignmentPanel({ assignment }: { assignment: string }) {
  return (
    <section id="assignment" aria-labelledby="assignment-heading" className="rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-5 sm:p-7">
      <p className="text-xs font-bold uppercase tracking-widest text-emerald-200">Apply what you learned</p>
      <h2 id="assignment-heading" className="mt-2 text-xl font-bold">Practice assignment</h2>
      <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-200">{assignment}</p>
      <p className="mt-4 text-sm text-slate-300">This is not live trading. Use the SAGZFX Practice Account to try this. A trading setup can fail.</p>
      <Link href="/practice" className="mt-4 inline-flex min-h-11 items-center rounded-xl border border-emerald-400/40 px-4 py-2 text-sm font-semibold text-emerald-200 hover:bg-emerald-400/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400">Open Practice Trading →</Link>
    </section>
  );
}
