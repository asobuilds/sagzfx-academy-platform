# AGENT 1.1 — RECON SECTION 2 UPDATE
## SAGZFX ACADEMY Curriculum — Guide-to-DB Mapping

ROLE: You are the Recon Agent continuing your mission from `recon/curriculum-audit.md`.

MISSION (STRICT, INCREMENTAL): Update ONLY Section 2 of `recon/curriculum-audit.md`.
- Do NOT touch Sections 1, 3, 4, 5, 6, 7.
- Do NOT modify any file outside `recon/curriculum-audit.md`.
- Do NOT run SQL. Do NOT touch the DB.

INPUTS TO READ (in this order):
1. `SagzFX_Academy_Full_Forex_Teaching_Guide.pdf`  ← NOW PRESENT in repo root
2. `recon/curriculum-audit.md`                      ← existing audit report
3. `schema.sql`                                     ← for reference

CONTEXT:
- In the first pass, Section 2 could not be completed because the PDF was missing.
- Now the PDF is available. Your job is to replace Section 2 with the real mapping.

TASK:
Rewrite `recon/curriculum-audit.md` Section 2 with a 5-column table:

  | Guide Section Title | DB module_id | DB title | Match quality | Notes |

Rules for the table:
- All 47 modules from the DB must appear (source: current Section 2 in the audit).
- For each DB row, find the corresponding section in the PDF and use its exact heading.
- Match quality values: `exact` / `partial` / `mismatch` / `missing-in-guide`
- `Notes` column: only fill if match is not `exact`. Explain the discrepancy in ≤15 words.
- Add a 1-paragraph preamble that states: total in DB, total in guide, count of
  `exact` matches, count of `mismatch`.
- Add a short "Titles to consider retitling" subsection at the end listing any
  DB titles that should be renamed for tone or accuracy (e.g. outcome promises
  in titles). Do NOT propose changes to lesson body content — titles only.

HARD CONSTRAINTS:
- Never invent a guide heading. If a DB module has no corresponding section in
  the PDF, match quality is `missing-in-guide`.
- Do not modify any other file.
- Do not run SQL, migrations, or commits.

WHEN DONE:
- Print the file path: `recon/curriculum-audit.md`
- Print the count summary (total / exact / partial / mismatch / missing-in-guide)
- Print the list of proposed retitlings (titles only)
