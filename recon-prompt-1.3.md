# AGENT 1.3 — AUDIT CROSS-REFERENCE CLEANUP
## SAGZFX ACADEMY — Final Recon Pass

ROLE: You are completing the Recon mission for SAGZFX ACADEMY.

MISSION (STRICT, SMALL): Fix four specific stale cross-references in
`recon/curriculum-audit.md` left over from the 1.2 pass. Add nothing.
Remove nothing else.

INPUTS TO READ (in this order):
1. `recon/curriculum-audit.md`
2. `SagzFX_Academy_Full_Forex_Teaching_Guide.pdf` (for word-count verification only)

EDIT TARGETS (all inside recon/curriculum-audit.md ONLY):

## Edit 1 — Fix Section 5 word count
Around line 416, there is a line reading approximately:
    "**Word count:** **888 words** for the lesson body (§1–§6, section headings excluded).
     Including the §7 checkpoint block, **1,032 words**."

The current §1–§6 body of Section 5 is **849 words** (excluding the six `### N.`
heading lines and the checkpoint §7 block).
Replace the stale 888 with 849, and recompute the "including §7" number honestly
by counting the §7 block (question + 4 options + why line) and adding it to 849.

## Edit 2 — Remove stale Blocker reference at ~line 89
Find a clause in the Section 2 preamble reading approximately:
    "read this section, not the Blocker above"
Delete that clause and any comma/parenthesis that depends on it.
The sentence must still read grammatically after removal.

## Edit 3 — Remove stale Blocker reference at ~line 319
Find a parenthetical in Section 5's preamble reading approximately:
    "Written without the client guide present (see Blocker)"
Replace with:
    "Written before the guide was available in the repo; §6 reconciled to
     the guide's L1-MOD1 activity."

## Edit 4 — Fix stale §4 caveats at ~lines 302, 306–307
In Section 4 (Proposed Lesson Template), item 6 (Practice Assignment) reads
approximately:
    "*(Must be reconciled against the client's guide once available.)*"
Delete this parenthetical — the reconciliation is now done in Section 5.

A nearby preamble line references:
    "the missing CONSTRAINTS block"
Replace with:
    "the methodology constraints now sourced from the guide (p.1 Instructor Rule
     and p.12 Risk Notice)."

HARD CONSTRAINTS:
- Edit ONLY `recon/curriculum-audit.md`.
- Do NOT modify any other file.
- Do NOT change Section 2's table rows, Section 5's lesson body, Section 6's SQL
  block, Section 7's file layout, or Sections 8–9.
- Preserve everything else byte-identical.
- After Edit 1, verify the new word count by actual counting; do NOT estimate.
  Print the raw wc -w result for the §1–§6 body before you write the final number.

WHEN DONE, print:
- `recon/curriculum-audit.md`
- The four line numbers you edited
- The measured §1–§6 word count and the §7 block word count
- Confirmation that Section 2, Section 5 body, Section 6, Section 7, Section 8,
  Section 9 are all byte-identical to pre-edit
