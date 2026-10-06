"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  endpoints,
  getToken,
  clearTokens,
  ApiError,
  type User,
  type CatalogResponse,
  type ModuleSummary,
} from "@/lib/api";

type MT5Status = {
  bound: boolean;
  login: string | null;
  server: string | null;
  exness_ib_link: string;
};

type RealtimeConfig = {
  supabase_url: string | null;
  supabase_anon_key: string | null;
  channel: string;
  access_tier: string;
};

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [catalog, setCatalog] = useState<CatalogResponse | null>(null);
  const [mt5, setMt5] = useState<MT5Status | null>(null);
  const [realtime, setRealtime] = useState<RealtimeConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!getToken()) {
      router.push("/login");
      return;
    }

    Promise.all([
      endpoints.me(),
      endpoints.catalog(),
      endpoints.mt5Status(),
      endpoints.realtimeConfig(),
    ])
      .then(([u, c, m, r]) => {
        setUser(u);
        setCatalog(c);
        setMt5(m);
        setRealtime(r);
      })
      .catch((err) => {
        if (err instanceof ApiError && err.status === 401) {
          clearTokens();
          router.push("/login");
          return;
        }
        setError("Failed to load dashboard. Is the backend running?");
      })
      .finally(() => setLoading(false));
  }, [router]);

  // ─── Loading state ─────────────────────────────────────
  if (loading) {
    return (
      <section className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="glass rounded-2xl p-8 animate-pulse">
          <p style={{ color: "var(--text-secondary)" }}>Loading dashboard…</p>
        </div>
      </section>
    );
  }

  // ─── Error state ───────────────────────────────────────
  if (error || !user || !catalog || !mt5 || !realtime) {
    return (
      <section className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
        <div className="glass-strong rounded-2xl p-8 max-w-md text-center space-y-4">
          <span className="pill pill-red">Error</span>
          <p>{error ?? "Something went wrong."}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 rounded-xl brand-gradient text-white font-semibold"
          >
            Try again
          </button>
        </div>
      </section>
    );
  }

  const tier = catalog.access_tier;
  const tierPill = tier === "masters" ? "pill-gold" : tier === "advanced" ? "pill-blue" : tier === "beginner" ? "pill-green" : "pill-red";
  const tierLabel = tier === "masters" ? "Masters & One-on-One" : tier === "advanced" ? "Advanced Student" : tier === "beginner" ? "Beginner Student" : "Registered Account";

  // Group modules by tier_level
  const modulesByTier = catalog.modules.reduce<Record<string, ModuleSummary[]>>(
    (acc, m) => {
      (acc[m.tier_level] ||= []).push(m);
      return acc;
    },
    {},
  );

  return (
    <section className="px-4 md:px-8 py-12 max-w-7xl mx-auto space-y-12">

      {/* ─── Welcome header ──────────────────────────────── */}
      <div className="glass-strong rounded-3xl p-8 md:p-10 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2">
            <span className={`pill ${tierPill}`}>{tierLabel}</span>
            <h1
              className="text-3xl md:text-5xl font-bold tracking-tight"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              Welcome back,{" "}
              <span className="text-gradient">
                {user.full_name.split(" ")[0]}
              </span>
            </h1>
            <p style={{ color: "var(--text-secondary)" }}>
              {user.email}
            </p>
          </div>

          {tier !== "masters" && (
            <Link
              href="/pricing"
              className="px-6 py-3 rounded-xl brand-gradient text-white font-semibold hover-lift shadow-lg shadow-blue-500/20"
            >
              {tier === "registered" ? "Choose a class →" : "Upgrade →"}
            </Link>
          )}
        </div>

        {/* Progress strip */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 pt-4">
          <StatBox label="Modules Unlocked" value={`${catalog.unlocked_count} / ${catalog.total}`} />
          <StatBox label="Community" value={realtime.channel} mono />
          <StatBox
            label="MT5 Demo"
            value={mt5.bound ? (mt5.login ?? "Bound") : "Not activated"}
            mono={mt5.bound}
          />
          <StatBox label="Plan" value={tier.toUpperCase()} />
          <StatBox label="Class Ends" value={user.class_expires_at ? new Date(user.class_expires_at).toLocaleDateString() : "Not active"} />
          <StatBox label="Mentorship" value={user.mentorship_lifetime ? "Lifetime" : "Not active"} />
        </div>
      </div>

      {/* ─── MT5 Card ────────────────────────────────────── */}
      <div className="glass hover-lift rounded-3xl p-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl brand-gradient flex items-center justify-center font-bold text-white">
              MT5
            </div>
            <div>
              <h2
                className="text-2xl font-bold tracking-tight"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                Exness Demo Sandbox
              </h2>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                Risk-free environment linked to live market feeds
              </p>
            </div>
          </div>

          {mt5.bound ? (
            <div className="flex flex-wrap items-center gap-3">
              <span className="pill pill-green">Active</span>
              <span className="font-mono text-sm glass px-3 py-1.5 rounded-lg">
                {mt5.login}
              </span>
            </div>
          ) : (
            <Link
              href="/dashboard#mt5"
              className="px-6 py-3 rounded-xl brand-gradient text-white font-semibold hover-lift"
            >
              Provision Demo
            </Link>
          )}
        </div>

        <div className="rounded-2xl p-4 border" style={{ background: "rgba(241, 245, 249, 0.9)", borderColor: "var(--border-subtle)" }}>
          <p className="text-xs uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>
            Exness Partner Link
          </p>
          <a
            href={mt5.exness_ib_link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-700 hover:text-cyan-800 font-mono text-sm break-all"
          >
            {mt5.exness_ib_link}
          </a>
          <p className="text-xs pt-2" style={{ color: "var(--text-muted)" }}>
            Open a live Exness account via this link to keep your learning progress and unlock live-market tools.
          </p>
        </div>
      </div>

      {/* ─── Curriculum ──────────────────────────────────── */}
      <div className="space-y-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="pill pill-blue">Curriculum</span>
            <h2
              className="text-3xl md:text-4xl font-bold tracking-tight"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              Your <span className="text-gradient">learning path</span>
            </h2>
          </div>
          <div className="text-sm" style={{ color: "var(--text-muted)" }}>
            {catalog.unlocked_count} of {catalog.total} modules unlocked
          </div>
        </div>

        {Object.entries(modulesByTier).map(([tierName, modules]) => (
          <div key={tierName} className="space-y-4">
            <h3
              className="text-lg font-semibold tracking-tight"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              {tierName}{" "}
              <span className="text-xs font-normal" style={{ color: "var(--text-muted)" }}>
                · {modules.length} modules
              </span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {modules.map((m) => (
                <ModuleCard key={m.module_id} module={m} />
              ))}
            </div>
          </div>
        ))}
      </div>

    </section>
  );
}

// ─── Sub-components ─────────────────────────────────────

function StatBox({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="glass rounded-xl p-4 space-y-1">
      <div className="text-xs uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
        {label}
      </div>
      <div className={`text-lg font-bold ${mono ? "font-mono text-base" : ""}`}>
        {value}
      </div>
    </div>
  );
}

function ModuleCard({ module }: { module: ModuleSummary }) {
  const isLocked = !module.unlocked;

  return (
    <div className="relative">
      {isLocked ? (
        <div className="glass rounded-2xl p-5 space-y-3 relative overflow-hidden opacity-75">

      {/* Tier tag */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
          {module.module_id}
        </span>
        {isLocked ? (
          <span className="pill pill-red">🔒 Locked</span>
        ) : (
          <span className="pill pill-green">Open</span>
        )}
      </div>

      <h4
        className={`text-base font-semibold leading-snug ${isLocked ? "opacity-70" : ""}`}
      >
        {module.title}
      </h4>

      <div className="h-1 rounded-full bg-black/40 overflow-hidden">
        <div className="h-full bg-slate-400" style={{ width: "0%" }} />
      </div>
        </div>
      ) : (
        <Link href={`/module/${module.module_id}`} className="block glass rounded-2xl p-5 space-y-3 hover-lift">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>{module.module_id}</span>
            <span className="pill pill-green">Open</span>
          </div>
          <h4 className="text-base font-semibold leading-snug">{module.title}</h4>
          <span className="text-sm text-cyan-700 font-semibold">Open module →</span>
        </Link>
      )}
    </div>
  );
}
