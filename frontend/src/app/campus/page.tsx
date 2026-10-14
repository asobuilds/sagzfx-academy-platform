"use client";

import Link from "next/link";
import MediaGallery from "@/components/MediaGallery";
import { CAMPUS_MEDIA } from "@/lib/media";

export default function CampusPage() {
  return (
    <section className="px-4 md:px-8 py-12 max-w-7xl mx-auto space-y-12">
      {/* ─── Header ───────────────────────────────────────── */}
      <header className="space-y-6">
        <span className="pill pill-green">Physical Campus · Abuja</span>
        <h1
          className="text-4xl md:text-6xl font-bold tracking-tight"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          Where SAGZFX <span className="text-gradient">students learn.</span>
        </h1>
        <p
          className="text-lg leading-relaxed max-w-3xl"
          style={{ color: "var(--text-secondary)" }}
        >
          A real classroom in Abuja. Real workstations. Real cohorts. Online
          learners join the same sessions through Zoom, but the academy is a
          physical place you can walk into — Shop 5 Aib Plaza, Keffi, Abuja
          Express Way.
        </p>
        <div className="flex flex-wrap items-center gap-4 pt-2">
          <Link
            href="/register"
            className="px-6 py-3 rounded-xl brand-gradient text-white font-semibold hover-lift"
          >
            Join the next cohort →
          </Link>
          <Link
            href="/#contact"
            className="text-sm font-medium hover:text-cyan-400 transition"
            style={{ color: "var(--text-secondary)" }}
          >
            Visit the campus
          </Link>
        </div>
      </header>

      {/* ─── Gallery ──────────────────────────────────────── */}
      <div className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="space-y-2">
            <span className="pill pill-blue">Photo Tour</span>
            <h2
              className="text-2xl md:text-3xl font-bold tracking-tight"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              Inside the academy
            </h2>
          </div>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            Click any photo to view full size
          </p>
        </div>

        <MediaGallery items={CAMPUS_MEDIA} columns={3} />
      </div>

      {/* ─── CTA ──────────────────────────────────────────── */}
      <div className="glass-strong rounded-3xl p-8 md:p-10 text-center space-y-4">
        <span className="pill pill-gold">Ready to start?</span>
        <h2
          className="text-2xl md:text-3xl font-bold tracking-tight"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          The next cohort is enrolling now.
        </h2>
        <p
          className="text-base max-w-2xl mx-auto"
          style={{ color: "var(--text-secondary)" }}
        >
          Whether you join in person or online, you learn the same material
          from the same instructors. Every registered user gets free access to
          the practice trading environment from day one.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/register"
            className="px-6 py-3 rounded-xl brand-gradient text-white font-semibold hover-lift"
          >
            Create free account
          </Link>
          <Link
            href="/pricing"
            className="px-6 py-3 rounded-xl glass hover-lift font-semibold"
          >
            View pricing
          </Link>
        </div>
      </div>
    </section>
  );
}
