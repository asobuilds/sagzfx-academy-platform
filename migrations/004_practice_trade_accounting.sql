-- Complete virtual practice-trade accounting fields.
-- Prices remain educational reference rates; this does not connect to a broker.
ALTER TABLE practice_orders
  ADD COLUMN IF NOT EXISTS close_price NUMERIC(18, 8),
  ADD COLUMN IF NOT EXISTS realized_pnl NUMERIC(18, 2),
  ADD COLUMN IF NOT EXISTS quote_date TIMESTAMP WITH TIME ZONE;

CREATE INDEX IF NOT EXISTS idx_practice_orders_account_created
  ON practice_orders(account_id, created_at DESC);
