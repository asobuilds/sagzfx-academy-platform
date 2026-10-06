# SAGZFX ACADEMY - Agent Implementation Guide

This file is the engineering source of truth for agents working on this repository. Read `SESSION_NOTES.md` first for the latest handoff.

## Non-negotiable rules

1. Do not present mocks, random credentials, placeholders or test-only behavior as production-complete.
2. Work in a narrow branch; run applicable CI before merge.
3. Apply required Neon migrations before deploying code that depends on them.
4. Confirm the exact merged commit is live on Render before calling a change production-live.
5. Never commit secrets or echo production credentials.
6. Browser auth uses Secure HttpOnly cookies; do not restore JWT localStorage auth.
7. Practice Trading is free to every authenticated user, regardless of learning plan.
8. Practice trades are virtual money only. Never route an order to Exness or claim the reference feed is broker execution data.
9. No Co-authored-by: Codex trailers.

## Current architecture

- FastAPI backend under `app/`
- Next.js frontend under `frontend/`
- Neon PostgreSQL
- Render backend + frontend
- Paystack live checkout/webhook
- Frankfurter free educational FX reference adapter
- GitHub Actions backend/frontend CI

## Business rules

Plans:
- registered: free
- beginner: NGN 150,000
- advanced: NGN 250,000
- masters: NGN 500,000

Paid class duration is one month. Paid enrollment enables lifetime mentorship. During the active month, the learner may open modules allowed by the plan. After expiry, only modules successfully opened during the active period remain accessible.

## Practice Trading contract

Every authenticated account can activate a USD 10,000 virtual account.

Execution model:
- EURUSD, GBPUSD and AUDUSD may be virtually opened/closed using the educational reference rate.
- USDJPY, USDCHF and USDCAD are reference-display only until account-currency conversion is implemented.
- opening an order persists symbol, side, lot size, reference fill and provider date.
- closing locks account/order rows, calculates P/L using Decimal arithmetic, updates the virtual balance and appends a realized_pnl ledger entry in one transaction.
- reset locks the account row, restores starting balance and records the actual balance delta.
- ledger/order history is scoped to the authenticated user's account.
- no real broker execution exists.
- no always-on SL/TP claim exists on free sleeping infrastructure.

## Release status

Production is live through PR #14 / commit `b81b18082193759d025df20c99ec4c017558bdaf`.
The current completion branch is `feature/complete-practice-trading`. It introduces migration 004 and the complete virtual trading workspace. Migration 004 must be approved/applied to production Neon before this branch can be merged/deployed.

## After Practice Trading

Do not silently expand scope. The next known platform gaps include verifying real mentorship infrastructure, payment-reference-specific success verification, client decision on plan downgrade/renewal behavior, video URL/content audit, frontend dependency-security PR, and remaining auth hardening.
