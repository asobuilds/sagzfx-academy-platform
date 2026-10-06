# SAGZFX ACADEMY - Session Handoff

Last updated: 2026-10-06

## Production baseline

Backend: https://sagzfx-academy-api.onrender.com
Frontend: https://sagzfx-academy.onrender.com
Database: Neon PostgreSQL
Production is confirmed live through PR #14, commit `b81b18082193759d025df20c99ec4c017558bdaf`.

## Production-proven work

- 47-module curriculum database and server-side learning-plan/expiry enforcement.
- Beginner NGN 150k, Advanced NGN 250k, Masters NGN 500k; one-month class; lifetime mentorship entitlement.
- Live Paystack checkout initialization and configured live webhook. A real successful charge/webhook entitlement cycle has not yet been manually proven because no live payment was completed.
- Secure HttpOnly-cookie browser authentication manually verified live.
- SAGZFX Practice Account: free to every authenticated user, USD 10,000 starting balance.
- Practice orders/ledger persistence and authenticated history endpoints.
- Frankfurter free educational reference FX feed.
- Reset is row-locked and records the actual balance delta.
- Fake MT5/Exness credential provisioning has been completely removed.
- Real Exness partner-registration link remains separate from virtual practice.

## Current branch - complete Practice Trading

Branch: `feature/complete-practice-trading`

Implemented on branch:
- migration 004 adds close_price, realized_pnl and quote_date to practice_orders
- virtual market Buy/Sell
- executable pairs limited to EURUSD, GBPUSD, AUDUSD for correct direct USD P/L
- row-locked close flow
- realized P/L updates virtual balance and writes realized_pnl ledger event
- provider reference date persisted
- /practice workspace
- balance, quote, Buy/Sell, open positions, close, trade history, reset, ledger
- basic analytics: open count, closed count, realized P/L, win rate
- dashboard link to practice workspace
- README and agent documentation updated

## Critical data disclaimer

Frankfurter provides educational reference/mid-market rates, not broker bid/ask ticks. The simulator must never call these real-time Exness/MT5 executions. With the current free/sleeping infrastructure, do not claim continuously monitored SL/TP or pending orders.

## Immediate release gates

1. Run CI for the completion branch.
2. Review and apply migration 004 to production Neon only after explicit user approval.
3. Merge exact tested head.
4. Confirm exact merge commit live on backend and frontend Render services.
5. Manually verify production: login -> activate/open Practice -> quote -> Buy/Sell -> open position -> close -> P/L/balance/ledger/history -> reset -> refresh persistence.

## Next platform work after this part

- Verify/build real lifetime mentorship infrastructure.
- Add Paystack reference-specific verification on payment-return page.
- Decide and enforce plan upgrade/downgrade/renewal rules.
- Audit/publish real module video URLs.
- Resolve frontend dependency-security audit without unsafe forced downgrade.
- Remaining cookie/CSRF/auth hardening.
- Rotate production database credentials before final client handoff if previously exposed.
