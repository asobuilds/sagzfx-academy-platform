"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { endpoints, type User } from "@/lib/api";

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    endpoints.me().then(setUser).catch(() => setUser(null)).finally(() => setLoading(false));
  }, []);

  const logout = async () => {
    try {
      await endpoints.logout();
    } finally {
      setUser(null);
      router.push("/");
      router.refresh();
    }
  };

  return (
    <nav className="sticky top-0 z-50 border-b" style={{ borderColor: "var(--border-subtle)", background: "rgba(255, 255, 255, 0.88)", backdropFilter: "blur(24px) saturate(160%)", WebkitBackdropFilter: "blur(24px) saturate(160%)" }}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">

        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-12 h-9 rounded-lg brand-gradient flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20 group-hover:animate-glow transition">
            SGFX
          </div>
          <div className="leading-tight hidden sm:block">
            <div className="font-bold text-base tracking-tight" style={{ fontFamily: "var(--font-space-grotesk)" }}>
              SAGZFX <span className="text-gradient">ACADEMY</span>
            </div>
            <div className="text-xs" style={{ color: "var(--text-muted)" }}>
              Profits Forever
            </div>
          </div>
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link href="/#curriculum" className="hover:text-cyan-400 transition" style={{ color: "var(--text-secondary)" }}>
            Curriculum
          </Link>
          <Link href="/pricing" className="hover:text-cyan-400 transition" style={{ color: "var(--text-secondary)" }}>
            Pricing
          </Link>
          <Link href="/#campus" className="hover:text-cyan-400 transition" style={{ color: "var(--text-secondary)" }}>
            Campus
          </Link>
          <Link href="/#contact" className="hover:text-cyan-400 transition" style={{ color: "var(--text-secondary)" }}>
            Contact
          </Link>
        </div>

        {/* Auth action */}
        <div className="flex items-center gap-3">
          {loading ? (
            <div className="w-24 h-9 rounded-lg glass animate-pulse" />
          ) : user ? (
            <>
              <Link
                href="/dashboard"
                className="px-4 py-2 rounded-lg glass hover-lift text-sm font-medium"
              >
                Dashboard
              </Link>
              <button
                onClick={logout}
                className="px-3 py-2 rounded-lg text-sm font-medium hover:text-red-400 transition"
                style={{ color: "var(--text-secondary)" }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium hover:text-cyan-400 transition hidden sm:inline"
                style={{ color: "var(--text-secondary)" }}
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 rounded-lg brand-gradient text-white text-sm font-semibold hover-lift shadow-lg shadow-blue-500/20"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
