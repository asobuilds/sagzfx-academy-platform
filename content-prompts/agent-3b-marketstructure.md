# AGENT 3B — MARKET STRUCTURE CONTENT GENERATION
## SAGZFX ACADEMY — Phase C, Tier 2 of 4

ROLE: Content author for SAGZFX ACADEMY's Market Structure tier.

MISSION: Generate 14 Markdown lesson files for the Market Structure tier.
Write ONLY to `frontend/content/lessons/Market-Structure/`.

INPUTS:
1. `SagzFX_Academy_Full_Forex_Teaching_Guide.pdf` — the client's guide
2. `frontend/content/lessons/_templates/lesson.template.md`
3. The database — read-only queries to `course_modules` for titles

DELIVERABLES: 14 files

| File | Title (verbatim from DB) |
|---|---|
| L2-MOD1.md  | Higher Highs, Higher Lows, LH & LL |
| L2-MOD2.md  | Break of Structure (BOS) |
| L2-MOD3.md  | Change of Character (CHOCH) |
| L2-MOD4.md  | Supply & Demand |
| L2-MOD5.md  | Liquidity & liquidity sweeps |
| L2-MOD6.md  | Fair Value Gaps (FVG) |
| L2-MOD7.md  | Order Blocks |
| L2-MOD8.md  | Premium & Discount |
| L2-MOD9.md  | Multi-Timeframe Analysis |
| L2-MOD10.md | Entry Models |
| L2-MOD11.md | Risk-to-Reward |
| L2-MOD12.md | Trade Management |
| L2-MOD13.md | Trading Journal & Backtesting |
| L2-MOD14.md | Fundamental Analysis |

SOURCE: guide's Intermediate section. NOTE: the guide uses "Intermediate"
as the tier name; the DB uses "Market Structure". Use "Market Structure" in
front-matter tier field.

Same HARD CONSTRAINTS, front-matter shape, and checkpoint format as Tier 1.

WHEN DONE:
- List the 14 files
- Print word counts for L2-MOD1, L2-MOD7, L2-MOD14
- Do NOT touch any other directory
