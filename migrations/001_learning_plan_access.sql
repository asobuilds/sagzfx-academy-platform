-- SAGZFX learning-plan entitlement migration
-- Safe to run once against the existing PostgreSQL/Neon database.
-- Existing users remain registered until a plan is explicitly activated.

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS learning_plan VARCHAR(30) NOT NULL DEFAULT 'registered',
  ADD COLUMN IF NOT EXISTS class_started_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS class_expires_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS mentorship_lifetime BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE student_progress
  ADD COLUMN IF NOT EXISTS first_opened_at TIMESTAMP WITH TIME ZONE;

ALTER TABLE users
  DROP CONSTRAINT IF EXISTS users_learning_plan_check;

ALTER TABLE users
  ADD CONSTRAINT users_learning_plan_check
  CHECK (learning_plan IN ('registered', 'beginner', 'advanced', 'masters'));

CREATE INDEX IF NOT EXISTS idx_student_progress_user_opened
  ON student_progress (user_id, first_opened_at);
