"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  endpoints,
  clearTokens,
  ApiError,
  type User,
  type CatalogResponse,
  type ModuleSummary,
  type BrandInfo,
} from "@/lib/api";

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
  const [realtime, setRealtime] = useState<RealtimeConfig | null>(null);
  const [brand, setBrand] = useState<BrandInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      endpoints.me(),
      endpoints.catalog(),
      endpoints.realtimeConfig(),
      endpoints.brand(),
    ])
      .then(([u, c, r, b]) => {
        setUser(u);
        setCatalog(c);
        setRealtime(r);
        setBrand(b);
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

  // ─── Loading ────────────────────────────────────────────
  if (loading) {
    return (
      <section className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="glass rounded-2xl p-8 animate-pulse">
          <p style={{ color: "var(--text-secondary)" }}>Loading dashboard…</p>
        </div>
      </section>
    );
  }

  // ─── Error ──────────────────────────────────────────────
  if (error || !user || !catalog || !realtime || !brand) {
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
  const tierPill =
    tier === "masters"
      ? "pill-gold"
      : tier === "advanced"
        ? "pill-blue"
        : tier === "beginner"
          ? "pill-green"
          : "pill-red";
  const tierLabel =
    tier === "masters"
      ? "Masters & One-on-One"
      : tier === "advanced"
        ? "Advanced Student"
        : tier === "beginner"
          ? "Beginner Student"
          : "Registered Account";

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
            <p style={{ color: "var(--text-secondary)" }}>{user.email}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/practice"
              className="px-6 py-3 rounded-xl glass hover-lift font-semibold"
            >
              Open Practice Trading →
            </Link>
            {tier !== "masters" && (
              <Link
                href="/pricing"
                className="px-6 py-3 rounded-xl brand-gradient text-white font-semibold hover-lift shadow-lg shadow-blue-900/40"
              >
                {tier === "registered" ? "Choose a class →" : "Upgrade →"}
              </Link>
            )}
          </div>
        </div>

        {/* Progress strip */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 pt-4">
          <StatBox
            label="Modules Unlocked"
            value={`${catalog.unlocked_count} / ${catalog.total}`}
          />
          <StatBox label="Community" value={realtime.channel} mono />
          <StatBox label="Plan" value={tier.toUpperCase()} />
          <StatBox
            label="Class Ends"
            value={
              user.class_expires_at
                ? new Date(user.class_expires_at).toLocaleDateString()
                : "Not active"
            }
          />
          <StatBox label="Practice Account" value="Free $10,000" />
        </div>
      </div>

      {/* ─── Exness partner link ────────────────────────── */}
      <div className="glass rounded-3xl p-8 space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">
          Exness Partner Link
        </h2>
        <p style={{ color: "var(--text-secondary)" }}>
          Visit the Exness partner page if you wish to explore its brokerage
          services. This link does not provide an MT5 demo account through SAGZFX.
        </p>
        {brand.exness_ib_link ? (
          <a
            href={brand.exness_ib_link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:text-cyan-300 text-sm break-all"
          >
            {brand.exness_ib_link}
          </a>
        ) : (
          <p style={{ color: "var(--text-muted)" }}>
            Partner link is currently unavailable.
          </p>
        )}
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
              <span
                className="text-xs font-normal"
                style={{ color: "var(--text-muted)" }}
              >
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

function StatBox({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="glass rounded-xl p-4 space-y-1">
      <div
        className="text-xs uppercase tracking-wider"
        style={{ color: "var(--text-muted)" }}
      >
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

  if (isLocked) {
    return (
      <div className="glass rounded-2xl p-5 space-y-3 opacity-60 cursor-not-allowed">
        <div className="flex items-center justify-between">
          <span
            className="text-xs font-mono"
            style={{ color: "var(--text-muted)" }}
          >
            {module.module_id}
          </span>
          <span className="pill pill-red">🔒 Locked</span>
        </div>
        <h4 className="text-base font-semibold leading-snug opacity-70">
          {module.title}
        </h4>
        <div className="h-1 rounded-full bg-black/40 overflow-hidden">
          <div className="h-full bg-slate-700" style={{ width: "0%" }} />
        </div>
      </div>
    );
  }

  return (
    <Link
      href={`/module/${module.module_id}`}
      className="block glass rounded-2xl p-5 space-y-3 hover-lift cursor-pointer"
    >
      <div className="flex items-center justify-between">
        <span
          className="text-xs font-mono"
          style={{ color: "var(--text-muted)" }}
        >
          {module.module_id}
        </span>
        <span className="pill pill-green">Open</span>
      </div>
      <h4 className="text-base font-semibold leading-snug">{module.title}</h4>
      <span className="text-sm text-cyan-400 font-semibold">
        Open module →
      </span>
    </Link>
  );
}