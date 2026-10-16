# SAGZFX ACADEMY Platform

Production web platform for SAGZFX ACADEMY: authenticated learning plans,
Paystack enrollment, curriculum access, lifetime mentorship entitlement, and
a free virtual-money FX practice simulator.

Built for the client's physical campus at Shop 5 Aib Plaza, Keffi, Abuja
Express Way, and for online learners worldwide. RC 8064497.

---

## Production stack

- **Backend**: FastAPI / Python 3.12.3
- **Frontend**: Next.js 16 + TypeScript + Tailwind CSS
- **Database**: Neon PostgreSQL
- **Hosting**: Render (two services — frontend Node, backend Python)
- **Payments**: Paystack (live)
- **Browser auth**: backend-managed Secure HttpOnly cookies. The frontend
  uses `credentials: "include"` and `/api/v1/auth/me` as the source of
  session truth. No browser localStorage token persistence.
- **Images**: Cloudinary, cloud `nirybrdh`
- **Videos**: Supabase Storage, project `dgxyzhphyprrcwdvzrue`, bucket `media`
- **Reference FX data**: Frankfurter educational mid-market rates

## Live URLs

- **Frontend**: https://sagzfx-academy.onrender.com
- **Backend API**: https://sagzfx-academy-api.onrender.com
- **Health check**: `/api/v1/db-check`

---

## Curriculum

The curriculum contains **57 modules across four tiers**:

| Tier | Modules | Typical access |
| --- | ---: | --- |
| Beginner | 12 | Beginner plan |
| Market Structure | 14 | Advanced plan |
| Advanced | 20 | Advanced plan |
| Masterclass | 11 | Masters plan |

Lesson content is stored in `course_modules.lesson_body` as Markdown.
Additional lesson fields:

- `learning_outcomes` (TEXT[]) — bullet list of what the student will learn
- `assignment` (TEXT) — practical task per lesson
- `checkpoint_questions` (JSONB) — question, options, correct answer, explanation
- `estimated_minutes` (INT) — reading time estimate
- `lesson_status` (VARCHAR) — draft / in_review / published

Authored lesson source files live under `frontend/content/lessons/`.

---

## Learning plans

| Plan | Price | Unlocks | Class period | Mentorship |
| --- | ---: | --- | --- | --- |
| Registered | Free | Practice simulator + account | — | — |
| Beginner | ₦150,000 | 12 Beginner modules | 1 month | Not included |
| Advanced | ₦250,000 | 46 modules (Beginner + Market Structure + Advanced) | 1 month | Not included |
| Masters & One-on-One | ₦500,000 | All 57 modules including Masterclass | 1 month | Lifetime |

**Business rules:**

- **One-month class period** — starts on purchase, expires one calendar
  month later.
- **Never downgrade** — purchasing a lower-tier plan preserves the
  student's highest existing entitlement.
- **Module retention** — modules opened during the active class remain
  accessible after expiry. Eligible modules never opened during the class
  lock afterward.
- **Lifetime mentorship** — granted only with the Masters plan.

### Payment product slugs

The backend Paystack catalog uses these product slugs:

| Product slug | Learning plan granted | Amount |
| --- | --- | ---: |
| `beginner` | beginner | ₦150,000 |
| `advanced` | advanced | ₦250,000 |
| `masters` | masters | ₦500,000 |

The webhook grants `learning_plan`, `class_started_at`, `class_expires_at`,
`has_paid_tuition`, `tuition_activated_at`, and (for Masters only)
`mentorship_lifetime`. It validates product, currency, amount, and reference
before granting access.

---

## Student experience

Every student-facing page follows the same educational architecture. Each
page answers four questions for the student:

1. **What is this page for?** — one-line plain-English description
2. **What do I do here?** — collapsible step-by-step guide
3. **What does this control mean?** — inline helper text on unfamiliar
   controls, and glossary definitions for trading terms
4. **What should I do next?** — a "What's next?" cue at the end of the page

### Shared educational primitives

All under `frontend/src/components/educational/`:

- `PageIntro` — consistent page title + one-line description
- `HowToGuide` — collapsible, accessible how-to guide with remembered
  open/closed preference
- `InlineHelp` — muted helper text associated with a control via
  `aria-describedby`
- `TermDefinition` — accessible glossary popover for trading terms
- `EducationalEmptyState` — explains why a section is empty, what action
  fills it, and where that action lives
- `NextStepCue` — context-aware next-step cue; never points to a locked
  destination

### Shared student components

All under `frontend/src/components/student/`:

- Dashboard: `PrimaryLearningAction`, `LearningPlanSummary`,
  `CurriculumSection`, `ModuleRow`
- Lessons: `LessonHeader`, `LessonGuide`, `LessonReader`,
  `CheckpointCard`, `AssignmentPanel`, `LessonNavigation`,
  `LearningOutcomes`
- Pricing: `PricingCard`, `PlanFeatureList`, `PlanComparisonTable`,
  `PaymentExplanation`, `MotivationSection`, `PricingFAQ`

### Glossary

`frontend/src/lib/glossary.ts` is the single source of truth for
plain-English definitions of trading terms (forex, currency-pair, pip,
lot-size, spread, entry-price, position, stop-loss, and others). The
glossary is used across the platform wherever these terms first appear.

### Content rules

Lesson content and interface copy follow these rules:

- No profit promises, win rates, or guaranteed outcomes anywhere
- No claims that a chart reveals institutional intent
- Every chart walkthrough acknowledges that a setup can fail
- Language: plain English, second person ("you"), no hype
- Match the voice of the lesson content in
  `frontend/content/lessons/`

---

## SAGZFX Practice Trading

Practice Trading is free for every authenticated account and is independent
of the paid learning plan.

Implemented:

- persistent USD 10,000 virtual practice account
- account reset with audited balance delta
- account/order/ledger persistence in PostgreSQL
- authenticated user-scoped ledger and order history
- free reference FX quotes
- virtual market Buy/Sell for EURUSD, GBPUSD, AUDUSD
- persisted open/closed positions
- realized P/L applied transactionally to virtual balance
- ledger entry for realized P/L
- practice workspace with balance, open positions, trade history, reset,
  ledger, and basic analytics
- separate Exness partner registration link at
  `https://one.exnessonelink.com/a/ut6xqvmg34`

**Important**: Frankfurter rates are educational reference / mid-market
data. They are not broker bid/ask ticks and are not represented as
real-time Exness/MT5 execution. USDJPY, USDCHF, and USDCAD remain
reference-display only until USD account-currency conversion is
implemented. Always-on SL/TP or pending-order triggering is not claimed
on the current free/sleeping infrastructure.

---

## Database migrations

Migrations are in `migrations/` and must be applied to Neon before deploying
code that depends on new columns. **Never treat CI success as proof that a
production migration is live.**

Current sequence:

1. `001` — learning-plan entitlements
2. `002` — practice account/orders
3. `003` — practice ledger
4. `004` — practice trade close-accounting fields
5. `005` — feedback and reviews
6. `006` — lesson content columns — **applied to live Neon**
7. `007` — Masterclass expansion to 57 modules — **applied to live Neon**

---

## Development

### Backend

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000