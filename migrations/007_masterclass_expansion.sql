-- Migration: 007_masterclass_expansion
-- Author: Migration Agent
-- Date: 2026-10-12
-- Purpose: Add 10 Masterclass module rows and retitle one existing row
-- Idempotency: safe to re-run

-- Part 1 — Insert the ten Masterclass modules the guide specifies but the DB
-- lacks. Titles are copied verbatim from the guide's "Final Masterclass"
-- section (pp. 10-11), which renders them in sentence case. L4-MOD1
-- ("Putting Everything Together") already exists and is not repeated here.
INSERT INTO course_modules (module_id, tier_level, title, video_url_slug, is_premium_locked, sort_order) VALUES
('L4-MOD2',  'Masterclass', 'Top-down analysis',                    NULL, TRUE, 48),
('L4-MOD3',  'Masterclass', 'Market bias',                          NULL, TRUE, 49),
('L4-MOD4',  'Masterclass', 'Liquidity identification',             NULL, TRUE, 50),
('L4-MOD5',  'Masterclass', 'Entry confirmation',                   NULL, TRUE, 51),
('L4-MOD6',  'Masterclass', 'SL placement',                         NULL, TRUE, 52),
('L4-MOD7',  'Masterclass', 'TP targeting',                         NULL, TRUE, 53),
('L4-MOD8',  'Masterclass', 'Risk calculation',                     NULL, TRUE, 54),
('L4-MOD9',  'Masterclass', 'Trade management',                     NULL, TRUE, 55),
('L4-MOD10', 'Masterclass', 'Journaling',                           NULL, TRUE, 56),
('L4-MOD11', 'Masterclass', 'Reviewing and improving the strategy', NULL, TRUE, 57)
ON CONFLICT (module_id) DO NOTHING;

-- Part 2 — Retitle L3-MOD14.
-- The original title ("Building a Profitable Trading System") makes an outcome
-- promise the guide itself forbids on page 1: "Do not teach any setup as a
-- guaranteed signal." The WHERE clause pins the old title, so once this has
-- been applied, re-running matches no row and changes nothing.
-- NOTE: recon/curriculum-audit.md Section 2 proposes a different replacement
-- wording, "Designing a Complete Trading System". This migration uses the
-- mission's string, "Building a Repeatable Trading System". Reconcile the two
-- before treating either as canonical.
UPDATE course_modules
   SET title = 'Building a Repeatable Trading System'
 WHERE module_id = 'L3-MOD14'
   AND title = 'Building a Profitable Trading System';

-- Verify: SELECT module_id, title FROM course_modules WHERE tier_level = 'Masterclass' ORDER BY sort_order;
