# AGENT 4 — CONTENT CLEANUP
## SAGZFX ACADEMY — Phase C Final Pass

ROLE: Cleanup agent. Fix two specific issues in the lesson corpus.

MISSION (STRICT): Two mechanical edits only. Do not rewrite lessons.

INPUTS:
1. `SagzFX_Academy_Full_Forex_Teaching_Guide.pdf` — for the "setup can fail" reference
2. All 57 lesson files in `frontend/content/lessons/`
3. `frontend/content/lessons/_templates/lesson.template.md` — the 7-section spec

TARGETS:

## Fix 1 — Trim Advanced lessons to spec

The 20 files in `frontend/content/lessons/Advanced/` (L3-MOD1 through L3-MOD20)
exceed the specified word count for sections §1–§6. The spec is **800–1,000
words for §1–§6, excluding front-matter, section headings, and the §7 checkpoint**.

For each Advanced file:
- Measure §1–§6 body words (exclude front-matter, exclude §7 onward, exclude
  the ## N. section headings themselves).
- If the count exceeds 1,000, trim to land in the 900–1,000 range.
- Trim by:
  - Removing redundant sentences in §2 (Plain-English Explanation)
  - Tightening §4 (Common Mistakes) bullets to one line each
  - Removing any §3 Chart Walkthrough sentences that repeat the framing
    already covered by the "setup can fail" acknowledgement
- Do NOT remove:
  - The learning outcomes in front-matter
  - The "setup can and does fail" acknowledgement in §3
  - Any definition of a term the first time it appears
  - The SAGZFX Rule (§5)
  - The Practice Assignment (§6)
  - The Checkpoint Question (§7)
- Preserve front-matter structure exactly (module_id, tier, title,
  estimated_minutes, lesson_status, learning_outcomes, reviewed_by,
  lesson_updated_at).

## Fix 2 — Add missing "setup can fail" line to Beginner lessons

Four Beginner files are missing the §3 requirement that the walkthrough
explicitly acknowledge the setup can fail:

- `frontend/content/lessons/Beginner/L1-MOD2.md`
- `frontend/content/lessons/Beginner/L1-MOD3.md`
- `frontend/content/lessons/Beginner/L1-MOD5.md`
- `frontend/content/lessons/Beginner/L1-MOD6.md`

For each:
- Locate §3 (Real Chart Walkthrough).
- Ensure the section ends with a sentence acknowledging the setup can fail.
- If a similar sentence already exists in slightly different wording, leave it.
- If nothing similar exists, add ONE sentence at the end of §3:
  "Setups of this shape fail regularly, and any honest description of a
   trade has to include the possibility of loss."

HARD CONSTRAINTS:
- Edit ONLY files in `frontend/content/lessons/Advanced/` and the four named
  Beginner files. Do NOT touch any other directory or file.
- Do NOT rewrite lessons. Do NOT change titles. Do NOT touch front-matter
  beyond preserving it.
- Do NOT modify the template file or any file outside the two targets.
- Do NOT touch the database, migrations, or app/.
- Do NOT write to Claude Code project memory.

WHEN DONE, print:
- For each of the 20 Advanced files: before-word-count, after-word-count (§1–§6)
- For each of the 4 Beginner files: "already-compliant" or "added-line"
- Confirmation that no file outside the target lists was modified
