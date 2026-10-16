"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { endpoints, ApiError, type User, type CatalogResponse, type BrandInfo } from "@/lib/api";
import PageIntro from "@/components/educational/PageIntro";
import HowToGuide from "@/components/educational/HowToGuide";
import NextStepCue from "@/components/educational/NextStepCue";
import PrimaryLearningAction from "@/components/student/PrimaryLearningAction";
import LearningPlanSummary from "@/components/student/LearningPlanSummary";
import CurriculumSection from "@/components/student/CurriculumSection";

type RealtimeConfig = {
  supabase_url: string | null;
  supabase_anon_key: string | null;
  channel: string;
  access_tier: string;
};

type DashboardData = {
  user: User;
  catalog: CatalogResponse;
  realtime: RealtimeConfig | null;
  brand: BrandInfo | null;
};

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  const load = useCallback(async (signal: AbortSignal) => {
    setLoading(true);
    setError(null);
    try {
      const [user, catalog] = await Promise.all([endpoints.me(), endpoints.catalog()]);
      if (signal.aborted) return;
      const [realtimeResult, brandResult] = await Promise.allSettled([
        endpoints.realtimeConfig(),
        endpoints.brand(),
      ]);
      if (signal.aborted) return;
      setData({
        user,
        catalog,
        realtime: realtimeResult.status === "fulfilled" ? realtimeResult.value : null,
        brand: brandResult.status === "fulfilled" ? brandResult.value : null,
      });
    } catch (err) {
      if (signal.aborted) return;
      if (err instanceof ApiError && err.status === 401) {
        router.replace("/login");
        return;
      }
      setError("We couldn't load your dashboard right now. Check your connection and try again.");
    } finally {
      if (!signal.aborted) setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    const controller = new AbortController();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load(controller.signal);
    return () => controller.abort();
  }, [load, attempt]);

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl space-y-5 px-4 py-8 md:px-8 md:py-12" aria-busy="true" aria-label="Loading dashboard">
        <div className="h-9 w-64 animate-pulse rounded-xl bg-white/10" />
        <div className="h-5 w-full max-w-lg animate-pulse rounded-lg bg-white/10" />
        <div className="h-32 animate-pulse rounded-2xl bg-white/10" />
        <div className="h-44 animate-pulse rounded-3xl bg-white/10" />
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
        <div role="alert" className="glass-strong w-full max-w-md space-y-4 rounded-2xl p-6 text-center">
          <h1 className="text-xl font-semibold">Dashboard unavailable</h1>
          <p className="text-sm leading-relaxed text-slate-300">{error ?? "We couldn't load your dashboard right now."}</p>
          <button type="button" onClick={() => setAttempt((value) => value + 1)} className="brand-gradient min-h-11 rounded-xl px-6 py-3 font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400">Try again</button>
        </div>
      </main>
    );
  }

  const { user, catalog, realtime, brand } = data;
  const registered = catalog.access_tier === "registered";
  const firstModule = catalog.modules.filter((module) => module.unlocked).sort((a, b) => a.sort_order - b.sort_order)[0];
  const firstLessonId = firstModule?.module_id ?? null;
  const firstLessonHref = firstLessonId ? `/module/${encodeURIComponent(firstLessonId)}` : null;

  return (
    <main className="mx-auto max-w-7xl space-y-8 px-4 py-8 md:space-y-10 md:px-8 md:py-12">
      <PageIntro title="Your learning dashboard" description="This is where you find your lessons, check your class access, and open your practice account.">
        <p className="text-xs text-slate-400">Signed in as {user.full_name}</p>
      </PageIntro>
      <HowToGuide storageKey="dashboard" steps={[
        "Check your learning plan and class end date.",
        "Open an available lesson from your learning path.",
        "Read the lesson and answer its checkpoint question.",
        "Use Practice Trading to try what you have learned with virtual money.",
      ]} />
      <PrimaryLearningAction isRegistered={registered} firstLessonId={firstLessonId} />
      <LearningPlanSummary unlockedCount={catalog.unlocked_count} total={catalog.total} tier={catalog.access_tier} classEnds={user.class_expires_at} community={realtime?.channel ?? null} />
      <CurriculumSection modules={catalog.modules} registered={registered} />
      <section className="glass space-y-3 rounded-2xl p-5 sm:p-6" aria-labelledby="exness-title">
        <h2 id="exness-title" className="text-lg font-semibold">Ready for a real Exness account?</h2>
        <p className="max-w-3xl text-sm leading-relaxed text-slate-300">If you want to explore live brokerage services, you can visit Exness through the SAGZFX partner link. A live account involves financial risk and does not change your SAGZFX learning access.</p>
        {brand?.exness_ib_link ? (
          <a href={brand.exness_ib_link} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center text-sm font-semibold text-cyan-300 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400">Visit Exness partner page ↗</a>
        ) : (
          <p className="text-sm text-slate-400">The Exness partner link is currently unavailable.</p>
        )}
      </section>
      <NextStepCue
        message={registered
          ? "Compare the learning plans and choose the level that matches what you want to study."
          : "Open your first available lesson and answer its checkpoint question."}
        href={registered || !firstLessonHref ? "/pricing" : firstLessonHref}
        linkLabel={registered || !firstLessonHref ? "View plans" : "Open lesson"}
        fallback="Your available lessons are not listed right now. Check the learning plans for more information."
      />
    </main>
  );
}
