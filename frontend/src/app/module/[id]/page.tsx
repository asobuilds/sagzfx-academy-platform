"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { endpoints, ApiError, type ModuleDetail, type CatalogResponse } from "@/lib/api";
import LessonHeader from "@/components/student/LessonHeader";
import LessonGuide from "@/components/student/LessonGuide";
import LessonReader from "@/components/student/LessonReader";
import CheckpointCard from "@/components/student/CheckpointCard";
import AssignmentPanel from "@/components/student/AssignmentPanel";
import LessonNavigation from "@/components/student/LessonNavigation";
import LearningOutcomes from "@/components/student/LearningOutcomes";
import NextStepCue from "@/components/educational/NextStepCue";

function videoIdFromSlug(slug: string): string | null {
  const trimmed = slug.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
  try {
    const url = new URL(trimmed);
    const host = url.hostname.toLowerCase();
    if (host === "youtu.be") {
      const id = url.pathname.slice(1);
      return /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
    }
    if (host === "youtube.com" || host === "www.youtube.com" || host === "youtube-nocookie.com" || host === "www.youtube-nocookie.com") {
      const id = url.searchParams.get("v") ?? url.pathname.split("/").filter(Boolean).at(-1) ?? "";
      return /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
    }
  } catch {
    return null;
  }
  return null;
}

function VideoSlot({ slug, title }: { slug: string | null; title: string }) {
  const id = slug ? videoIdFromSlug(slug) : null;
  return (
    <section aria-label="Lesson video" className="space-y-3">
      {id ? (
        <div className="aspect-video overflow-hidden rounded-2xl border border-white/15 bg-black">
          <iframe
            title={`Video lesson: ${title}`}
            src={`https://www.youtube-nocookie.com/embed/${id}`}
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="h-full w-full"
          />
        </div>
      ) : (
        <p className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm leading-relaxed text-slate-300">
          This lesson does not have a video yet. You can still study the written explanation below.
        </p>
      )}
    </section>
  );
}

type LessonData = { lesson: ModuleDetail; catalog: CatalogResponse };

export default function ModulePage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const moduleId = params?.id;
  const [data, setData] = useState<LessonData | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "locked" | "missing" | "error">("loading");

  useEffect(() => {
    if (!moduleId) return;
    let cancelled = false;
    Promise.all([endpoints.module(moduleId), endpoints.catalog()])
      .then(([lesson, catalog]) => {
        if (cancelled) return;
        setData({ lesson, catalog });
        setState("ready");
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 401) {
          router.replace("/login");
        } else if (err instanceof ApiError && err.status === 403) {
          setState("locked");
        } else if (err instanceof ApiError && err.status === 404) {
          setState("missing");
        } else {
          setState("error");
        }
      });
    return () => { cancelled = true; };
  }, [moduleId, router]);

  if (state === "loading") return (
    <main aria-busy="true" aria-label="Loading lesson" className="mx-auto max-w-7xl space-y-5 px-4 py-10 md:px-8">
      <div className="h-5 w-56 animate-pulse rounded-lg bg-white/10" />
      <div className="h-12 w-full max-w-xl animate-pulse rounded-lg bg-white/10" />
      <div className="h-32 animate-pulse rounded-2xl bg-white/10" />
      <div className="h-96 animate-pulse rounded-2xl bg-white/10" />
    </main>
  );

  if (state !== "ready" || !data) {
    const locked = state === "locked";
    const missing = state === "missing";
    return (
      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-10">
        <section className="glass-strong w-full max-w-lg space-y-4 rounded-2xl p-6 sm:p-8" role="alert">
          <h1 className="text-2xl font-bold">{locked ? "This lesson is locked" : missing ? "This lesson was not found." : "We couldn't load this lesson"}</h1>
          <p className="text-sm leading-relaxed text-slate-300">
            {locked ? "This lesson is not included in your current learning plan. Compare the plans to see which one includes it." : missing ? "Check the lesson link or return to your learning path." : "Check your connection and return to the dashboard to try again."}
          </p>
          <div className="flex flex-wrap gap-3">
            {locked && <Link href="/pricing" className="brand-gradient inline-flex min-h-11 items-center rounded-xl px-5 py-3 text-sm font-semibold text-white">View learning plans</Link>}
            <Link href="/dashboard" className="inline-flex min-h-11 items-center rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold text-slate-100">Back to dashboard</Link>
          </div>
        </section>
      </main>
    );
  }

  const { lesson, catalog } = data;
  const tierLessons = catalog.modules
    .filter((item) => item.tier_level === lesson.tier_level)
    .sort((a, b) => a.sort_order - b.sort_order);
  const index = tierLessons.findIndex((item) => item.module_id === lesson.module_id);
  const previous = index > 0 ? tierLessons[index - 1] : null;
  const next = index >= 0 && index + 1 < tierLessons.length ? tierLessons[index + 1] : null;
  const position = index >= 0 ? index + 1 : null;
  const total = index >= 0 ? tierLessons.length : null;
  const nextAvailable = Boolean(next?.unlocked);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
      <nav aria-label="Breadcrumb" className="mb-7 flex flex-wrap items-center gap-2 text-sm text-slate-400">
        <Link href="/dashboard" className="rounded hover:text-cyan-300 focus-visible:outline-2 focus-visible:outline-cyan-400">Dashboard</Link>
        <span aria-hidden="true">›</span>
        <span>{lesson.tier_level}</span>
        <span aria-hidden="true">›</span>
        <span className="font-mono text-cyan-300" aria-current="page">{lesson.module_id}</span>
      </nav>
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_280px] xl:grid-cols-[minmax(0,1fr)_310px]">
        <div className="min-w-0 space-y-8">
          <LessonHeader title={lesson.title} moduleId={lesson.module_id} tier={lesson.tier_level} position={position} tierTotal={total} estimatedMinutes={lesson.estimated_minutes} />
          <LessonGuide moduleId={lesson.module_id} />
          <VideoSlot slug={lesson.video_url_slug} title={lesson.title} />
          <LessonReader content={lesson.lesson_body} />
          <LearningOutcomes outcomes={lesson.learning_outcomes} compact />
          {lesson.assignment && <AssignmentPanel assignment={lesson.assignment} />}
          {lesson.checkpoint_questions && <CheckpointCard key={lesson.module_id} moduleId={lesson.module_id} checkpoint={lesson.checkpoint_questions} />}
          <LessonNavigation previous={previous} next={next} />
          <NextStepCue
            message={nextAvailable ? "Finished reading? Answer the checkpoint question, review the explanation, and open the next available module." : "The next lesson is not included in your current plan. Review your lessons on the dashboard."}
            href={nextAvailable ? `/module/${encodeURIComponent(next!.module_id)}` : "/dashboard"}
            linkLabel={nextAvailable ? "Open next lesson" : "Review your lessons"}
          />
        </div>
        <div className="hidden lg:block">
          <div className="sticky top-24">
            <LearningOutcomes outcomes={lesson.learning_outcomes} />
            {position !== null && total !== null && (
              <p className="mt-4 text-center text-xs text-slate-400">Lesson {position} of {total} in {lesson.tier_level}</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
