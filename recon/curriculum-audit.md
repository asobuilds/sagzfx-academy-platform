# SAGZFX ACADEMY — Curriculum System Audit

**Type:** read-only reconnaissance report.
**Status:** no application code written, no SQL executed, no migrations applied.

**Sources read:** `schema.sql`, `app/models/course.py`, `app/models/__init__.py`,
`app/api/v1/curriculum.py`, `app/schemas/curriculum.py`, `app/core/access_policy.py`,
`migrations/001`–`005`, `frontend/src/app/module/[id]/page.tsx`, `frontend/src/lib/api.ts`, `README.md`, `agent.md`.

---

## Provenance

This report was produced in two passes against different inputs.

- **Pass 1** had no access to `SagzFX_Academy_Full_Forex_Teaching_Guide.pdf`,
  which was absent from the repo. Sections 1 and 3–7 date from this pass.
- **Pass 2** read the guide (12 pages, now in the repo root) and replaced
  Section 2 entirely. The guide also supplied the methodology constraints
  that Pass 1 had reconstructed from `README.md` and `agent.md`.

Residual from Pass 1: Section 5's lesson was written before the guide was
available and has now been reconciled against it (see updated §6).

---

## Section 1 — Current State Snapshot

`course_modules` — as declared in `schema.sql` and mirrored by `app/models/course.py`.
No migration in `migrations/` alters this table; `001`–`005` touch `users`, `student_progress`,
practice tables and feedback tables only.

| Column | Type | Nullable | Default |
|---|---|---|---|
| `module_id` | `VARCHAR(20)` | NOT NULL | none (PRIMARY KEY) |
| `tier_level` | `VARCHAR(30)` | NOT NULL | none |
| `title` | `VARCHAR(150)` | NOT NULL | none |
| `video_url_slug` | `VARCHAR(255)` | NULL | none |
| `is_premium_locked` | `BOOLEAN` | NULL | `FALSE` |
| `sort_order` | `INT` | NOT NULL | none |

**Row count:** 47 — from the seed block in `schema.sql`. *Not queried against Neon.* This audit
respected the "NO SQL execution" constraint, so 47 is the declared seed count, not a live
`SELECT COUNT(*)`. Confirm against production before relying on it.

**Distribution (from seed):** Beginner 12 (`L1-MOD1`–`L1-MOD12`), Market Structure 14
(`L2-MOD1`–`L2-MOD14`), Advanced 20 (`L3-MOD1`–`L3-MOD20`), Masterclass 1 (`L4-MOD1`).
`is_premium_locked = TRUE` for all 21 Advanced + Masterclass rows.

**Sample row (`L1-MOD1`):**

```json
{
  "module_id": "L1-MOD1",
  "tier_level": "Beginner",
  "title": "Introduction to Forex",
  "video_url_slug": null,
  "is_premium_locked": false,
  "sort_order": 1
}
```

> **Drift note:** `schema.sql` is stale relative to the migration chain. `student_progress.first_opened_at`
> and all of `users.learning_plan` / `class_started_at` / `class_expires_at` / `mentorship_lifetime`
> are added by `001_learning_plan_access.sql` but are absent from `schema.sql`. Treat `schema.sql`
> as the **original** shape, not the current one. For `course_modules` specifically there is no
> drift — nothing has altered it.

### Migration mechanics (discovered during Pass 2)

This repo has no working migration-tracking system. `alembic==1.13.2`
is pinned in `requirements.txt` but is never imported, has no `alembic/`
directory, and no `alembic.ini`. The actual mechanism is hand-written
numbered SQL files in `migrations/001_*.sql` through `migrations/005_*.sql`,
applied manually in order. `load_schema.py` loads `schema.sql` wholesale
and is bootstrap-only (no `IF NOT EXISTS`, fails against an existing DB).

**Operational gap:** there is no record of which migrations are live on
Neon. `check_db.py` lists table names but not columns. "Which migrations
have been applied" is currently unanswerable from the repo or the DB.

**Convention for new work:** new migrations are written as
`migrations/00N_description.sql`, idempotent, applied manually.

---

## Section 2 — Guide-to-DB Mapping

**Superseded content.** The client guide is now present
in the repo root and has been read in full (12 pages).

The guide carries **59** level-scoped headings — Beginner 12, Intermediate 16, Advanced 20,
Final Masterclass 11 — against **47** rows in `course_modules`. Of the 47 DB rows: **46 `exact`**,
**1 `partial`**, **0 `mismatch`**, **0 `missing-in-guide`**. The DB seed in `schema.sql` was
evidently generated from this guide: every DB title is a verbatim copy of a guide heading, with a
single exception (`L4-MOD1`, which appends "(Capstone)"). The guide is the larger artefact, not the
DB — 12 of its headings have no module row, 10 of them in the Final Masterclass block, which the DB
compresses into one capstone module. `Notes` is filled only where the match is not `exact`.

| Guide Section Title | DB module_id | DB title | Match quality | Notes |
|---|---|---|---|---|
| Introduction to Forex | `L1-MOD1` | Introduction to Forex | exact | — |
| Currency pairs & market sessions | `L1-MOD2` | Currency pairs & market sessions | exact | — |
| Pips, lots, spreads & leverage | `L1-MOD3` | Pips, lots, spreads & leverage | exact | — |
| Buy/Sell & order types | `L1-MOD4` | Buy/Sell & order types | exact | — |
| Trading platforms (MT4/MT5) | `L1-MOD5` | Trading platforms (MT4/MT5) | exact | — |
| Candlestick basics | `L1-MOD6` | Candlestick basics | exact | — |
| Support & Resistance | `L1-MOD7` | Support & Resistance | exact | — |
| Trendlines & market direction | `L1-MOD8` | Trendlines & market direction | exact | — |
| Stop Loss & Take Profit | `L1-MOD9` | Stop Loss & Take Profit | exact | — |
| Basic Risk Management | `L1-MOD10` | Basic Risk Management | exact | — |
| Trading Psychology | `L1-MOD11` | Trading Psychology | exact | — |
| How to read a simple chart | `L1-MOD12` | How to read a simple chart | exact | — |
| Higher Highs, Higher Lows, LH & LL | `L2-MOD1` | Higher Highs, Higher Lows, LH & LL | exact | — |
| Break of Structure (BOS) | `L2-MOD2` | Break of Structure (BOS) | exact | — |
| Change of Character (CHOCH) | `L2-MOD3` | Change of Character (CHOCH) | exact | — |
| Supply & Demand | `L2-MOD4` | Supply & Demand | exact | — |
| Liquidity & liquidity sweeps | `L2-MOD5` | Liquidity & liquidity sweeps | exact | — |
| Fair Value Gaps (FVG) | `L2-MOD6` | Fair Value Gaps (FVG) | exact | — |
| Order Blocks | `L2-MOD7` | Order Blocks | exact | — |
| Premium & Discount | `L2-MOD8` | Premium & Discount | exact | — |
| Multi-Timeframe Analysis | `L2-MOD9` | Multi-Timeframe Analysis | exact | — |
| Entry Models | `L2-MOD10` | Entry Models | exact | — |
| Risk-to-Reward | `L2-MOD11` | Risk-to-Reward | exact | — |
| Trade Management | `L2-MOD12` | Trade Management | exact | — |
| Trading Journal & Backtesting | `L2-MOD13` | Trading Journal & Backtesting | exact | — |
| Fundamental Analysis | `L2-MOD14` | Fundamental Analysis | exact | — |
| Advanced Market Structure | `L3-MOD1` | Advanced Market Structure | exact | — |
| Institutional Order Flow | `L3-MOD2` | Institutional Order Flow | exact | — |
| Smart Money Concepts (SMC) | `L3-MOD3` | Smart Money Concepts (SMC) | exact | — |
| Liquidity Engineering | `L3-MOD4` | Liquidity Engineering | exact | — |
| Inducement | `L3-MOD5` | Inducement | exact | — |
| Displacement | `L3-MOD6` | Displacement | exact | — |
| Mitigation & Re-entries | `L3-MOD7` | Mitigation & Re-entries | exact | — |
| Advanced Order Blocks | `L3-MOD8` | Advanced Order Blocks | exact | — |
| FVG + Liquidity Confluence | `L3-MOD9` | FVG + Liquidity Confluence | exact | — |
| Session & Kill-Zone Analysis | `L3-MOD10` | Session & Kill-Zone Analysis | exact | — |
| Advanced Multi-Timeframe Setups | `L3-MOD11` | Advanced Multi-Timeframe Setups | exact | — |
| Correlation Analysis | `L3-MOD12` | Correlation Analysis | exact | — |
| Advanced Risk Management | `L3-MOD13` | Advanced Risk Management | exact | — |
| Building a Profitable Trading System | `L3-MOD14` | Building a Profitable Trading System | exact | — |
| Strategy Backtesting & Optimization | `L3-MOD15` | Strategy Backtesting & Optimization | exact | — |
| Trading Psychology at Professional Level | `L3-MOD16` | Trading Psychology at Professional Level | exact | — |
| Prop-Firm Risk Management | `L3-MOD17` | Prop-Firm Risk Management | exact | — |
| Advanced Trade Execution | `L3-MOD18` | Advanced Trade Execution | exact | — |
| Creating a Personal Trading Plan | `L3-MOD19` | Creating a Personal Trading Plan | exact | — |
| Becoming a Consistent/Professional Trader | `L3-MOD20` | Becoming a Consistent/Professional Trader | exact | — |
| Putting Everything Together | `L4-MOD1` | Putting Everything Together (Capstone) | partial | DB appends "(Capstone)"; guide heading ends at "Together". |

**The reverse direction: 12 guide headings with no DB module.** These exist in the guide but have no
`course_modules` row. They are the reason the two totals differ, and they are the real finding of
this section.

| Level | Guide heading |
|---|---|
| Intermediate | Market Structure |
| Intermediate | News & Economic Calendar |
| Final Masterclass | Top-down analysis |
| Final Masterclass | Market bias |
| Final Masterclass | Liquidity identification |
| Final Masterclass | Entry confirmation |
| Final Masterclass | SL placement |
| Final Masterclass | TP targeting |
| Final Masterclass | Risk calculation |
| Final Masterclass | Trade management |
| Final Masterclass | Journaling |
| Final Masterclass | Reviewing and improving the strategy |

**Observations.**

- **The Masterclass block is the structural mismatch, not any single title.** The guide gives Final
  Masterclass 11 discrete headings; the DB gives it one row (`L4-MOD1`). Ten taught topics —
  including entry confirmation, SL placement, TP targeting and risk calculation — exist in the
  client's own syllabus with no module to hold them. This is a seeding gap, and it is bigger than
  any wording issue in the table above.
- **"News & Economic Calendar" is the other orphan.** The guide teaches it under Intermediate, and
  it is the natural companion to `L2-MOD14` "Fundamental Analysis" — the only fundamentals topic in
  the whole 47. The DB has the pair's first half and not its second.
- The guide's own body copy is compliance-aware throughout: it repeats "No strategy is guaranteed
  profitable", "A target is a plan, not a promise", "the label is not an entry signal by itself",
  and closes on a full Risk Notice. The DB titles are not held to that standard — see the retitling
  list below.
- **The guide's cover and back page carry the tagline "Profits Forever"** (pp. 1, 12). That is not a
  DB title and so not in the retitling list, but it is the same class of compliance risk as
  `L3-MOD14` sitting on the guide's most prominent surface. Raise with the client independently.
- The old gap note ("Beginner tier omits risk of loss") is **resolved**: `L1-MOD10` "Basic Risk
  Management" exists in both DB and guide, and the guide adds a Risk Notice page. What is still
  absent from both is any dedicated treatment of **broker scams / unregulated brokers**, which
  matters for a Nigerian retail audience.
- `L2-MOD14` "Fundamental Analysis" was previously flagged here as a suspected mis-tier. It is not
  a DB seeding error: the guide also files it under Intermediate alongside the price-action
  sections, so the DB is faithful to its source. It is a guide authoring choice — raise it with the
  client, not with the seeder.
- **Case style drifts inside the guide, and the DB copies the drift faithfully.** Beginner through
  Advanced use Title Case; the Final Masterclass block drops to sentence case ("Top-down analysis",
  "SL placement", "Risk calculation"). If the DB titles are ever normalised, the client should pick
  one convention first — otherwise a tidy-up will silently diverge from 11 guide headings.

### Titles to consider retitling

Titles only — no change to lesson body content is proposed. Each of the first four would move its
row from `exact` to `partial`, so approve the guide-side rename at the same time or accept the
divergence knowingly.

1. **`L3-MOD14` — "Building a Profitable Trading System" → "Designing a Complete Trading System".**
   Highest priority. The word *Profitable* is an outcome promise on a selling surface, and it
   contradicts the guide's own teaching text for that very section ("No strategy is guaranteed
   profitable"). Content cannot fix a title promise.
2. **`L4-MOD1` — "Putting Everything Together (Capstone)" → "Putting Everything Together".**
   Restores the guide's exact heading and drops "(Capstone)", which is internal delivery jargon
   rather than student-facing language.
3. **`L3-MOD20` — "Becoming a Consistent/Professional Trader" → "Becoming a Professional Trader".**
   In retail forex "consistent" reads as consistent returns; the guide's body deliberately defines
   consistency as process adherence, not profit. Also removes the slash.
4. **`L3-MOD16` — "Trading Psychology at Professional Level" → "Trading Psychology at a
   Professional Level".** Grammar only — the guide heading is missing its article. Lowest priority.

---

## Section 3 — Gap Analysis

Currently `course_modules` stores a **catalogue row only**: an ID, a tier, a title, a video pointer
and a lock flag. There is no field capable of holding lesson content. Every candidate below is
therefore absent today.

| Field | Needed? | Reason |
|---|---|---|
| `lesson_body` (TEXT) | **Yes — strictly** | This is the entire deliverable. Without it the content layer has nowhere to live; the module page currently renders only a video iframe (`frontend/src/app/module/[id]/page.tsx:39-53`). |
| `learning_outcomes` (TEXT[]) | **Yes — strictly** | Drives "What You'll Learn" (template §1) and gives the client an at-a-glance approval surface per module. Cheap to store, high review value. |
| `assignment` (TEXT) | **Yes — strictly** | Template §6. The practice assignment is the pedagogic core of a trading school and must be authorable per module. |
| `checkpoint_questions` (JSONB) | **Yes** | Template §7. A lesson with no check is not a lesson. Needs a storage decision (see below). |
| `estimated_minutes` (INT, default 45) | **Nice-to-have** | Useful for pacing and for the frontend, but derivable from study-plan config. Add it now anyway — a defaulted `INT` is free. |
| `formula_snippets` (JSONB) | **Nice-to-have** | Only a minority of modules genuinely carry a formula (`L1-MOD3` pip/lot maths, `L2-MOD11` risk-to-reward, `L3-MOD13` position sizing). Storing JSONB on all 47 rows to serve ~4 is acceptable; normalising is also defensible. |
| `updated_at` (TIMESTAMP) | **Yes — but for provenance, not lessons** | **It does not exist today.** `course_modules` has no timestamp of any kind. Once lesson copy is client-approved and live, you need to know what changed and when. |

**Also missing, and not in the candidate list:**

- `lesson_status` (`draft` / `in_review` / `published`) — **strictly needed.** This is the single most
  important missing field. It is the mechanism that stops an unreviewed AI-authored lesson from
  reaching a paying student, and it lets you ship the schema before the content is written.
- `lesson_updated_at` (TIMESTAMPTZ) — provenance of the *copy*, distinct from row `updated_at`.
- `reviewed_by` (UUID → `users.user_id`) — who signed off the copy. **This is the field that makes
  the client's approval auditable.** Given repo rule 1, I would treat it as required.
- `content_version` (INT) — optional; only worth it if lessons will be revised post-launch.

**Minimum viable set to unblock authoring:** `lesson_body`, `learning_outcomes`, `assignment`,
`checkpoint_questions`, `lesson_status`, `updated_at`.

### Masterclass expansion (verified against guide)

The guide's "Final Masterclass" section contains 11 distinct headings.
The DB currently has exactly one row for this tier (`L4-MOD1`,
"Putting Everything Together"). Ten additional modules are required to
match the guide's scope:

| Proposed module_id | Title (verbatim from guide) | Guide page |
|---|---|---|
| L4-MOD2  | Top-down analysis | p. 10 |
| L4-MOD3  | Market bias | p. 10 |
| L4-MOD4  | Liquidity identification | p. 10 |
| L4-MOD5  | Entry confirmation | p. 10 |
| L4-MOD6  | SL placement | p. 10 |
| L4-MOD7  | TP targeting | p. 10 |
| L4-MOD8  | Risk calculation | p. 10 |
| L4-MOD9  | Trade management | p. 11 |
| L4-MOD10 | Journaling | p. 11 |
| L4-MOD11 | Reviewing and improving the strategy | p. 11 |

**Verification note (Pass 2).** The draft list supplied for this section used
Title-Case titles — "Top-Down Analysis", "Stop-Loss Placement",
"Take-Profit Targeting", and so on. The guide's Final Masterclass headings are
**sentence case**, and two use abbreviated forms: the guide writes
**"SL placement"**, not "Stop-Loss Placement", and **"TP targeting"**, not
"Take-Profit Targeting". The table above carries the guide's verbatim heading
in every row, per the "use the guide's phrasing" rule. Only "Journaling" was
already identical to the draft. This is the same case-style drift flagged in
Section 2.

**Before inserting:** verify each title against the guide's exact
heading text. If the guide uses different phrasing, use the guide's
phrasing.

---

## Section 4 — Proposed Lesson Template

Every lesson is authored to these seven sections, in this order.

1. **What You'll Learn** — 2–3 bullets, plain English. No jargon introduced before it is defined.
   Copy these verbatim into `learning_outcomes`.
2. **Plain-English Explanation** — 200–400 words. Second person. Define every term the first time it
   appears. Analogies are welcome; hype is not.
3. **Real Chart Walkthrough** — 150–250 words. A *hypothetical* setup described with specific
   numbers (pair, price levels, session, timeframe). **Never state or imply what happened next, and
   never imply the reader would have profited.** Every walkthrough must acknowledge the setup can
   and does fail.
4. **Common Mistakes** — 3–5 bullets. Concrete and behavioural (what a beginner *does*), not vague
   warnings.
5. **The SAGZFX Rule** — exactly one sentence. The discipline to internalise. Should be quotable
   and must not promise an outcome.
6. **Practice Assignment** — a specific, checkable task the student can complete in the SAGZFX
   Practice Account.
7. **Checkpoint Question** — one multiple-choice question, 4 options, one correct answer, plus a
   one-line explanation of why. No trick questions.

**Non-negotiable content rules** (derived from `README.md` / `agent.md`, and now confirmed against the
guide's methodology constraints — p.1 Instructor Rule, p.12 Risk Notice):

- No income claims, win rates, return figures, or "you will profit" phrasing, anywhere.
- No implication that the Frankfurter reference feed is broker bid/ask or live Exness/MT5 execution.
- Practice trading is virtual money; say so wherever a student is asked to act.
- Trading risk of loss is stated plainly in any lesson where a position is discussed.
- Professional register throughout — this is a school with a registered RC number, not a signal group.

---

## Section 5 — Filled Example: `L1-MOD1` "Introduction to Forex"

> **Gold-standard sample.** Written before the guide was available in the repo; §6 reconciled to
> the guide's L1-MOD1 activity.

### 1. What You'll Learn

- What the foreign exchange market actually is, and who is on the other side of your trade.
- Why currencies are always quoted in pairs, and what the two prices in a quote mean.
- The three trading sessions that make up the forex day, and why timing changes how a pair behaves.

### 2. Plain-English Explanation

The foreign exchange market is the market where one country's money is exchanged for another's.
When a Nigerian importer pays a supplier in the United States, someone converts naira into dollars.
When a European fund buys Japanese government bonds, someone converts euros into yen. That constant,
worldwide exchange of currencies is what we call forex, or FX.

Forex is decentralised. There is no single exchange building where everyone gathers, the way there
is for stocks. Instead, trading happens through a network of banks, brokers and liquidity providers
who quote prices to one another electronically. The largest participants are central banks,
commercial banks, hedge funds and multinational corporations. Retail traders like you are a small
but genuine part of this market, and you reach it through a broker.

Every forex quote is a pair, because a currency only has value in relation to another currency.
In EUR/USD, the euro is the base currency and the US dollar is the quote currency. A price of 1.0850
means that one euro buys 1.0850 US dollars. When the number rises, the euro has strengthened against
the dollar. When it falls, the euro has weakened.

You will always see two prices for a pair. The bid is the price at which the market will buy from
you if you sell. The ask is the price at which the market will sell to you if you buy. The gap
between them is the spread, and it is the first cost you pay on every trade, before the market has
moved at all.

The market runs twenty-four hours a day, five days a week, following the sun through three sessions.
The Asian session begins the trading day, London follows, and New York overlaps with the second half
of London. The London and New York overlap is generally the busiest period. Session timing matters
because a pair can drift slowly during quiet hours and move far faster when its home session is active.

Finally, understand that forex is leveraged. Leverage lets you control a large position with a small
deposit. It magnifies gains and losses equally, and it is the fastest way for a beginner to lose an
account. Most people who lose money trading do not lose because they cannot read a chart. They lose
because they take positions that are too large for their account. This lesson is education. It is not
a promise of income, and trading carries a real risk of loss.

### 3. Real Chart Walkthrough

Suppose it is a Tuesday morning in London and you are looking at EUR/USD on a daily chart. Over the
past three days, price has bounced between 1.0800 and 1.0860. You mark 1.0860 as resistance and
1.0800 as support.

At 07:30, a European economic release comes in stronger than analysts expected. On your fifteen-minute
chart, a candle closes at 1.0864 — above your resistance line. The next candle opens and holds above
1.0860 rather than dropping straight back below it.

This is the kind of moment where a trader pays attention. It is also the kind where beginners rush.
A more patient approach is to wait for price to return to the broken level near 1.0860 and see whether
it holds, rather than buying the breakout candle itself. If you did participate, the obvious place for
a stop loss would be below the level that had to hold — perhaps near 1.0840, with the spread already
accounted for in your entry price.

Notice what this example does not tell you. It does not tell you that price went on to rise. It might
have reversed immediately and taken the stop loss. Setups of this shape fail regularly, and any honest
description of a trade has to include the possibility of loss.

### 4. Common Mistakes

- Believing forex is a shortcut to fast money rather than a skill that takes years to build.
- Ignoring the spread, and so starting every trade slightly behind.
- Using the maximum leverage the broker offers, because a small deposit feels harmless.
- Trading during quiet sessions because you happen to be awake, rather than when the pair is active.
- Placing a trade without first writing down the price at which you would admit you were wrong.

### 5. The SAGZFX Rule

Before you risk a single naira, you must be able to name the exact price that would prove your trade wrong.

### 6. Practice Assignment

Use sample currency pairs and identify the base and quote currency in
each one. For example, in EUR/USD the euro is the base and the US
dollar is the quote. Write down what each pair is comparing and what a
rising number would mean for the base currency.

*Why this matters:* learning to read a pair as a comparison — not as a
price to buy or sell — is the foundation for every later lesson.

### 7. Checkpoint Question

In the quote **EUR/USD = 1.0850**, which currency is the base currency, and what does the number mean?

- A. USD is the base currency; 1 USD buys 1.0850 EUR.
- **B. EUR is the base currency; 1 EUR buys 1.0850 USD.** ✅
- C. EUR is the base currency; 1 USD buys 1.0850 EUR.
- D. USD is the base currency; 1 EUR buys 1.0850 USD.

**Why:** The first currency in the pair is always the base. The number states how much of the second
currency (the quote currency) one unit of the base currency buys.

**Word count:** **849 words** for the lesson body (§1–§6, section headings excluded).
Including the §7 checkpoint block, **946 words**. Target was 800–1,000 — §1–§6 sits inside it.

---

## Section 6 — Migration Proposal

**NOT EXECUTED.** Do not run any of this without explicit approval, and per repo rule 3 the migration
must be applied to Neon before any code depending on it is deployed. All statements are idempotent.

### 6.1 Columns on `course_modules`

```sql
ALTER TABLE course_modules
  ADD COLUMN IF NOT EXISTS lesson_body        TEXT,
  ADD COLUMN IF NOT EXISTS learning_outcomes  TEXT[],
  ADD COLUMN IF NOT EXISTS assignment         TEXT,
  ADD COLUMN IF NOT EXISTS checkpoint_questions JSONB,
  ADD COLUMN IF NOT EXISTS formula_snippets   JSONB,
  ADD COLUMN IF NOT EXISTS estimated_minutes  INT NOT NULL DEFAULT 45,
  ADD COLUMN IF NOT EXISTS lesson_status      VARCHAR(20) NOT NULL DEFAULT 'draft',
  ADD COLUMN IF NOT EXISTS lesson_updated_at  TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS updated_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS reviewed_by        UUID REFERENCES users(user_id) ON DELETE SET NULL;

ALTER TABLE course_modules
  DROP CONSTRAINT IF EXISTS course_modules_lesson_status_check;

ALTER TABLE course_modules
  ADD CONSTRAINT course_modules_lesson_status_check
  CHECK (lesson_status IN ('draft', 'in_review', 'published'));

CREATE INDEX IF NOT EXISTS idx_course_modules_lesson_status
  ON course_modules (lesson_status);
```

**Notes.** `lesson_status` defaults to `'draft'` so that adding these columns publishes nothing —
the content layer ships dark until copy is approved. `reviewed_by` is `ON DELETE SET NULL` so a
departed staff account cannot cascade-delete curriculum. `estimated_minutes` is `NOT NULL DEFAULT 45`
because a non-null default backfills existing rows in one statement without a separate `UPDATE`.

### 6.2 `lesson_formulas` — only if `formula_snippets` is normalised

```sql
CREATE TABLE IF NOT EXISTS lesson_formulas (
  formula_id   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  module_id    VARCHAR(20) NOT NULL REFERENCES course_modules(module_id) ON DELETE CASCADE,
  name         VARCHAR(80)  NOT NULL,
  expression   TEXT         NOT NULL,
  explanation  TEXT,
  sort_order   INT          NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ  NOT NULL DEFAULT now(),
  UNIQUE (module_id, name)
);

CREATE INDEX IF NOT EXISTS idx_lesson_formulas_module
  ON lesson_formulas (module_id, sort_order);
```

### 6.3 `lesson_checkpoints` — only if checkpoint questions are normalised

```sql
CREATE TABLE IF NOT EXISTS lesson_checkpoints (
  checkpoint_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  module_id     VARCHAR(20) NOT NULL REFERENCES course_modules(module_id) ON DELETE CASCADE,
  prompt        TEXT        NOT NULL,
  options       JSONB       NOT NULL,
  correct_index SMALLINT    NOT NULL CHECK (correct_index BETWEEN 0 AND 3),
  explanation   TEXT,
  sort_order    INT         NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_lesson_checkpoints_module
  ON lesson_checkpoints (module_id, sort_order);

-- Constraint: options must be a JSON array of exactly 4 strings.
ALTER TABLE lesson_checkpoints
  DROP CONSTRAINT IF EXISTS lesson_checkpoints_options_shape;

ALTER TABLE lesson_checkpoints
  ADD CONSTRAINT lesson_checkpoints_options_shape
  CHECK (jsonb_typeof(options) = 'array' AND jsonb_array_length(options) = 4);
```

### 6.4 JSONB column vs. normalised table — the tradeoff

| | JSONB column on `course_modules` | Normalised table |
|---|---|---|
| Read path | One row, no join. The module detail query already does `db.get(CourseModule, module_id)` — zero change. | Requires a join or a second query per module in `get_module`. |
| Write/approval | The whole lesson is one atomic row update, matching how `lesson_status` will be flipped. | Multi-statement: module row plus N child rows. Needs a transaction. |
| Revision safety | Whole-blob overwrite. Easy to diff, easy to store a previous version. | Row-level edits; harder to snapshot a lesson version. |
| Queryability | Poor. "Which lessons use a position-size formula?" needs `jsonb_path` work. | Trivial. |
| Per-question analytics | Not possible without unpacking the blob. | Natural — a `student_checkpoint_attempts` table can FK to `checkpoint_id`. |
| Migration cost | One `ALTER TABLE`. | Two `CREATE TABLE`s plus constraints, FK to `users`/`course_modules`. |

**Recommendation:** store `formula_snippets` as **JSONB** — only ~4 of 47 modules need it, and nothing
will ever query it. Store checkpoint questions as **JSONB initially**, then normalise to
`lesson_checkpoints` at the moment you decide to record student answers. Normalising before there is
an attempts table buys indexing you do not yet query and a join on the hottest read path. The schema
above is written so that normalising later is purely additive — the JSONB column can be backfilled
from the table and dropped, with no client-visible change.

---

## Section 7 — Content File Layout Proposal

No `frontend/content/` directory exists today — this is entirely new. Authored lessons live as
Markdown in the repo and are reviewed by diff, which is the point: curriculum copy changes then go
through CI and code review like everything else.

```
frontend/
  content/
    lessons/
      Beginner/
        L1-MOD1.md
        L1-MOD2.md
        ...
        L1-MOD12.md
      Market-Structure/
        L2-MOD1.md
        ...
        L2-MOD14.md
      Advanced/
        L3-MOD1.md
        ...
        L3-MOD20.md
      Masterclass/
        L4-MOD1.md
      _templates/
        lesson.template.md
```

**Folder names are slugified** (`Market-Structure`, not `Market Structure`) so paths need no escaping
and stay stable across platforms. They map 1:1 to the `tier_level` values in `course_modules`;
the mapping table should live in the loader, not be re-derived by string munging.

**Front-matter for `L1-MOD1.md`:**

```yaml
---
module_id: L1-MOD1
tier: Beginner
title: Introduction to Forex
estimated_minutes: 45
lesson_status: draft
learning_outcomes:
  - What the foreign exchange market is, and who is on the other side of your trade.
  - Why currencies are quoted in pairs, and what the two prices in a quote mean.
  - The three trading sessions that make up the forex day.
reviewed_by: null
lesson_updated_at: 2026-10-12
---
```

**Rules for this layout:**

- `module_id` in front-matter is the join key to `course_modules` and must match exactly. The loader
  should fail loudly on an unknown `module_id` rather than silently skipping the file.
- `lesson_status: draft` is the default for every new file. Nothing reaches a student until it is
  flipped to `published` after client sign-off.
- The front-matter fields mirror the proposed DB columns exactly, so a sync script can populate
  `lesson_body` / `learning_outcomes` / etc. from the files without bespoke mapping logic.
- The `_templates/lesson.template.md` file is the Section 4 template, and the loader must ignore
  any path beginning with `_`.

**Open decision for the client:** whether Markdown files are the *source of truth* (synced into the
DB on deploy) or merely the *authoring* format (one-way import, DB authoritative afterwards). The
first keeps review in git and is simpler; the second allows post-launch edits from an admin panel.
This audit assumes the first.

---

## Section 8 — Masterclass Expansion

### The gap
- Guide's Final Masterclass section: 11 headings
- DB's Masterclass tier: 1 row (`L4-MOD1`)

### Proposed additions

Titles are the guide's verbatim headings — see the verification note in
Section 3 for why they are sentence case rather than Title Case.

| Proposed module_id | Title (verbatim from guide) | Guide page |
|---|---|---|
| L4-MOD2  | Top-down analysis | p. 10 |
| L4-MOD3  | Market bias | p. 10 |
| L4-MOD4  | Liquidity identification | p. 10 |
| L4-MOD5  | Entry confirmation | p. 10 |
| L4-MOD6  | SL placement | p. 10 |
| L4-MOD7  | TP targeting | p. 10 |
| L4-MOD8  | Risk calculation | p. 10 |
| L4-MOD9  | Trade management | p. 11 |
| L4-MOD10 | Journaling | p. 11 |
| L4-MOD11 | Reviewing and improving the strategy | p. 11 |

### Tier naming — no change

The guide calls the second tier "Intermediate"; the DB uses
"Market Structure". `app/core/access_policy.py` MODULE_PLAN keys off the
literal string "Market Structure". Renaming would require touching three
places (MODULE_PLAN dict, all 14 tier_level values, and the frontend
render path). Decision: leave as-is, document the divergence, and display
"Intermediate" as a subtitle in the frontend if desired.

### Migration path

Additions go in `migrations/007_masterclass_expansion.sql`, idempotent
(`INSERT ... ON CONFLICT (module_id) DO NOTHING`), applied after
`migrations/006_lesson_content.sql`.

---

## Section 9 — Migration Mechanics

New migrations for this project follow the raw-SQL convention:

- Location: `migrations/`
- Naming: `00N_description.sql`
- Style: idempotent (`IF NOT EXISTS`, `ON CONFLICT DO NOTHING`)
- Application: manual, via a small Python runner or `psql`
- Tracking: none — verify by inspecting `information_schema`

Two migrations are planned:
- `migrations/006_lesson_content.sql` — new columns on course_modules
- `migrations/007_masterclass_expansion.sql` — 10 new module rows
