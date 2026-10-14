"use client";

import { useState } from "react";

type Props = {
  videoId: string;
  label: string;
  className?: string;
};

export default function VideoModal({ videoId, label, className = "" }: Props) {
  const [open, setOpen] = useState(false);

  if (!videoId) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`inline-flex items-center gap-3 px-6 py-3 rounded-xl glass hover-lift font-semibold ${className}`}
      >
        <span className="w-8 h-8 rounded-full brand-gradient flex items-center justify-center shrink-0">
          <svg width="12" height="14" viewBox="0 0 12 14" fill="white">
            <path d="M0 0 L12 7 L0 14 Z" />
          </svg>
        </span>
        <span>{label}</span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: "rgba(5, 11, 20, 0.92)" }}
          onClick={() => setOpen(false)}
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close"
            className="absolute top-4 right-4 w-10 h-10 rounded-full glass flex items-center justify-center text-2xl leading-none"
            style={{ color: "var(--text-on-dark)" }}
          >
            ×
          </button>

          <div
            className="w-full max-w-4xl aspect-video rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            style={{ background: "#000" }}
          >
            <iframe
              className="w-full h-full"
              src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1`}
              title={label}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </>
  );
}
