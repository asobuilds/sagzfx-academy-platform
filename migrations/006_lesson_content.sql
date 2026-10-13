-- Migration: 006_lesson_content
-- Author: Migration Agent
-- Date: 2026-10-12
-- Purpose: Add lesson content columns to course_modules
-- Idempotency: safe to re-run

ALTER TABLE course_modules
  ADD COLUMN IF NOT EXISTS lesson_body TEXT,
  ADD COLUMN IF NOT EXISTS learning_outcomes TEXT[],
  ADD COLUMN IF NOT EXISTS assignment TEXT,
  ADD COLUMN IF NOT EXISTS checkpoint_questions JSONB,
  ADD COLUMN IF NOT EXISTS formula_snippets JSONB,
  ADD COLUMN IF NOT EXISTS estimated_minutes INT NOT NULL DEFAULT 45,
  ADD COLUMN IF NOT EXISTS lesson_status VARCHAR(20) NOT NULL DEFAULT 'draft',
  ADD COLUMN IF NOT EXISTS lesson_updated_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS reviewed_by UUID REFERENCES users(user_id) ON DELETE SET NULL;

ALTER TABLE course_modules
  DROP CONSTRAINT IF EXISTS course_modules_lesson_status_check;

ALTER TABLE course_modules
  ADD CONSTRAINT course_modules_lesson_status_check
  CHECK (lesson_status IN ('draft', 'in_review', 'published'));

CREATE INDEX IF NOT EXISTS idx_course_modules_lesson_status
  ON course_modules (lesson_status);
