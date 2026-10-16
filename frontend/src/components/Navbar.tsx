"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { endpoints, type User } from "@/lib/api";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const restoreFocus = useRef(false);

  useEffect(() => {
    let cancelled = false;

    endpoints
      .me()
      .then((u) => {
        if (!cancelled) setUser(u);
      })
      .catch(() => {
        if (!cancelled) setUser(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [pathname]);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const panel = menuRef.current;
    const focusable = () => Array.from(panel?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') ?? []);
    focusable()[0]?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        restoreFocus.current = true;
        setMenuOpen(false);
      } else if (event.key === "Tab") {
        const elements = focusable();
        if (!elements.length) return;
        const first = elements[0];
        const last = elements[elements.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    const onPointer = (event: PointerEvent) => {
      if (!panel?.contains(event.target as Node) && !toggleRef.current?.contains(event.target as Node)) setMenuOpen(false);
    };
    const onResize = () => { if (window.innerWidth >= 768) setMenuOpen(false); };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    window.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("resize", onResize);
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen && restoreFocus.current) {
      restoreFocus.current = false;
      toggleRef.current?.focus();
    }
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  const logout = async () => {
    try {
      await endpoints.logout();
    } catch {
      // ignore — cookies get cleared server-side on success anyway
    }
    setUser(null);
    closeMenu();
    router.push("/");
    router.refresh();
  };

  return (
    <nav
      className="sticky top-0 z-50 border-b"
      style={{
        borderColor: "var(--border-subtle)",
        background: "rgba(5, 11, 20, 0.75)",
        backdropFilter: "blur(24px) saturate(160%)",
        WebkitBackdropFilter: "blur(24px) saturate(160%)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-12 h-9 rounded-lg brand-gradient flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20 group-hover:animate-glow transition">
            SGFX
          </div>
          <div className="leading-tight hidden sm:block">
            <div
              className="font-bold text-base tracking-tight"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              SAGZFX <span className="text-gradient">ACADEMY</span>
            </div>
            <div className="text-xs" style={{ color: "var(--text-muted)" }}>
              Profits Forever
            </div>
          </div>
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link
            href="/#curriculum"
            className="hover:text-cyan-400 transition"
            style={{ color: "var(--text-secondary)" }}
          >
            Curriculum
          </Link>
          <Link
            href="/practice"
            className="hover:text-cyan-400 transition"
            style={{ color: "var(--text-secondary)" }}
          >
            Practice
          </Link>
          <Link
            href="/pricing"
            className="hover:text-cyan-400 transition"
            style={{ color: "var(--text-secondary)" }}
          >
            Pricing
          </Link>
          <Link
            href="/#campus"
            className="hover:text-cyan-400 transition"
            style={{ color: "var(--text-secondary)" }}
          >
            Campus
          </Link>
          <Link
            href="/#contact"
            className="hover:text-cyan-400 transition"
            style={{ color: "var(--text-secondary)" }}
          >
            Contact
          </Link>
        </div>

        {/* Auth action */}
        <div className="hidden md:flex items-center gap-3">
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
        <button
          ref={toggleRef}
          type="button"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          aria-controls={menuId}
          onClick={() => { restoreFocus.current = false; setMenuOpen((value) => !value); }}
          className="md:hidden inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-white/20 text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
        >
          <span aria-hidden="true" className="text-xl">{menuOpen ? "×" : "☰"}</span>
        </button>
      </div>
      {menuOpen && (
        <div id={menuId} ref={menuRef} role="dialog" aria-modal="true" aria-label="Mobile navigation"
          className="md:hidden absolute left-0 right-0 top-full max-h-[calc(100dvh-4rem)] overflow-y-auto border-b border-white/20 bg-[#050B14] px-4 py-4 shadow-2xl">
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {[
              { href: "/#curriculum", label: "Curriculum" },
              { href: "/practice", label: "Practice" },
              { href: "/pricing", label: "Pricing" },
              { href: "/campus", label: "Campus" },
              { href: "/#contact", label: "Contact" },
            ].map(({ href, label }) => (
              <Link key={href} href={href} onClick={closeMenu} className="rounded-lg px-4 py-3 text-sm text-slate-100 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-cyan-400">{label}</Link>
            ))}
            {!loading && (user ? (
              <>
                <Link href="/dashboard" onClick={closeMenu} className="rounded-lg px-4 py-3 text-sm font-semibold text-cyan-300 focus-visible:outline-2 focus-visible:outline-cyan-400">Dashboard</Link>
                <button type="button" onClick={logout} className="rounded-lg px-4 py-3 text-left text-sm text-slate-100 focus-visible:outline-2 focus-visible:outline-cyan-400">Logout</button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={closeMenu} className="rounded-lg px-4 py-3 text-sm text-slate-100 focus-visible:outline-2 focus-visible:outline-cyan-400">Login</Link>
                <Link href="/register" onClick={closeMenu} className="rounded-lg bg-cyan-700 px-4 py-3 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-cyan-400">Get Started</Link>
              </>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}