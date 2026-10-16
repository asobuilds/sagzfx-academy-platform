# SAGZFX ACADEMY - Session Handoff

Last updated: 2026-10-16

## Production baseline

Backend: https://sagzfx-academy-api.onrender.com
Frontend: https://sagzfx-academy.onrender.com
Database: Neon PostgreSQL
Historical verified baseline: PR #14, commit
`b81b18082193759d025df20c99ec4c017558bdaf`.
The current Render deployment commit has not been reverified
in this session.

## Production-proven work

- Curriculum expanded to an intended 57 modules:
  Beginner 12, Market Structure 14, Advanced 20, Masterclass 11.
  Live row counts have not been independently rechecked this session.
- Beginner NGN 150k, Advanced NGN 250k, Masters NGN 500k; one-month class; lifetime mentorship entitlement.
- Live Paystack checkout initialization and configured live webhook. A real successful charge/webhook entitlement cycle has not yet been manually proven because no live payment was completed.
- Secure HttpOnly-cookie browser authentication manually verified live.
- Browser sessions are cookie-only; the frontend does not persist JWTs
  in localStorage. /auth/me is the session authority.
- SAGZFX Practice Account: free to every authenticated user, USD 10,000 starting balance.
- Practice orders/ledger persistence and authenticated history endpoints.
- Frankfurter free educational reference FX feed.
- Reset is row-locked and records the actual balance delta.
- Fake MT5/Exness credential provisioning has been completely removed.
- Real Exness partner-registration link remains separate from virtual practice.

## Curriculum and media updates

- Migration 006 adds Markdown lesson bodies, learning outcomes,
  assignments, checkpoint questions, and lesson metadata.
- Migration 007 expands Masterclass to 11 modules, bringing the
  intended curriculum to 57 modules.
- Migrations 006 and 007 were reported applied to live Neon
  by the operator; no migration was executed during this review.
- Lesson source files are under frontend/content/lessons/.
- Images are hosted on Cloudinary (nirybrdh).
- Videos use Supabase Storage (dgxyzhphyprrcwdvzrue, media bucket).
- "Profits Forever" is the client's established slogan (RC 8064497).

## Current read-only review — pending approval

- Backend Paystack catalogue correctly uses tuition, advance,
  and one-on-one.
- Frontend pricing previously sent beginner, advanced, and masters;
  approved fix aligns those slugs.
- Webhook previously recorded purchases without updating learning_plan,
  class_started_at, class_expires_at, or mentorship_lifetime.
- Payment-success previously inferred success from learning_plan;
  approved fix checks the specific webhook-processed reference.
- The Markdown renderer created a paragraph for every source line.
  Beginner/L1-MOD1.md contains ordinary soft-wrapped paragraphs,
  confirming the primary formatting defect.
- PracticeQuote and PracticeHistoryPoint match current responses;
  PracticeOrder and other practice types still require reconciliation.
- These changes are proposed for review in the feature branch;
  they have not been merged or deployed.

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

1. Review and merge the payment slug and webhook entitlement fixes.
2. Verify payment amounts, webhook idempotency, and entitlement transitions
   in Paystack test mode.
3. Test the minimal Markdown paragraph-rendering correction.
4. Verify payment-success against the specific Paystack reference.
5. Run backend and frontend CI.
6. Verify the exact deployed Render commit and live database schema.
7. Perform an end-to-end student enrollment and lesson-access test.

## Next platform work after this part

- Verify/build real lifetime mentorship infrastructure.
- Add Paystack reference-specific verification on payment-return page.
- Decide and enforce plan upgrade/downgrade/renewal rules.
- Audit/publish real module video URLs.
- Resolve frontend dependency-security audit without unsafe forced downgrade.
- Remaining cookie/CSRF/auth hardening.
- Rotate production database credentials before final client handoff if previously exposed.
