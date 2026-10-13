# AGENT 1.2 — AUDIT CLEANUP
## SAGZFX ACADEMY — Recon Follow-up

ROLE: You are continuing the Recon mission for SAGZFX ACADEMY.

MISSION (STRICT, INCREMENTAL): Fix three specific inaccuracies in
`recon/curriculum-audit.md`. Add two new sections. Do NOT touch anything
else.

INPUTS TO READ (in this order):
1. `recon/curriculum-audit.md`                              ← the audit
2. `SagzFX_Academy_Full_Forex_Teaching_Guide.pdf`           ← now in repo root
3. `app/core/access_policy.py`                              ← for tier-naming context
4. `migrations/` (list directory)                           ← to see existing convention

EDIT TARGETS (all inside recon/curriculum-audit.md ONLY):

## Edit 1 — Replace the Blocker (lines 12–34)
Delete lines 12–34 entirely (the section that falsely claims the PDF
was missing and the audit is incomplete). Replace with:

    ## Provenance

    This report was produced in two passes against different inputs.

    - **Pass 1** had no access to `SagzFX_Academy_Full_Forex_Teaching_Guide.pdf`,
      which was absent from the repo. Sections 1 and 3–7 date from this pass.
    - **Pass 2** read the guide (12 pages, now in the repo root) and replaced
      Section 2 entirely. The guide also supplied the methodology constraints
      that Pass 1 had reconstructed from `README.md` and `agent.md`.

    Residual from Pass 1: Section 5's lesson was written before the guide was
    available and has now been reconciled against it (see updated §6).

## Edit 2 — Remove the stale Section 2 preamble line
Find the line in Section 2's preamble that reads approximately:
    "The Blocker is stale and is left untouched only because this pass was
     scoped to Section 2 alone."
Delete that line. The Provenance note replaces its function.

## Edit 3 — Rewrite Section 5 §6 (L1-MOD1 Practice Assignment)
The current assignment sends students to the SAGZFX Practice Account.
The guide's L1-MOD1 activity is simpler. Replace the assignment with:

    ### 6. Practice Assignment

    Use sample currency pairs and identify the base and quote currency in
    each one. For example, in EUR/USD the euro is the base and the US
    dollar is the quote. Write down what each pair is comparing and what a
    rising number would mean for the base currency.

    *Why this matters:* learning to read a pair as a comparison — not as a
    price to buy or sell — is the foundation for every later lesson.

## Edit 4 — Update Section 1 with migration-mechanics note
At the end of Section 1, add a short paragraph:

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

## Edit 5 — Update Section 3 with Masterclass expansion finding
Add to Section 3 (Gap Analysis) a new subsection:

    ### Masterclass expansion (verified against guide)

    The guide's "Final Masterclass" section contains 11 distinct headings.
    The DB currently has exactly one row for this tier (`L4-MOD1`,
    "Putting Everything Together"). Ten additional modules are required to
    match the guide's scope:

    | Proposed module_id | Title (verify against PDF before inserting) |
    |---|---|
    | L4-MOD2  | Top-Down Analysis |
    | L4-MOD3  | Market Bias |
    | L4-MOD4  | Liquidity Identification |
    | L4-MOD5  | Entry Confirmation |
    | L4-MOD6  | Stop-Loss Placement |
    | L4-MOD7  | Take-Profit Targeting |
    | L4-MOD8  | Risk Calculation |
    | L4-MOD9  | Trade Management |
    | L4-MOD10 | Journaling |
    | L4-MOD11 | Reviewing and Improving Your Strategy |

    **Before inserting:** verify each title against the guide's exact
    heading text. If the guide uses different phrasing, use the guide's
    phrasing.

## Edit 6 — Add new Section 8 (Masterclass Expansion)
Add to the END of the audit (after Section 7) a new Section 8:

    ## Section 8 — Masterclass Expansion

    ### The gap
    - Guide's Final Masterclass section: 11 headings
    - DB's Masterclass tier: 1 row (`L4-MOD1`)

    ### Proposed additions
    (Repeat the table from Edit 5)

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

## Edit 7 — Add new Section 9 (Migration Mechanics)
Add a final Section 9:

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

HARD CONSTRAINTS:
- Edit ONLY `recon/curriculum-audit.md`. Do NOT create any other file.
- Do NOT run SQL. Do NOT touch the database.
- Do NOT modify any file in `app/`, `frontend/`, or `migrations/`.
- Preserve every other section of the audit byte-identical (Sections 2, 4, 6,
  7 and the corrected Section 5 word count line).
- Verify each of the 10 proposed Masterclass titles against the guide PDF
  before including it. If the guide uses different phrasing, use the guide's.
- Do NOT modify `SagzFX_Academy_Full_Forex_Teaching_Guide.pdf`.

WHEN DONE, print:
- `recon/curriculum-audit.md`
- Confirmation that Sections 2, 4, 6, 7 are byte-identical to pre-edit
- The verified list of 10 Masterclass titles with their source page in the PDF
