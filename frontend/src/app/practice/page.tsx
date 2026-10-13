"use client";

import { useEffect, useMemo, useState } from "react";
import {
  endpoints,
  ApiError,
  type PracticeAccount,
  type PracticeOrder,
  type PracticeLedgerEntry,
  type PracticeQuote,
  type PracticeHistoryPoint,
} from "@/lib/api";

export default function PracticePage() {
  const [account, setAccount] = useState<PracticeAccount | null>(null);
  const [orders, setOrders] = useState<PracticeOrder[]>([]);
  const [ledger, setLedger] = useState<PracticeLedgerEntry[]>([]);
  const [quote, setQuote] = useState<PracticeQuote | null>(null);
  const [history, setHistory] = useState<PracticeHistoryPoint[]>([]);
  const [symbol, setSymbol] = useState("EURUSD");
  const [lot, setLot] = useState("0.10");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);

  async function refresh() {
    const [a, o, l] = await Promise.all([
      endpoints.practiceAccount(),
      endpoints.practiceOrders(),
      endpoints.practiceLedger(),
    ]);
    setAccount(a);
    setOrders(o);
    setLedger(l);
  }

  useEffect(() => {
    void Promise.resolve()
      .then(refresh)
      .catch(() => setError("Unable to load practice trading."));
  }, []);

  useEffect(() => {
    let active = true;
    const load = () =>
      void endpoints
        .practiceQuote(symbol)
        .then((q) => {
          if (active) {
            setQuote(q);
            setUpdatedAt(new Date().toLocaleTimeString());
          }
        })
        .catch(() => {
          if (active) setQuote(null);
        });
    load();
    const timer = setInterval(load, 30000);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [symbol]);

  useEffect(() => {
    void Promise.resolve()
      .then(() => endpoints.practiceHistory(symbol))
      .then(setHistory)
      .catch(() => setHistory([]));
  }, [symbol]);

  async function act(fn: () => Promise<unknown>) {
    setBusy(true);
    setError(null);
    try {
      await fn();
      await refresh();
    } catch (e) {
      setError(
        e instanceof ApiError ? String(e.detail) : "Practice action failed.",
      );
    } finally {
      setBusy(false);
    }
  }

  const closed = orders.filter((o) => o.status === "closed");
  const open = orders.filter((o) => o.status === "open");
  const realized = useMemo(
    () => closed.reduce((n, o) => n + Number(o.realized_pnl ?? 0), 0),
    [closed],
  );
  const wins = closed.filter((o) => Number(o.realized_pnl ?? 0) > 0).length;
  const winRate = closed.length ? Math.round((wins / closed.length) * 100) : 0;

  return (
    <section className="px-4 md:px-8 py-10 max-w-7xl mx-auto space-y-10">
      {/* ─── Intro ───────────────────────────────────────────── */}
      <div className="glass-strong rounded-3xl p-8 md:p-10 space-y-4">
        <span className="pill pill-green">Free · Virtual Money</span>
        <h1
          className="text-3xl md:text-5xl font-bold tracking-tight"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          SAGZFX <span className="text-gradient">Practice Trading</span>
        </h1>
        <p
          className="text-lg leading-relaxed max-w-3xl"
          style={{ color: "var(--text-secondary)" }}
        >
          A risk-free environment where you apply what you learn before you risk
          a single naira. Every account starts with USD 10,000 in virtual funds
          and uses educational reference rates — not real broker prices. No
          order here moves real money, and nothing you do on this page can earn
          or lose you actual capital.
        </p>
        {error && <p className="text-red-400 font-semibold">{error}</p>}
      </div>

      {/* ─── Why Practice? ───────────────────────────────────── */}
      <div className="glass rounded-3xl p-8 md:p-10 space-y-6">
        <div className="space-y-3">
          <span className="pill pill-blue">Why Practice Comes First</span>
          <h2
            className="text-2xl md:text-3xl font-bold tracking-tight"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Skill is built before capital is risked.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          <div className="space-y-2">
            <h3 className="font-bold text-base">1. Mistakes cost nothing here</h3>
            <p
              className="text-sm leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              Most beginner losses come from oversized positions and emotional
              entries — not from bad analysis. Practice lets you feel those
              impulses on a virtual balance so you recognise them when the money
              is real.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-base">
              2. The process becomes automatic
            </h3>
            <p
              className="text-sm leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              Deciding direction, sizing a lot, and reading your own P/L should
              not be the hard part of trading. They should be reflexes. That
              only happens with repetition — hundreds of repetitions, not
              dozens.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-base">
              3. You learn what a &quot;normal&quot; move looks like
            </h3>
            <p
              className="text-sm leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              Watching price drift for a week in practice teaches you when
              something is genuinely unusual and when it is just noise. That
              intuition is not something a lesson can hand you.
            </p>
          </div>
        </div>

        <div
          className="rounded-2xl p-5 border"
          style={{
            background: "rgba(5, 11, 20, 0.6)",
            borderColor: "var(--border-subtle)",
          }}
        >
          <p
            className="text-sm leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            <strong style={{ color: "var(--text-on-dark)" }}>Important:</strong>{" "}
            this terminal uses educational reference rates from the European
            Central Bank, refreshed daily. They are mid-market closing rates —
            not live broker bid/ask prices. When you move to a real Exness
            account, you will see spreads, slippage and execution behaviour
            that this environment deliberately does not simulate. Practice
            teaches process; it does not teach execution.
          </p>
        </div>
      </div>

      {/* ─── How to Use This Terminal ────────────────────────── */}
      <div className="glass rounded-3xl p-8 md:p-10 space-y-6">
        <div className="space-y-3">
          <span className="pill pill-gold">How to Use the Terminal</span>
          <h2
            className="text-2xl md:text-3xl font-bold tracking-tight"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Every session follows the same four steps.
          </h2>
        </div>

        <ol className="space-y-5">
          <li className="flex gap-4">
            <span className="shrink-0 w-8 h-8 rounded-lg brand-gradient flex items-center justify-center font-bold text-white text-sm">
              1
            </span>
            <div className="space-y-1">
              <h3 className="font-bold text-base">Choose a currency pair</h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                The three pairs above the chart — EUR/USD, GBP/USD, AUD/USD —
                are the most actively studied major pairs. Start with EUR/USD
                until it feels familiar. Each pair has a base currency (the
                first one) and a quote currency (the second). The price shows
                how much of the quote currency buys one unit of the base.
              </p>
            </div>
          </li>
          <li className="flex gap-4">
            <span className="shrink-0 w-8 h-8 rounded-lg brand-gradient flex items-center justify-center font-bold text-white text-sm">
              2
            </span>
            <div className="space-y-1">
              <h3 className="font-bold text-base">Read the current rate</h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                The large number under the pair name is the latest reference
                rate. Below it, a small cyan figure shows how many pips the rate
                has moved since the previous reference point. The chart
                underneath draws the recent reference history. A pip is a
                standard price move — usually 0.0001 for pairs like EUR/USD.
              </p>
            </div>
          </li>
          <li className="flex gap-4">
            <span className="shrink-0 w-8 h-8 rounded-lg brand-gradient flex items-center justify-center font-bold text-white text-sm">
              3
            </span>
            <div className="space-y-1">
              <h3 className="font-bold text-base">
                Decide direction and size
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                <strong style={{ color: "var(--text-on-dark)" }}>BUY</strong>{" "}
                (long) means you expect the base currency to strengthen against
                the quote.{" "}
                <strong style={{ color: "var(--text-on-dark)" }}>SELL</strong>{" "}
                (short) means you expect it to weaken. Lot size controls how
                much the price moves affect your balance. A standard lot is
                100,000 units of the base currency — 0.10 is one tenth of that.
                Smaller lots mean smaller risk and smaller reward. Start small.
              </p>
            </div>
          </li>
          <li className="flex gap-4">
            <span className="shrink-0 w-8 h-8 rounded-lg brand-gradient flex items-center justify-center font-bold text-white text-sm">
              4
            </span>
            <div className="space-y-1">
              <h3 className="font-bold text-base">Manage the position</h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                Once open, the position appears in{" "}
                <strong style={{ color: "var(--text-on-dark)" }}>
                  Open Positions
                </strong>
                . You can close it at any time — that locks in the current
                profit or loss and moves the trade to{" "}
                <strong style={{ color: "var(--text-on-dark)" }}>
                  Closed Trades
                </strong>
                . Every open, close, and reset also appears in the{" "}
                <strong style={{ color: "var(--text-on-dark)" }}>
                  Account Ledger
                </strong>
                . The ledger is your audit trail: it records the balance after
                each action.
              </p>
            </div>
          </li>
        </ol>
      </div>

      {/* ─── Account state ───────────────────────────────────── */}
      {!account ? (
        <div className="glass-strong rounded-3xl p-8 md:p-10 space-y-4 text-center">
          <span className="pill pill-green">Ready to begin</span>
          <h2
            className="text-2xl md:text-3xl font-bold tracking-tight"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Activate your free practice account
          </h2>
          <p
            className="text-sm max-w-xl mx-auto"
            style={{ color: "var(--text-secondary)" }}
          >
            Activation creates a virtual USD 10,000 balance tied to your SAGZFX
            login. You can reset it back to 10,000 at any time — the ledger
            keeps a record of every reset.
          </p>
          <button
            disabled={busy}
            onClick={() => act(endpoints.createPracticeAccount)}
            className="px-6 py-3 rounded-xl brand-gradient text-white font-semibold hover-lift disabled:opacity-50"
          >
            {busy
              ? "Activating…"
              : "Activate Free $10,000 Practice Account"}
          </button>
        </div>
      ) : (
        <>
          {/* ─── Account stats ─────────────────────────────────── */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <span className="pill pill-blue">Your Account</span>
              <span
                className="text-xs"
                style={{ color: "var(--text-muted)" }}
              >
                Reset count: {account.reset_count}
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <Stat
                label="Balance"
                value={"USD " + Number(account.balance).toLocaleString()}
              />
              <Stat label="Open Positions" value={String(open.length)} />
              <Stat label="Closed Trades" value={String(closed.length)} />
              <Stat
                label="Realized P/L"
                value={
                  (realized >= 0 ? "+" : "") + "$" + realized.toFixed(2)
                }
                tone={realized > 0 ? "good" : realized < 0 ? "bad" : "neutral"}
              />
              <Stat label="Win Rate" value={winRate + "%"} />
            </div>
          </div>

          {/* ─── Market terminal ───────────────────────────────── */}
          <div
            className="rounded-2xl overflow-hidden border bg-slate-950 text-slate-100"
            style={{ borderColor: "#273244" }}
          >
            <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-slate-800">
              <div>
                <div className="text-xs text-slate-400">
                  SAGZFX PRACTICE · MARKET TERMINAL
                </div>
                <div className="text-2xl font-bold">
                  {symbol.slice(0, 3)}/{symbol.slice(3)}{" "}
                  <span className="text-base text-slate-300">
                    {quote?.rate ?? "—"}
                  </span>
                  {quote && history.length > 0 && (
                    <span className="ml-3 text-xs text-cyan-300">
                      {(
                        (Number(quote.rate) -
                          Number(history[history.length - 1].rate)) *
                        10000
                      ).toFixed(1)}{" "}
                      pips
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                {["EURUSD", "GBPUSD", "AUDUSD"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSymbol(s)}
                    className={`px-3 py-2 rounded-lg text-sm ${
                      symbol === s ? "bg-slate-700" : "bg-slate-900"
                    }`}
                  >
                    {s.slice(0, 3)}/{s.slice(3)}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid lg:grid-cols-[1fr_280px]">
              <div className="p-4 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-3 text-xs text-slate-400">
                  <span className="inline-flex items-center gap-1.5 text-emerald-300">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    FEED ACTIVE
                  </span>
                  <span>·</span>
                  <span>30s refresh</span>
                  <span>·</span>
                  <span>{quote?.provider ?? "Reference feed"}</span>
                  <span>·</span>
                  <span>market date {quote?.rate_date ?? "—"}</span>
                  <span>·</span>
                  <span>checked {updatedAt ?? "—"}</span>
                </div>

                <PriceChart history={history} />
              </div>

              <div className="border-t lg:border-t-0 lg:border-l border-slate-800 p-4 space-y-4">
                <div>
                  <div className="text-xs text-slate-400">Virtual balance</div>
                  <div className="text-2xl font-bold">
                    ${Number(account.balance).toLocaleString()}
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-400">Lot size</label>
                  <input
                    value={lot}
                    onChange={(e) => setLot(e.target.value)}
                    inputMode="decimal"
                    className="mt-1 w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm"
                  />
                  <div className="text-[11px] text-slate-500 mt-1">
                    0.10 = one-tenth of a standard lot (10,000 units)
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    disabled={busy}
                    onClick={() =>
                      act(() =>
                        endpoints.openPracticeOrder(
                          symbol,
                          "sell",
                          Number(lot),
                        ),
                      )
                    }
                    className="py-4 rounded-xl bg-red-600 disabled:opacity-40 font-bold"
                  >
                    SELL
                  </button>
                  <button
                    disabled={busy}
                    onClick={() =>
                      act(() =>
                        endpoints.openPracticeOrder(
                          symbol,
                          "buy",
                          Number(lot),
                        ),
                      )
                    }
                    className="py-4 rounded-xl bg-emerald-600 disabled:opacity-40 font-bold"
                  >
                    BUY
                  </button>
                </div>

                <button
                  disabled={busy}
                  onClick={() => act(endpoints.resetPracticeAccount)}
                  className="w-full py-2 rounded-lg border border-slate-700 text-xs text-slate-300 hover:bg-slate-900"
                >
                  Reset to $10,000
                </button>

                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Virtual money only. Reference rates are educational mid-market
                  data, not broker bid/ask prices and not real-time execution.
                </p>
              </div>
            </div>
          </div>

          {/* ─── Open positions ────────────────────────────────── */}
          <TradeTable
            title="Open Positions"
            emptyMessage="No open positions. Choose a direction above to open a trade."
            orders={open}
            closeOrder={(id) => act(() => endpoints.closePracticeOrder(id))}
            busy={busy}
          />

          {/* ─── Closed trades ─────────────────────────────────── */}
          <TradeTable
            title="Closed Trades"
            emptyMessage="No closed trades yet. Close a position above to see it here."
            orders={closed}
            busy={busy}
          />

          {/* ─── Ledger ────────────────────────────────────────── */}
          <div className="glass rounded-3xl p-6 md:p-8 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2
                className="text-2xl font-bold tracking-tight"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                Account Ledger
              </h2>
              <span
                className="text-xs"
                style={{ color: "var(--text-muted)" }}
              >
                Every action recorded
              </span>
            </div>
            <p
              className="text-sm leading-relaxed max-w-3xl"
              style={{ color: "var(--text-secondary)" }}
            >
              The ledger is the audit trail of your practice account. Every
              activation, trade open, trade close and reset writes a row. Use
              it to reconstruct what actually happened in a session — not what
              you remember happening.
            </p>
            {ledger.length === 0 ? (
              <p
                className="text-sm italic"
                style={{ color: "var(--text-muted)" }}
              >
                No ledger entries yet.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr
                      className="text-left"
                      style={{ color: "var(--text-muted)" }}
                    >
                      <th className="py-2 pr-4 font-medium text-xs uppercase tracking-wider">
                        When
                      </th>
                      <th className="py-2 pr-4 font-medium text-xs uppercase tracking-wider">
                        Kind
                      </th>
                      <th className="py-2 pr-4 font-medium text-xs uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="py-2 pr-4 font-medium text-xs uppercase tracking-wider">
                        Balance After
                      </th>
                      <th className="py-2 pr-4 font-medium text-xs uppercase tracking-wider">
                        Note
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {ledger.map((entry) => (
                      <tr
                        key={entry.entry_id}
                        className="border-t"
                        style={{ borderColor: "var(--border-subtle)" }}
                      >
                        <td className="py-2 pr-4 font-mono text-xs">
                          {new Date(entry.created_at).toLocaleString()}
                        </td>
                        <td className="py-2 pr-4">{entry.entry_type}</td>
                        <td
                          className={`py-2 pr-4 font-mono ${
                            Number(entry.amount) >= 0
                              ? "text-emerald-400"
                              : "text-red-400"
                          }`}
                        >
                          {Number(entry.amount) >= 0 ? "+" : ""}
                          {Number(entry.amount).toFixed(2)}
                        </td>
                        <td className="py-2 pr-4 font-mono">
                          {Number(entry.balance_after).toFixed(2)}
                        </td>
                        <td
                          className="py-2 pr-4"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {entry.note ?? "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* ─── Discipline reminder ───────────────────────────── */}
          <div className="glass-strong rounded-3xl p-8 md:p-10 space-y-4">
            <span className="pill pill-gold">The SAGZFX Rule</span>
            <h2
              className="text-2xl md:text-3xl font-bold tracking-tight"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              Practice is not a game. It is a rehearsal.
            </h2>
            <p
              className="text-base leading-relaxed max-w-3xl"
              style={{ color: "var(--text-secondary)" }}
            >
              Treat every virtual trade the way you would treat a real one.
              Write down the reason before you click BUY or SELL. Know the price
              that would prove you wrong. Decide the maximum you are willing to
              lose in the session, and stop when you reach it. Reset the account
              only when you have learned something new, never to hide a loss.
            </p>
            <p
              className="text-sm leading-relaxed max-w-3xl"
              style={{ color: "var(--text-muted)" }}
            >
              Nothing on this page is financial advice. Forex and leveraged
              trading involve substantial risk of loss. This environment exists
              to help you develop process and discipline before you consider
              risking real money.
            </p>
          </div>
        </>
      )}
    </section>
  );
}

// ─── Sub-components ─────────────────────────────────────

function Stat({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string;
  tone?: "good" | "bad" | "neutral";
}) {
  const color =
    tone === "good"
      ? "#22C55E"
      : tone === "bad"
        ? "#EF4444"
        : "var(--text-on-dark)";
  return (
    <div className="glass rounded-xl p-4 space-y-1">
      <div
        className="text-xs uppercase tracking-wider"
        style={{ color: "var(--text-muted)" }}
      >
        {label}
      </div>
      <div className="text-lg font-bold" style={{ color }}>
        {value}
      </div>
    </div>
  );
}

function PriceChart({ history }: { history: PracticeHistoryPoint[] }) {
  if (history.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-slate-500 text-sm">
        Loading reference history…
      </div>
    );
  }
  const values = history.map((h) => Number(h.rate));
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const width = 600;
  const height = 180;
  const step = history.length > 1 ? width / (history.length - 1) : width;
  const points = history.map((h, i) => {
    const x = i * step;
    const y = height - ((Number(h.rate) - min) / span) * (height - 20) - 10;
    return `${x},${y}`;
  });
  const path = "M" + points.join(" L");
  const area = path + ` L${width},${height} L0,${height} Z`;
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-48">
      <defs>
        <linearGradient id="practiceArea" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#practiceArea)" />
      <path d={path} fill="none" stroke="#38BDF8" strokeWidth="1.6" />
    </svg>
  );
}

function TradeTable({
  title,
  emptyMessage,
  orders,
  closeOrder,
  busy,
}: {
  title: string;
  emptyMessage: string;
  orders: PracticeOrder[];
  closeOrder?: (id: string) => void;
  busy: boolean;
}) {
  return (
    <div className="glass rounded-3xl p-6 md:p-8 space-y-4">
      <h2
        className="text-2xl font-bold tracking-tight"
        style={{ fontFamily: "var(--font-space-grotesk)" }}
      >
        {title}
      </h2>
      {orders.length === 0 ? (
        <p className="text-sm italic" style={{ color: "var(--text-muted)" }}>
          {emptyMessage}
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr
                className="text-left"
                style={{ color: "var(--text-muted)" }}
              >
                <th className="py-2 pr-4 font-medium text-xs uppercase tracking-wider">
                  Symbol
                </th>
                <th className="py-2 pr-4 font-medium text-xs uppercase tracking-wider">
                  Side
                </th>
                <th className="py-2 pr-4 font-medium text-xs uppercase tracking-wider">
                  Lot
                </th>
                <th className="py-2 pr-4 font-medium text-xs uppercase tracking-wider">
                  Entry
                </th>
                <th className="py-2 pr-4 font-medium text-xs uppercase tracking-wider">
                  Opened
                </th>
                {closeOrder && (
                  <th className="py-2 pr-4 font-medium text-xs uppercase tracking-wider text-right">
                    Action
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr
                  key={o.order_id}
                  className="border-t"
                  style={{ borderColor: "var(--border-subtle)" }}
                >
                  <td className="py-2 pr-4 font-mono">{o.symbol}</td>
                  <td
                    className={`py-2 pr-4 font-semibold ${
                      o.side === "buy" ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {o.side.toUpperCase()}
                  </td>
                  <td className="py-2 pr-4 font-mono">{o.lot_size}</td>
                  <td className="py-2 pr-4 font-mono">{o.entry_price}</td>
                  <td
                    className="py-2 pr-4 font-mono text-xs"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {new Date(o.opened_at).toLocaleString()}
                  </td>
                  {closeOrder && (
                    <td className="py-2 pr-4 text-right">
                      <button
                        disabled={busy}
                        onClick={() => closeOrder(o.order_id)}
                        className="px-3 py-1.5 rounded-lg border text-xs font-medium hover:bg-slate-900 disabled:opacity-40"
                        style={{ borderColor: "var(--border-subtle)" }}
                      >
                        Close
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}