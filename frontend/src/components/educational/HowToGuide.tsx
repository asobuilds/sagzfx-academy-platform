"use client";

import { useEffect, useId, useState } from "react";

type HowToGuideProps = {
  steps: readonly string[];
  title?: string;
  storageKey: string;
  defaultOpen?: boolean;
  className?: string;
};

export default function HowToGuide({
  steps, title = "How to use this page", storageKey, defaultOpen = true, className = "",
}: HowToGuideProps) {
  const [open, setOpen] = useState(defaultOpen);
  const contentId = useId();

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(`sagzfx:guide:${storageKey}`);
      if (saved === "open" || saved === "closed") {
        // Restore preference after mount; no storage access during SSR.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setOpen(saved === "open");
      }
    } catch {
      // Storage may be blocked; the guide still works for this visit.
    }
  }, [storageKey]);

  const toggle = () => {
    const next = !open;
    setOpen(next);
    try {
      window.localStorage.setItem(`sagzfx:guide:${storageKey}`, next ? "open" : "closed");
    } catch {
      // Keep the in-memory state if storage is unavailable.
    }
  };

  return (
    <section className={`rounded-2xl border p-4 sm:p-5 ${className}`}
      style={{ background: "var(--bg-glass)", borderColor: "var(--border-subtle)" }}
      aria-label={title}>
      <h2 className="text-sm font-semibold">
        <button type="button" aria-expanded={open} aria-controls={contentId}
          onClick={toggle}
          className="flex w-full items-center justify-between gap-4 rounded-md text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-400">
          <span>{title}</span>
          <span aria-hidden="true" className="text-cyan-300">{open ? "−" : "+"}</span>
        </button>
      </h2>
      <div id={contentId} hidden={!open}>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed" style={{ color: "var(--text-on-dark-secondary)" }}>
          {steps.map((step, index) => <li key={index}>{step}</li>)}
        </ol>
      </div>
    </section>
  );
}
