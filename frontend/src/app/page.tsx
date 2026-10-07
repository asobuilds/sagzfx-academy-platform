import Link from "next/link";
import Image from "next/image";
import CommunityVoice from "@/components/CommunityVoice";

export default function Home() {
  return (
    <>
      {/* ─── HERO ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-20 pb-32 px-4 md:px-8">
        {/* Background chart art */}
        <div className="absolute inset-0 -z-10 opacity-[0.07] pointer-events-none">
          <svg
            viewBox="0 0 1400 500"
            className="w-full h-full"
            preserveAspectRatio="none"
          >
            {Array.from({ length: 60 }).map((_, i) => {
              const baseY = 250;
              const seed = Math.sin(i * 1.7) * 80;
              const wickTop = baseY - Math.abs(seed) - 40;
              const wickBot = baseY + Math.abs(seed) + 40;
              const bodyTop = baseY - Math.abs(seed) - 20;
              const bodyBot = baseY + Math.abs(seed) + 20;
              const isUp = seed > 0;
              const x = 20 + i * 23;
              return (
                <g key={i} stroke={isUp ? "#22C55E" : "#DC2626"} fill={isUp ? "#22C55E" : "#DC2626"}>
                  <line x1={x} y1={wickTop} x2={x} y2={wickBot} strokeWidth="2" />
                  <rect x={x - 7} y={bodyTop} width="14" height={bodyBot - bodyTop} />
                </g>
              );
            })}
          </svg>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Left column - copy */}
          <div className="lg:col-span-7 space-y-8">
            <div className="flex flex-wrap items-center gap-3">
              <span className="pill pill-green">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                Physical Class · Abuja
              </span>
              <span className="pill pill-blue">Online Class · Worldwide</span>
            </div>

            <h1
              className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] tracking-tight"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              <span className="block">Are you new to</span>
              <span className="block">
                the <span className="text-gradient">financial market?</span>
              </span>
            </h1>

            <p className="text-lg md:text-xl leading-relaxed max-w-2xl" style={{ color: "var(--text-secondary)" }}>
              Build market understanding before risking capital. SAGZFX ACADEMY is a structured forex education platform that takes students from the foundations of the financial market through market structure, risk management, advanced analysis, guided practice, and long-term mentorship.
            </p>

            {/* Ribbon CTA */}
            <div className="flex flex-wrap items-center gap-6 pt-2">
              <Link href="/register" className="ribbon text-lg">
                <span>Free 7-Days Summit</span>
              </Link>
              <Link
                href="/#curriculum"
                className="text-sm font-medium flex items-center gap-2 hover:text-cyan-700 transition"
                style={{ color: "var(--text-secondary)" }}
              >
                See the curriculum
                <span aria-hidden>↓</span>
              </Link>
            </div>

            {/* Trust strip */}
            <div className="flex flex-wrap items-center gap-x-8 gap-y-3 pt-6 text-xs uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
              <span>
                <strong className="text-green-500">Knowledge</strong>
              </span>
              <span>
                <strong className="text-cyan-700">Strategy</strong>
              </span>
              <span>
                <strong className="text-amber-500">Discipline</strong>
              </span>
              <span className="hidden md:inline">RC 8064497</span>
            </div>
          </div>

          {/* Right column - hero card */}
          <div className="lg:col-span-5 relative">
            <div className="glass-strong rounded-3xl p-8 space-y-6 hover-lift animate-float">

              {/* Live market badge */}
              <div className="flex items-center justify-between">
                <span className="pill pill-green">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                  Live Market
                </span>
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                  MT5 · Exness
                </span>
              </div>

              {/* Mock chart */}
              <div className="rounded-2xl p-6 space-y-3" style={{ background: "rgba(241, 245, 249, 0.9)" }}>
                <div className="text-xs uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                  XAUUSD · M15
                </div>
                <div className="text-3xl font-bold" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                  $2,647.<span className="text-green-500">82</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-green-500">▲ +1.24%</span>
                  <span style={{ color: "var(--text-muted)" }}>last 24h</span>
                </div>

                {/* Sparkline */}
                <svg viewBox="0 0 300 60" className="w-full h-16 pt-2">
                  <defs>
                    <linearGradient id="spark" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#22C55E" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#22C55E" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0,45 L30,38 L60,42 L90,28 L120,32 L150,20 L180,25 L210,12 L240,18 L270,8 L300,15"
                    stroke="#22C55E"
                    strokeWidth="2"
                    fill="none"
                  />
                  <path
                    d="M0,45 L30,38 L60,42 L90,28 L120,32 L150,20 L180,25 L210,12 L240,18 L270,8 L300,15 L300,60 L0,60 Z"
                    fill="url(#spark)"
                  />
                </svg>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="glass rounded-xl p-3">
                  <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                    Students
                  </div>
                  <div className="text-lg font-bold">500+</div>
                </div>
                <div className="glass rounded-xl p-3">
                  <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                    Modules
                  </div>
                  <div className="text-lg font-bold">47</div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      <section className="px-4 md:px-8 py-20">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[0.85fr_1.15fr] gap-12 items-start">
          <div className="space-y-4"><span className="pill pill-blue">More than a course</span><h2 className="text-4xl md:text-5xl font-bold tracking-tight" style={{fontFamily:"var(--font-space-grotesk)"}}>A complete environment for becoming a disciplined market student.</h2><p className="text-lg" style={{color:"var(--text-secondary)"}}>SAGZFX combines structured learning, practical application and continuing mentorship so students are not left with videos alone. The platform is designed to help you understand why markets move, practise decisions without risking real money, track your learning journey and continue receiving guidance beyond the active class period.</p></div>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              ["Learn systematically","Progress from forex foundations into market structure, institutional concepts, execution thinking and risk management."],
              ["Practise safely","Use the free SAGZFX Practice Trading environment with virtual funds before considering real capital."],
              ["Develop discipline","Build the habit of analysing setups, managing risk and making decisions from a process rather than emotion."],
              ["Keep growing","Your one-month class is followed by lifetime mentorship, while modules opened during your active period remain part of your learning library."]
            ].map(([title,body])=><div key={title} className="glass rounded-2xl p-6"><h3 className="font-bold text-xl">{title}</h3><p className="mt-2 text-sm leading-6" style={{color:"var(--text-secondary)"}}>{body}</p></div>)}
          </div>
        </div>
      </section>

      {/* ─── WHAT YOU'LL LEARN ────────────────────────────── */}
      <section id="curriculum" className="px-4 md:px-8 py-20">
        <div className="max-w-7xl mx-auto space-y-12">

          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="pill pill-blue">The Curriculum</span>
            <h2
              className="text-4xl md:text-5xl font-bold tracking-tight"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              From zero to <span className="text-gradient">funded trader</span>
            </h2>
            <p className="text-lg" style={{ color: "var(--text-secondary)" }}>
              Four tiers. Forty-seven modules. Built around institutional order flow,
              smart money concepts, and real risk management.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

            {/* Beginner */}
            <div className="glass hover-lift rounded-2xl p-6 space-y-4">
              <span className="pill pill-green">Beginner</span>
              <h3 className="text-xl font-bold" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                Level 1
              </h3>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                Foundations: currency pairs, sessions, pips, lots, candlesticks, risk.
              </p>
              <div className="text-xs pt-2" style={{ color: "var(--text-muted)" }}>
                12 modules · Beginner plan
              </div>
            </div>

            {/* Market Structure */}
            <div className="glass hover-lift rounded-2xl p-6 space-y-4">
              <span className="pill pill-blue">Market Structure</span>
              <h3 className="text-xl font-bold" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                Level 2
              </h3>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                Higher highs, BOS, CHOCH, supply &amp; demand, liquidity, FVG.
              </p>
              <div className="text-xs pt-2" style={{ color: "var(--text-muted)" }}>
                14 modules · Advanced plan
              </div>
            </div>

            {/* Advanced */}
            <div className="glass hover-lift rounded-2xl p-6 space-y-4">
              <span className="pill pill-gold">Advanced</span>
              <h3 className="text-xl font-bold" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                Level 3
              </h3>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                Institutional order flow, SMC, displacement, mitigation, kill-zones.
              </p>
              <div className="text-xs pt-2" style={{ color: "var(--text-muted)" }}>
                20 modules · Advanced plan
              </div>
            </div>

            {/* Masterclass */}
            <div className="glass hover-lift rounded-2xl p-6 space-y-4 relative overflow-hidden">
              <div className="absolute top-3 right-3">
                <span className="pill pill-red">🔒 Locked</span>
              </div>
              <span className="pill pill-gold">Masterclass</span>
              <h3 className="text-xl font-bold" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                Level 4
              </h3>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                Capstone: putting everything together into a personal trading plan.
              </p>
              <div className="text-xs pt-2" style={{ color: "var(--text-muted)" }}>
                1 module · Masters plan
              </div>
            </div>

          </div>
        </div>
      </section>

      <section className="px-4 md:px-8 py-20">
       <div className="max-w-7xl mx-auto rounded-3xl bg-slate-950 text-white p-8 md:p-12">
        <div className="max-w-3xl"><span className="text-cyan-400 text-sm uppercase tracking-[0.2em]">The SAGZFX learning journey</span><h2 className="text-4xl font-bold mt-3">From first principles to independent thinking.</h2><p className="text-slate-400 mt-4">The aim is not to promise quick profits. It is to groom students into informed, risk-aware and disciplined market participants with a repeatable learning and analysis process.</p></div>
        <div className="grid md:grid-cols-4 gap-4 mt-10">{[["01","Foundation","Understand pairs, sessions, pips, lots, charts and the language of the market."],["02","Structure","Learn how price structure, liquidity, supply and demand and institutional concepts fit together."],["03","Application","Translate knowledge into analysis and practise Buy/Sell decisions using virtual funds."],["04","Mentorship","Continue developing through lifetime mentorship after the active one-month class."]].map(([n,t,d])=><div key={n} className="border border-slate-800 rounded-2xl p-5"><span className="text-cyan-400 text-sm">{n}</span><h3 className="font-bold text-xl mt-3">{t}</h3><p className="text-slate-400 text-sm leading-6 mt-2">{d}</p></div>)}</div>
       </div>
      </section>

      {/* ─── CAMPUS & ONLINE ──────────────────────────────── */}
      <section id="campus" className="px-4 md:px-8 py-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Physical */}
          <div className="glass hover-lift rounded-3xl p-8 space-y-6">
            <span className="pill pill-green">Physical Class</span>
            <h3
              className="text-3xl font-bold tracking-tight"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              Learn in Abuja,{" "}
              <span className="text-gradient">side by side.</span>
            </h3>
            <p style={{ color: "var(--text-secondary)" }}>
              Face-to-face instruction at Shop 5 Aib Plaza, Keffi, Abuja Express Way.
              Live sessions, whiteboard breakdowns, and direct mentorship.
            </p>
            <ul className="space-y-2 text-sm" style={{ color: "var(--text-secondary)" }}>
              <li>✓ Mon – Fri, 11:00 AM – 3:30 PM</li>
              <li>✓ Physical books &amp; printed materials</li>
              <li>✓ Same-room mentorship</li>
            </ul>
          </div>

          {/* Online */}
          <div className="glass hover-lift rounded-3xl p-8 space-y-6">
            <span className="pill pill-blue">Online Class</span>
            <h3
              className="text-3xl font-bold tracking-tight"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              Or learn from{" "}
              <span className="text-gradient">anywhere in the world.</span>
            </h3>
            <p style={{ color: "var(--text-secondary)" }}>
              Join live via Zoom or Google Meet. Every session recorded. Every
              question answered in our private Discord community.
            </p>
            <ul className="space-y-2 text-sm" style={{ color: "var(--text-secondary)" }}>
              <li>✓ Live interactive sessions</li>
              <li>✓ Unlimited replay access</li>
              <li>✓ Discord support &amp; community</li>
            </ul>
          </div>

        </div>
      </section>

      {/* ─── FINAL CTA ────────────────────────────────────── */}
      <section className="px-4 md:px-8 py-24">
        <div className="max-w-4xl mx-auto glass-strong rounded-3xl p-12 text-center space-y-6 animate-glow">
          <span className="pill pill-gold">Free Registration</span>
          <h2
            className="text-4xl md:text-5xl font-bold tracking-tight"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Ready to <span className="text-gradient">trade like a pro?</span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: "var(--text-secondary)" }}>
            Create your account, choose the class that matches your level, and begin your
            one-month training period with lifetime mentorship after enrollment.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/register"
              className="px-8 py-4 rounded-xl brand-gradient text-white font-semibold hover-lift shadow-lg shadow-blue-500/20"
            >
              Create Free Account
            </Link>
            <Link
              href="/pricing"
              className="px-8 py-4 rounded-xl glass hover-lift font-semibold"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>


      <section className="mt-12 bg-slate-950 text-slate-100 px-4 md:px-8 py-24 border-t border-slate-800">
       <div className="max-w-7xl mx-auto space-y-20">
        <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-10">
         <div><span className="text-cyan-400 text-sm uppercase tracking-[0.25em]">Questions answered</span><h2 className="text-4xl md:text-5xl font-bold mt-3">Frequently asked questions</h2><p className="text-slate-400 mt-4">Clear answers before you choose a learning plan.</p></div>
         <div className="space-y-3">
          {[
           ["How long is the class?","The active class period is one month. Lifetime mentorship remains included after enrollment."],
           ["What happens to my modules after the month ends?","Modules you actually opened during your active class remain available. Other eligible modules lock after the class period ends."],
           ["Can registered users use Practice Trading?","Yes. SAGZFX Practice Trading is free for every authenticated account type and uses virtual funds only."],
           ["Can I learn outside Abuja?","Yes. The academy supports online learning as well as the physical Abuja class."],
           ["Are practice prices broker execution prices?","No. Practice Trading uses educational reference rates and virtual money; it is not a live brokerage account."]
          ].map(([q,a])=><details key={q} className="group rounded-2xl border border-slate-800 bg-slate-900/60 p-5"><summary className="cursor-pointer font-semibold text-white">{q}</summary><p className="pt-3 text-sm leading-6 text-slate-400">{a}</p></details>)}
         </div>
        </div>
        <CommunityVoice/>
       </div>
      </section>

      {/* ─── CONTACT ──────────────────────────────────────── */}
      <section id="contact" className="px-4 md:px-8 py-16">
        <div className="max-w-7xl mx-auto text-center space-y-6">
          <h2
            className="text-3xl font-bold tracking-tight"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Talk to us
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm" style={{ color: "var(--text-secondary)" }}>
            <a href="tel:+2349152100856" className="hover:text-cyan-700 transition">
              📞 +234 915 210 0856
            </a>
            <a href="tel:+2348064963367" className="hover:text-cyan-700 transition">
              📞 +234 806 496 3367
            </a>
            <span className="text-cyan-700">@sagzfxacademy</span>
          </div>
        </div>
      </section>
    </>
  );
}
