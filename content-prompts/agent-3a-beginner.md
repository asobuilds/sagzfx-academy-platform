# AGENT 3A — BEGINNER CONTENT GENERATION
## SAGZFX ACADEMY — Phase C, Tier 1 of 4

ROLE: Content author for SAGZFX ACADEMY's Beginner tier.

MISSION: Generate 12 Markdown lesson files for the Beginner tier.
Write ONLY to `frontend/content/lessons/Beginner/`. Do NOT touch any other folder.

INPUTS:
1. `SagzFX_Academy_Full_Forex_Teaching_Guide.pdf` — the client's guide
2. `frontend/content/lessons/_templates/lesson.template.md` — the 7-section structure
3. `recon/curriculum-audit.md` — Section 5 has the L1-MOD1 gold-standard example
4. The database — you may query `course_modules` to confirm titles, but you do NOT modify the DB

DELIVERABLES: 12 files in `frontend/content/lessons/Beginner/`

| File | Title (verbatim from DB) |
|---|---|
| L1-MOD1.md  | Introduction to Forex |
| L1-MOD2.md  | Currency pairs & market sessions |
| L1-MOD3.md  | Pips, lots, spreads & leverage |
| L1-MOD4.md  | Buy/Sell & order types |
| L1-MOD5.md  | Trading platforms (MT4/MT5) |
| L1-MOD6.md  | Candlestick basics |
| L1-MOD7.md  | Support & Resistance |
| L1-MOD8.md  | Trendlines & market direction |
| L1-MOD9.md  | Stop Loss & Take Profit |
| L1-MOD10.md | Basic Risk Management |
| L1-MOD11.md | Trading Psychology |
| L1-MOD12.md | How to read a simple chart |

SOURCE MATERIAL: the guide's Beginner section. Each lesson's
"Teach it simply" paragraph is the seed. Expand to 800-1000 words following
the 7-section template.

HARD CONSTRAINTS (non-negotiable):
- Never teach a setup as a guaranteed signal.
- Never claim the chart proves institutional orders.
- Never promise profit, win rates, or specific percentage returns.
- Every chart walkthrough uses hypothetical numbers and explicitly says the
  setup can fail.
- Language: plain, professional, second person ("you"). No hype.
- Every lesson body is 800-1000 words (§1-§6), excluding the checkpoint.
- Every lesson ends with The SAGZFX Rule — exactly one sentence.

FRONT-MATTER (must match this shape):
    ---
    module_id: L1-MOD1
    tier: Beginner
    title: Introduction to Forex
    estimated_minutes: 45
    lesson_status: draft
    learning_outcomes:
      - ...
      - ...
      - ...
    reviewed_by: null
    lesson_updated_at: 2026-10-13
    ---

CHECKPOINT FORMAT (§7):
    **Question:** ...
    - A. ...
    - B. ...
    - C. ...
    - D. ...
    **Correct answer:** B
    **Why:** one-line explanation

WHEN DONE:
- List the 12 files created
- Print the total word count of §1-§6 for L1-MOD1, L1-MOD6, L1-MOD12
- Do NOT touch any other directory
- Do NOT commit
