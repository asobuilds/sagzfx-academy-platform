-- Append-only audit ledger for SAGZFX virtual practice balances.
-- This migration does not enable trade execution.

CREATE TABLE IF NOT EXISTS practice_ledger_entries (
  entry_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID NOT NULL REFERENCES practice_accounts(account_id) ON DELETE CASCADE,
  entry_type VARCHAR(30) NOT NULL,
  amount NUMERIC(18, 2) NOT NULL,
  balance_after NUMERIC(18, 2) NOT NULL,
  reference_type VARCHAR(30),
  reference_id UUID,
  note VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT practice_ledger_entry_type_check
    CHECK (entry_type IN ('account_opened', 'realized_pnl', 'reset', 'adjustment')),
  CONSTRAINT practice_ledger_balance_nonnegative CHECK (balance_after >= 0)
);

CREATE INDEX IF NOT EXISTS idx_practice_ledger_account_created
  ON practice_ledger_entries(account_id, created_at);
