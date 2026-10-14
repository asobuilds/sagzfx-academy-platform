"use client";

import { useState } from "react";
import { galleryFull, galleryThumb, type MediaItem } from "@/lib/media";

type Props = {
  items: MediaItem[];
  /** Number of columns on desktop. Default 3. */
  columns?: 2 | 3 | 4;
};

export default function MediaGallery({ items, columns = 3 }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [broken, setBroken] = useState<Record<string, boolean>>({});

  const colClass =
    columns === 2
      ? "md:grid-cols-2"
      : columns === 4
        ? "md:grid-cols-2 lg:grid-cols-4"
        : "md:grid-cols-2 lg:grid-cols-3";

  if (items.length === 0) {
    return (
      <div className="glass rounded-2xl p-8 text-center">
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Photos coming soon.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className={`grid grid-cols-1 ${colClass} gap-5`}>
        {items.map((item, idx) => {
          const isBroken = broken[item.name];
          return (
            <button
              key={item.name}
              type="button"
              onClick={() => !isBroken && setOpenIndex(idx)}
              className="glass rounded-2xl overflow-hidden hover-lift text-left relative group"
              disabled={isBroken}
            >
              <div
                className="aspect-[4/3] relative overflow-hidden"
                style={{ background: "rgba(5, 11, 20, 0.5)" }}
              >
                {isBroken ? (
                  <div className="absolute inset-0 flex items-center justify-center text-xs" style={{ color: "var(--text-muted)" }}>
                    Photo unavailable
                  </div>
                ) : (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={galleryThumb(item.name)}
                    alt={item.caption}
                    loading="lazy"
                    className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                    onError={() =>
                      setBroken((prev) => ({ ...prev, [item.name]: true }))
                    }
                  />
                )}
              </div>
              <div className="p-4 space-y-1">
                <span className="pill pill-blue">{item.category}</span>
                <p
                  className="text-sm leading-snug pt-1"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {item.caption}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {openIndex !== null && (
        <Lightbox
          items={items}
          index={openIndex}
          onClose={() => setOpenIndex(null)}
          onPrev={() =>
            setOpenIndex((i) =>
              i === null ? null : (i - 1 + items.length) % items.length,
            )
          }
          onNext={() =>
            setOpenIndex((i) => (i === null ? null : (i + 1) % items.length))
          }
        />
      )}
    </>
  );
}

// ─── Lightbox ────────────────────────────────────────────

function Lightbox({
  items,
  index,
  onClose,
  onPrev,
  onNext,
}: {
  items: MediaItem[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const item = items[index];
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: "rgba(5, 11, 20, 0.92)" }}
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute top-4 right-4 w-10 h-10 rounded-full glass flex items-center justify-center text-2xl leading-none"
        style={{ color: "var(--text-on-dark)" }}
      >
        ×
      </button>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
        }}
        aria-label="Previous"
        className="absolute left-4 w-12 h-12 rounded-full glass flex items-center justify-center text-2xl"
        style={{ color: "var(--text-on-dark)" }}
      >
        ‹
      </button>

      <div
        className="max-w-5xl w-full space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={galleryFull(item.name)}
          alt={item.caption}
          className="w-full max-h-[75vh] object-contain rounded-2xl"
        />
        <p
          className="text-center text-sm"
          style={{ color: "var(--text-secondary)" }}
        >
          {item.caption}
        </p>
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        aria-label="Next"
        className="absolute right-4 w-12 h-12 rounded-full glass flex items-center justify-center text-2xl"
        style={{ color: "var(--text-on-dark)" }}
      >
        ›
      </button>
    </div>
  );
}
