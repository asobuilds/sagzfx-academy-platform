# SAGZFX ACADEMY Platform

Production web platform for SAGZFX ACADEMY: authenticated learning plans, Paystack enrollment, curriculum access, lifetime mentorship entitlement, and a free virtual-money FX practice simulator.

## Production stack

- Backend: FastAPI / Python 3.12.3
- Frontend: Next.js 16 + TypeScript + Tailwind CSS
- Database: Neon PostgreSQL
- Hosting: Render (backend and frontend)
- Payments: Paystack
- Browser auth: Secure HttpOnly cookies
- Reference FX data: Frankfurter educational mid-market/reference rates

## Learning plans

- Registered: free account; no paid curriculum.
- Beginner: NGN 150,000; Beginner modules.
- Advanced: NGN 250,000; Beginner + Market Structure + Advanced.
- Masters & One-on-One: NGN 500,000; all 47 modules including Masterclass.
- Paid class period: one month.
- Lifetime mentorship entitlement is retained after enrollment.
- After class expiry, modules successfully opened during the active class remain accessible; eligible modules never opened during the active period lock.

## SAGZFX Practice Trading

Practice Trading is free for every authenticated account and is independent of the paid learning plan.

Implemented:
- persistent USD 10,000 virtual practice account
- account reset with audited balance delta
- account/order/ledger persistence in PostgreSQL
- authenticated user-scoped ledger and order history
- free reference FX quotes
- virtual market Buy/Sell for EURUSD, GBPUSD and AUDUSD
- persisted open/closed positions
- realized P/L applied transactionally to virtual balance
- ledger entry for realized P/L
- practice workspace with balance, open positions, trade history, reset, ledger and basic analytics
- separate Exness partner registration link

Important: Frankfurter rates are educational reference/mid-market data. They are not broker bid/ask ticks and are not represented as real-time Exness/MT5 execution. USDJPY, USDCHF and USDCAD remain reference-display only until correct USD account-currency conversion is implemented. Always-on SL/TP or pending-order triggering is not claimed on the current free/sleeping infrastructure.

## Production URLs

- Frontend: https://sagzfx-academy.onrender.com
- API: https://sagzfx-academy-api.onrender.com
- API health/database check: /api/v1/db-check

## Database migrations

Migrations are in `migrations/` and must be applied to Neon before deploying code that depends on new columns. Never treat CI success as proof that a production migration is live.

Current sequence:
1. learning-plan entitlements
2. practice account/orders
3. practice ledger
4. practice trade close-accounting fields

## Development

Backend:
```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Frontend:
```bash
cd frontend
npm install
npm run dev
```

Required production secrets/config belong in the hosting environment, never in Git. Do not commit `.env` files, database credentials, Paystack secrets, or JWT secrets.

## Release rule

A feature is complete only after its tests/CI pass, required production database/config changes are applied, the exact merged commit is deployed, and the live flow is verified. Mock/demo credentials must never be presented as production functionality.
