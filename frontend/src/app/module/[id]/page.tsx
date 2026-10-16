"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  endpoints,
  clearTokens,
  ApiError,
  type ModuleDetail,
  type CatalogResponse,
} from "@/lib/api";
import Markdown from "@/components/Markdown";

export default function ModulePage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const moduleId = params?.id;

  const [module, setModule] = useState<ModuleDetail | null>(null);
  const [catalog, setCatalog] = useState<CatalogResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [locked, setLocked] = useState(false);

  // Checkpoint quiz state
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (!moduleId) return;

    // Auth is cookie-only: the API's 401 below is the gate, not a local check.
    Promise.all([endpoints.module(moduleId), endpoints.catalog()])
      .then(([m, c]) => {
        setModule(m);
        setCatalog(c);
      })
      .catch((err) => {
        if (err instanceof ApiError && err.status === 401) {
          clearTokens();
          router.push("/login");
          return;
        }
        if (err instanceof ApiError && err.status === 403) {
          setLocked(true);
          setError(
            typeof err.detail === "string"
              ? err.detail
              : "This module is not available on your current plan.",
          );
          return;
        }
        setError("Failed to load module. Please try again.");
      })
      .finally(() => setLoading(false));
  }, [moduleId, router]);

  // ─── Loading ────────────────────────────────────────────
  if (loading) {
    return (
      <section className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="glass rounded-2xl p-8 animate-pulse">
          <p style={{ color: "var(--text-secondary)" }}>Loading lesson…</p>
        </div>
      </section>
    );
  }

  // ─── Locked ─────────────────────────────────────────────
  if (locked) {
    return (
      <section className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
        <div className="glass-strong rounded-3xl p-10 max-w-lg text-center space-y-6">
          <span className="pill pill-red">🔒 Locked</span>
          <h1
            className="text-3xl font-bold tracking-tight"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Unlock this module
          </h1>
          <p style={{ color: "var(--text-secondary)" }}>{error}</p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <Link
              href="/pricing"
              className="px-6 py-3 rounded-xl brand-gradient text-white font-semibold hover-lift shadow-lg shadow-blue-900/40"
            >
              View Pricing
            </Link>
            <Link
              href="/dashboard"
              className="px-6 py-3 rounded-xl glass hover-lift font-semibold"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // ─── Error ──────────────────────────────────────────────
  if (error || !module) {
    return (
      <section className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
        <div className="glass-strong rounded-3xl p-10 max-w-lg text-center space-y-6">
          <span className="pill pill-red">Error</span>
          <p>{error ?? "Something went wrong."}</p>
          <Link
            href="/dashboard"
            className="px-6 py-3 rounded-xl brand-gradient text-white font-semibold hover-lift inline-block"
          >
            Back to Dashboard
          </Link>
        </div>
      </section>
    );
  }

  // ─── Navigation — find prev/next ────────────────────────
  const allModules = catalog?.modules ?? [];
  const currentIdx = allModules.findIndex((m) => m.module_id === module.module_id);
  const prev = currentIdx > 0 ? allModules[currentIdx - 1] : null;
  const next =
    currentIdx >= 0 && currentIdx < allModules.length - 1
      ? allModules[currentIdx + 1]
      : null;

  const checkpoint = module.checkpoint_questions;

  return (
    <section className="px-4 md:px-8 py-10 max-w-7xl mx-auto">
      {/* ─── Breadcrumbs ─────────────────────────────────── */}
      <div className="flex items-center gap-2 text-sm mb-6" style={{ color: "var(--text-muted)" }}>
        <Link href="/dashboard" className="hover:text-cyan-400 transition">
          Dashboard
        </Link>
        <span>›</span>
        <span>{module.tier_level}</span>
        <span>›</span>
        <span className="text-cyan-400">{module.module_id}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* ─── Main column ───────────────────────────────── */}
        <div className="lg:col-span-8 space-y-8">
          {/* Header */}
          <header className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span
                className={
                  module.tier_level === "Beginner"
                    ? "pill pill-green"
                    : module.tier_level === "Market Structure"
                      ? "pill pill-blue"
                      : module.tier_level === "Advanced"
                        ? "pill pill-gold"
                        : "pill pill-red"
                }
              >
                {module.tier_level}
              </span>
              {module.estimated_minutes && (
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                  ~{module.estimated_minutes} min
                </span>
              )}
              {module.lesson_status && (
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                  · {module.lesson_status}
                </span>
              )}
            </div>

            <h1
              className="text-4xl md:text-5xl font-bold tracking-tight"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              {module.title}
            </h1>
          </header>

          {/* Video placeholder */}
          <div className="glass-strong rounded-3xl p-6 md:p-8">
            <div
              className="aspect-video rounded-2xl flex items-center justify-center relative overflow-hidden"
              style={{
                background:
                  "linear-gradient(135deg, rgba(14, 165, 233, 0.15) 0%, rgba(30, 64, 175, 0.15) 100%)",
                border: "1px solid var(--border-subtle)",
              }}
            >
              <div className="text-center space-y-3">
                <div className="w-16 h-16 rounded-full brand-gradient flex items-center justify-center mx-auto shadow-2xl shadow-blue-900/40">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                  Video lesson coming soon
                </p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  The full recording will appear here
                </p>
              </div>
            </div>
          </div>

          {/* Lesson body */}
          {module.lesson_body && (
            <article className="glass rounded-3xl p-6 md:p-10">
              <Markdown content={module.lesson_body} />
            </article>
          )}

          {/* Checkpoint quiz */}
          {checkpoint && (
            <div className="glass-strong rounded-3xl p-6 md:p-8 space-y-6">
              <div className="flex items-center gap-3">
                <span className="pill pill-gold">Checkpoint</span>
                <h3
                  className="text-xl font-bold"
                  style={{ fontFamily: "var(--font-space-grotesk)" }}
                >
                  Test your understanding
                </h3>
              </div>

              <p className="text-base leading-relaxed">{checkpoint.prompt}</p>

              <div className="space-y-3">
                {checkpoint.options.map((opt, idx) => {
                  const letter = String.fromCharCode(65 + idx); // A, B, C, D
                  const isSelected = selectedAnswer === idx;
                  const isCorrect = idx === checkpoint.correct_index;
                  const showState = revealed && isSelected;

                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        if (!revealed) setSelectedAnswer(idx);
                      }}
                      className="w-full text-left p-4 rounded-xl glass hover-lift transition flex items-start gap-3"
                      style={{
                        borderColor: showState
                          ? isCorrect
                            ? "var(--signal-green-bright)"
                            : "var(--alert-red)"
                          : "var(--border-subtle)",
                        opacity: revealed && !isSelected ? 0.6 : 1,
                      }}
                    >
                      <span
                        className="w-7 h-7 shrink-0 rounded-lg flex items-center justify-center text-sm font-bold"
                        style={{
                          background:
                            showState && isCorrect
                              ? "var(--signal-green)"
                              : showState && !isCorrect
                                ? "var(--alert-red)"
                                : "rgba(255,255,255,0.05)",
                        }}
                      >
                        {letter}
                      </span>
                      <span className="text-sm leading-relaxed">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {!revealed ? (
                <button
                  onClick={() => setRevealed(true)}
                  disabled={selectedAnswer === null}
                  className="w-full py-3 rounded-xl brand-gradient text-white font-semibold hover-lift disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {selectedAnswer === null ? "Select an answer" : "Check answer"}
                </button>
              ) : (
                <div
                  className="rounded-xl p-4 space-y-2"
                  style={{
                    background:
                      selectedAnswer === checkpoint.correct_index
                        ? "rgba(34, 197, 94, 0.1)"
                        : "rgba(220, 38, 38, 0.1)",
                    border: `1px solid ${selectedAnswer === checkpoint.correct_index ? "rgba(34,197,94,0.3)" : "rgba(220,38,38,0.3)"}`,
                  }}
                >
                  <p className="font-semibold">
                    {selectedAnswer === checkpoint.correct_index
                      ? "✅ Correct"
                      : "❌ Not quite"}
                  </p>
                  <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                    {checkpoint.explanation}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Prev / Next navigation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            {prev ? (
              <Link
                href={`/module/${prev.module_id}`}
                className="glass rounded-2xl p-5 hover-lift transition text-left space-y-1"
              >
                <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                  ← Previous
                </div>
                <div className="font-semibold text-sm">{prev.title}</div>
              </Link>
            ) : (
              <div />
            )}
            {next ? (
              <Link
                href={`/module/${next.module_id}`}
                className="glass rounded-2xl p-5 hover-lift transition text-right space-y-1"
              >
                <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                  Next →
                </div>
                <div className="font-semibold text-sm">{next.title}</div>
              </Link>
            ) : (
              <div />
            )}
          </div>
        </div>

        {/* ─── Sidebar ───────────────────────────────────── */}
        <aside className="lg:col-span-4 space-y-6">
          {/* Learning outcomes */}
          {module.learning_outcomes.length > 0 && (
            <div className="glass-strong rounded-3xl p-6 space-y-4">
              <span className="pill pill-blue">What You&apos;ll Learn</span>
              <ul className="space-y-3">
                {module.learning_outcomes.map((o, i) => (
                  <li key={i} className="flex gap-3 text-sm leading-relaxed">
                    <span
                      className="w-1.5 h-1.5 rounded-full mt-2 shrink-0"
                      style={{ background: "var(--signal-green-bright)" }}
                    />
                    <span style={{ color: "var(--text-secondary)" }}>{o}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Practice assignment */}
          {module.assignment && (
            <div className="glass rounded-3xl p-6 space-y-3">
              <span className="pill pill-green">Practice</span>
              <h4 className="font-semibold text-sm">Assignment</h4>
              <div
                className="text-sm leading-relaxed whitespace-pre-wrap"
                style={{ color: "var(--text-secondary)" }}
              >
                {module.assignment.length > 400
                  ? module.assignment.slice(0, 400) + "…"
                  : module.assignment}
              </div>
            </div>
          )}

          {/* Return to dashboard */}
          <Link
            href="/dashboard"
            className="block text-center px-6 py-3 rounded-xl glass hover-lift font-semibold text-sm"
          >
            ← Back to Dashboard
          </Link>
        </aside>
      </div>
    </section>
  );
}
