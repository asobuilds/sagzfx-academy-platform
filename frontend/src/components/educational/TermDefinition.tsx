"use client";

import { useEffect, useId, useRef, useState } from "react";
import { getDefinition, type GlossaryKey } from "@/lib/glossary";

type Props = {
  term: string;
  glossaryKey: GlossaryKey;
  inline?: boolean;
};

export default function TermDefinition({ term, glossaryKey, inline = true }: Props) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const root = useRef<HTMLSpanElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        trigger.current?.focus();
      }
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  return (
    <span ref={root} className="relative inline">
      <span>{term}</span>{" "}
      <button
        ref={trigger}
        type="button"
        aria-label={`Explain ${term}`}
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((current) => !current)}
        onFocus={() => setOpen(true)}
        className={`inline-flex min-h-6 min-w-6 items-center justify-center rounded-full border border-cyan-400/40 text-cyan-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 ${inline ? "align-middle text-xs" : "relative -top-1 align-baseline text-[10px]"}`}
      >
        ?
      </button>
      {open && (
        <span
          id={id}
          role="tooltip"
          className="absolute bottom-full left-0 z-[80] mb-2 block w-60 max-w-[calc(100vw-2rem)] rounded-xl border border-slate-600 bg-slate-950 p-3 text-left text-sm font-normal leading-relaxed text-slate-100 shadow-xl"
        >
          {getDefinition(glossaryKey)}
        </span>
      )}
    </span>
  );
}
