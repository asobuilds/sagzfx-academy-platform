# SAGZFX ACADEMY - Dev Session Notes

## Current state (end of session 1)
- Environment: Python 3.12.3 venv at .venv/
- Database: Neon Postgres (schema loaded, 47 course_modules seeded)
- Server: FastAPI running, all endpoints below verified working
- Test user: test1@sagzfx.dev / testpass1234 (has_paid_tuition: false)

## Completed phases
- Phase 1: Environment, deps, .gitignore
- Phase 2: FastAPI scaffolding + Neon connectivity + schema loaded
- Phase 3: SQLAlchemy ORM models + /db-check endpoint
- Phase 4: Auth - register, login (OAuth2 form), refresh, /me with bcrypt + JWT
- Phase 5: Three-tier guards (require_tuition_student, require_premium, require_admin)
  + dev-only helpers (activate-tuition, grant-premium) enabled when ENV=development

## Working endpoints (verified via Swagger)
- GET  /                                     root
- GET  /health
- GET  /api/v1/brand
- GET  /api/v1/db-check                      returns {"database":"connected","course_modules_count":47}
- POST /api/v1/auth/register                 201 + 409 duplicate
- POST /api/v1/auth/login                    OAuth2 form (username=email, password) -> TokenPair
- POST /api/v1/auth/refresh
- GET  /api/v1/auth/me                       Bearer token required
- POST /api/v1/dev/activate-tuition          (dev-only) flips has_paid_tuition=true
- POST /api/v1/dev/grant-premium             (dev-only) creates active premium_purchases row

## Resume at
**Step 10 - Curriculum API**
- GET /api/v1/curriculum/modules              list all 47, projected by caller tier
- GET /api/v1/curriculum/modules/{module_id}  single module with masked video URL
- Uses require_tuition_student / require_premium from app.api.deps
- Never leaks video_url_slug to unauthorized callers

## Key gotchas learned
- Neon + asyncpg: strip sslmode & channel_binding from URL, pass ssl=ssl_context via connect_args
- passlib is abandoned; use bcrypt directly (app/core/security.py)
- pydantic EmailStr needs `pip install "pydantic[email]"`
- Swagger login uses OAuth2 password flow with form fields (username=email)
- Never commit .env or .venv/ (already in .gitignore)
- Use nano for file creation, not `cat << EOF` heredocs (paste truncation in this terminal)

## How to resume next session
cd /home/student/sagzfx-academy-platform
source .venv/bin/activate
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
# then open http://127.0.0.1:8000/docs

## Phase 7 complete
- Paystack payment integration working end-to-end
- POST /api/v1/payments/init          -> returns checkout_url
- POST /api/v1/payments/webhook/paystack -> verifies HMAC-SHA512 signature
- Webhook URL configured in Paystack Test mode (ngrok tunnel)
- Tested with Paystack test card 4084 0840 8408 4081
- Products: tuition (NGN 150k), masterclass-pass (NGN 75k), vip-smc-indicators (NGN 25k)

## Next: Step 12 (MT5 demo provisioning), Step 13 (Community), Step 14 (Frontend)

## Phase 10 (partial) - Next.js Frontend built & working
Location: frontend/ (same repo as backend)

Stack: Next.js 16.3.8 + TypeScript + Tailwind CSS v4 + Turbopack
Fonts: Inter (body) + Space Grotesk (display) via next/font

Design system extracted from client's physical flyer:
- Base bg: #050B14 dark navy
- Brand blue: #1E40AF -> #2563EB
- Signal green: #16A34A -> #22C55E
- Accent cyan: #06B6D4, Bull blue: #0EA5E9
- Gold: #F59E0B, Alert red: #DC2626
- Utilities: .glass, .glass-strong, .hover-lift, .pill-{green,blue,gold,red},
  .ribbon, .text-gradient, .brand-gradient, .green-gradient, .animate-float,
  .animate-glow, .animate-ticker

Pages built & verified:
- /                          landing (hero + candlestick bg + curriculum + campus + CTA + contact)
- /login                     email+password form -> POST /auth/login -> tokens to localStorage
- /register                  new account -> auto-login -> tokens to localStorage
- /dashboard                 tier-aware dashboard; hits /auth/me + /curriculum/modules +
                             /mt5-demo/status + /community/realtime-config

Verified working:
- Registration writes to Neon, auto-login succeeds
- JWT stored in localStorage; navbar reads it and shows Dashboard/Logout
- Dashboard renders Premium state correctly (47/47 unlocked, MT5 login shown, exness link)

Env (frontend/.env.local, gitignored):
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000

## RESUME TOMORROW AT
1. Test dashboard as a REGISTERED user (test2@sagzfx.dev) to verify tier UI changes
2. Sub-step 14i: /module/[id] page (YouTube masked player + tier gate)
3. Sub-step 14j: /pricing page (Paystack init buttons -> /payments/init)
4. Sub-step 14k: /payment-success and /payment-cancel pages
5. Sub-step 15: deploy frontend (Vercel) + wire prod API URL

## How to resume tomorrow
Terminal A (backend):
  cd ~/sagzfx-academy-platform && source .venv/bin/activate
  uvicorn app.main:app --reload --host 127.0.0.1 --port 8000

Terminal B (frontend):
  cd ~/sagzfx-academy-platform/frontend && npm run dev
  # opens on http://localhost:3000

Terminal C (optional, for payments):
  cd ~/sagzfx-academy-platform && ./ngrok http 8000
  # then update webhook URL in Paystack Test mode if the ngrok URL changed
