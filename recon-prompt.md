# AGENT 1 — RECON MISSION
## SAGZFX ACADEMY Curriculum System Audit

ROLE: You are the Recon Agent for the SAGZFX ACADEMY curriculum system.

MISSION (STRICT): Produce a read-only audit report.
- Write NO application code. NO SQL execution. NO migrations applied.
- Read only. Create exactly ONE output file: `recon/curriculum-audit.md`

READ FIRST (in this order):
1. `schema.sql` — current PostgreSQL schema (source of truth for DB shape)
2. `app/models/course.py` — ORM view of `course_modules`
3. `app/models/__init__.py` — all registered models
4. `app/api/v1/curriculum.py` — current endpoints + tier-gating logic
5. `app/schemas/curriculum.py` — current Pydantic response shapes
6. `SagzFX_Academy_Full_Forex_Teaching_Guide.pdf` (attached/repo) — client's content source

CONTEXT:
- Platform: SAGZFX ACADEMY (Nigeria forex trading school, RC 8064497)
- Backend: FastAPI + SQLAlchemy async + Neon PostgreSQL
- Frontend: Next.js 16 (already scaffolded)
- The client has provided 47 module topics in the guide (matching the 47 rows
  already in the `course_modules` table).
- We are building the STUDENT-FACING LESSON CONTENT LAYER on top of that
  skeleton.

DELIVERABLE — `recon/curriculum-audit.md` MUST contain these 7 sections:

## Section 1 — Current State Snapshot
- Table showing every column of `course_modules` (name, type, nullable, default)
- Row count
- One sample row rendered as JSON
- Total: no more than 40 lines

## Section 2 — Guide-to-DB Mapping
A markdown table with 4 columns:
  | Guide Section Title | DB module_id | DB title | Match quality |
- All 47 modules MUST appear
- Match quality values: exact / partial / missing / mismatch
- If the DB title and guide title differ materially, flag it

## Section 3 — Gap Analysis
What fields are missing from `course_modules` to store a full lesson?
Candidate additions (evaluate each, mark Yes/No + reason):
  - lesson_body            (TEXT, the full 800-1000 word lesson)
  - learning_outcomes      (TEXT[], 2-4 bullets)
  - assignment             (TEXT, the practical activity)
  - checkpoint_questions   (JSONB, 1-5 multiple-choice questions)
  - formula_snippets       (JSONB, for position size / pip value / RR calcs)
  - estimated_minutes      (INT, default 45)
  - updated_at             (TIMESTAMP, already? check)
Report: which of these are strictly needed vs. nice-to-have.

## Section 4 — Proposed Lesson Template
A 7-section template to be filled by future content agents:
  1. What You'll Learn       (2-3 bullets, plain English)
  2. Plain-English Explanation (200-400 words)
  3. Real Chart Walkthrough  (150-250 words, describe a hypothetical setup
                              using specific numbers; NO promises of outcome)
  4. Common Mistakes         (3-5 bullets)
  5. The SAGZFX Rule         (1 sentence — the discipline to internalize)
  6. Practice Assignment     (adapted from the client's guide)
  7. Checkpoint Question     (1 multiple-choice with 4 options + correct answer)

## Section 5 — Filled Example: L1-MOD1 ("Introduction to Forex")
Write the FULL lesson to the template above.
- Target: 800-1000 words
- Plain English, second person ("you"), professional
- MUST respect the client's methodology rules (see CONSTRAINTS below)
- This will be the gold-standard sample the client approves.
- Print total word count at the end.

## Section 6 — Migration Proposal (SQL text only, DO NOT EXECUTE)
- ALTER TABLE `course_modules` statements for the fields selected in Section 3
- CREATE TABLE `lesson_formulas` if formula_snippets are normalized
  (propose the schema; explain tradeoff vs. JSONB column)
- CREATE TABLE `lesson_checkpoints` if questions are normalized
- All statements must be idempotent (`IF NOT EXISTS`)
- DO NOT run any SQL. Output the statements only.

## Section 7 — Content File Layout Proposal
- Proposed folder structure for authored Markdown:
  `frontend/content/lessons/<TIER>/<module_id>.md`
- Example front-matter header for `L1-MOD1.md`:
  ```yaml
  ---
  module_id: L1-MOD1
  tier: Beginner
  title: Introduction to Forex
  estimated_minutes: 45
  ---
  ```
