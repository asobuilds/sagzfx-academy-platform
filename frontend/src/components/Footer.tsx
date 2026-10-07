import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-200">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand column */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-10 rounded-lg brand-gradient flex items-center justify-center font-bold text-white">
                SGFX
              </div>
              <div>
                <div className="font-bold" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                  SAGZFX <span className="text-gradient">ACADEMY</span>
                </div>
                <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                  RC 8064497
                </div>
              </div>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              <strong style={{ color: "var(--signal-green-bright)" }}>Profits Forever.</strong>{" "}
              Learn, Trade, Grow. Nigeria&apos;s premier forex trading academy teaching
              institutional-grade market structure, SMC, and risk management.
            </p>
          </div>

          {/* Quick links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
              Platform
            </h4>
            <ul className="space-y-2 text-sm" style={{ color: "var(--text-secondary)" }}>
              <li><Link href="/#curriculum" className="hover:text-cyan-400 transition">Curriculum</Link></li>
              <li><Link href="/pricing" className="hover:text-cyan-400 transition">Pricing</Link></li>
              <li><Link href="/dashboard" className="hover:text-cyan-400 transition">Dashboard</Link></li>
              <li><Link href="/register" className="hover:text-cyan-400 transition">Register</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
              Contact
            </h4>
            <ul className="space-y-2 text-sm" style={{ color: "var(--text-secondary)" }}>
              <li>Shop 5 Aib Plaza</li>
              <li>Keffi, Abuja Express Way</li>
              <li>+234 915 210 0856</li>
              <li>+234 806 496 3367</li>
              <li className="text-cyan-400">@sagzfxacademy</li>
            </ul>
          </div>

        </div>

        <div className="mt-12 pt-6 border-t flex flex-col md:flex-row justify-between items-center gap-4 text-xs" style={{ borderColor: "var(--border-subtle)", color: "var(--text-muted)" }}>
          <p>© {new Date().getFullYear()} SAGZFX ACADEMY. All rights reserved.</p>
          <p>
            <span className="text-green-500">Knowledge</span> ·{" "}
            <span className="text-cyan-400">Strategy</span> ·{" "}
            <span className="text-amber-500">Discipline</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
