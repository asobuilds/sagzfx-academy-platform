# AGENT 2 — PHASE B MIGRATION AUTHORING
## SAGZFX ACADEMY — Lesson Content + Masterclass Expansion

ROLE: You are the Migration Agent. You author two SQL files. You do NOT execute
them. You do NOT touch the database. You do NOT modify application code.

MISSION (STRICT): Create exactly TWO files:
1. `migrations/006_lesson_content.sql`
2. `migrations/007_masterclass_expansion.sql`

Read context, verify facts against the guide, write idempotent SQL, stop.

INPUTS TO READ (in this order):
1. `SagzFX_Academy_Full_Forex_Teaching_Guide.pdf`         ← source of truth for titles
2. `recon/curriculum-audit.md`                            ← Sections 3, 6, 8, 9
3. `migrations/`                                          ← list directory; see 001–005 for style
4. `schema.sql`                                           ← current course_modules columns
5. `app/models/course.py`                                 ← ORM mirror

INSPECT FIRST, THEN WRITE — report your findings before writing any SQL:

A. Read every file in `migrations/` (001 through 005). Report:
   - File naming convention used
   - Whether files use IF NOT EXISTS / ON CONFLICT patterns
   - Whether files are wrapped in BEGIN/COMMIT or rely on auto-commit
   - Whether any migration already adds columns to `course_modules`
   - Whether any migration already touches `lesson_status` or similar

B. Inspect `schema.sql` for the current `course_modules` shape. Report every
   column that exists today, in order, with type + nullability.

C. Read the guide's "Final Masterclass" section (page 10). Extract the exact
   heading text for each of the 11 sub-topics. Report them verbatim
   (sentence case, not Title Case).

D. Cross-check against `recon/curriculum-audit.md` Section 8. Note any
   divergence between the audit's list and the guide's actual headings.

THEN, AFTER REPORTING A–D, write the two files:

## File 1 — `migrations/006_lesson_content.sql`

Purpose: Add 10 new columns to `course_modules` to store lesson content.
All statements idempotent. Match the style of migrations 001–005.

Required columns:
- lesson_body           TEXT                  (nullable)
- learning_outcomes     TEXT[]                (nullable)
- assignment            TEXT                  (nullable)
- checkpoint_questions  JSONB                 (nullable)
- formula_snippets      JSONB                 (nullable)
- estimated_minutes     INT NOT NULL DEFAULT 45
- lesson_status         VARCHAR(20) NOT NULL DEFAULT 'draft'
- lesson_updated_at     TIMESTAMPTZ           (nullable)
- updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()  (only if it does not already exist)
- reviewed_by           UUID REFERENCES users(user_id) ON DELETE SET NULL  (nullable)

Also add:
- CHECK constraint: lesson_status IN ('draft','in_review','published')
- INDEX on lesson_status

Idempotency:
- ADD COLUMN IF NOT EXISTS
- DROP CONSTRAINT IF EXISTS before ADD CONSTRAINT
- CREATE INDEX IF NOT EXISTS

Include a header comment block:
    -- Migration: 006_lesson_content
    -- Author: Migration Agent
    -- Date: <today>
    -- Purpose: Add lesson content columns to course_modules
    -- Idempotency: safe to re-run

## File 2 — `migrations/007_masterclass_expansion.sql`

Purpose: Add 10 new Masterclass module rows and retitle one existing row.

Part 1 — Insert 10 new rows into `course_modules`:
- module_id: L4-MOD2 through L4-MOD11
- tier_level: 'Masterclass'
- title: the guide's verbatim heading text (sentence case)
- video_url_slug: NULL (client provides later)
- is_premium_locked: TRUE
- sort_order: 48 through 57
- Use INSERT ... ON CONFLICT (module_id) DO NOTHING

Part 2 — Retitle L3-MOD14:
- Current title: 'Building a Profitable Trading System'
- New title: 'Building a Repeatable Trading System'
- Use UPDATE ... WHERE module_id = 'L3-MOD14' AND title = 'Building a Profitable Trading System'
  (so re-running is a no-op after the first application)
- Add a comment explaining WHY: the original title contains an outcome promise
  that contradicts the guide's own first line on page 1 ("Do not teach any setup
  as a guaranteed signal").

Also include:
- A verification query at the end (as a comment, not executed):
    -- Verify: SELECT module_id, title FROM course_modules WHERE tier_level = 'Masterclass' ORDER BY sort_order;

Header comment block matching File 1's style.

HARD CONSTRAINTS:
- Author SQL only. Do NOT execute anything.
- Do NOT connect to the database.
- Do NOT modify any file outside `migrations/`.
- Do NOT modify schema.sql, app/, or frontend/.
- Do NOT create additional files beyond the two specified.
- Every statement must be idempotent.
- Masterclass titles MUST match the guide verbatim (sentence case).

WHEN DONE, print:
- The two file paths
- The verbatim list of 10 Masterclass titles you used, with page numbers
- The list of columns added in 006
- Confirmation that no other file was modified
