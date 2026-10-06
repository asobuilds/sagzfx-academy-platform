"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ApiError, clearTokens, endpoints, getToken, type ModuleSummary } from "@/lib/api";

type ModuleDetail = ModuleSummary & { video_url_slug: string | null };

export default function ModulePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [module, setModule] = useState<ModuleDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!getToken()) { router.push("/login"); return; }
    endpoints.module(params.id)
      .then(setModule)
      .catch((err) => {
        if (err instanceof ApiError && err.status === 401) {
          clearTokens(); router.push("/login"); return;
        }
        setError(err instanceof ApiError ? String(err.detail) : "Unable to load module.");
      });
  }, [params.id, router]);

  if (error) return <section className="max-w-3xl mx-auto px-4 py-16 space-y-5"><span className="pill pill-red">Locked</span><h1 className="text-3xl font-bold">Module unavailable</h1><p>{error}</p><Link className="text-cyan-700 font-semibold" href="/dashboard">← Back to dashboard</Link></section>;
  if (!module) return <section className="px-4 py-16 text-center">Loading module…</section>;

  return (
    <section className="max-w-5xl mx-auto px-4 md:px-8 py-12 space-y-8">
      <Link className="text-cyan-700 font-semibold" href="/dashboard">← Dashboard</Link>
      <div className="space-y-3">
        <span className="pill pill-green">{module.tier_level}</span>
        <h1 className="text-3xl md:text-5xl font-bold">{module.title}</h1>
        <p className="font-mono text-sm" style={{ color: "var(--text-muted)" }}>{module.module_id}</p>
      </div>
      {module.video_url_slug ? (
        <div className="glass-strong rounded-3xl p-4 md:p-6">
          <div className="aspect-video rounded-2xl overflow-hidden bg-slate-100">
            <iframe
              className="w-full h-full"
              src={module.video_url_slug}
              title={module.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      ) : (
        <div className="glass rounded-2xl p-6">Video for this module has not been published yet.</div>
      )}
    </section>
  );
}
