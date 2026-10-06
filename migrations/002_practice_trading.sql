-- SAGZFX practice-trading foundation.
-- Virtual-money accounting only. Execution stays disabled until a licensed
-- live market-data adapter is configured.

CREATE TABLE IF NOT EXISTS practice_accounts (
  account_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(user_id) ON DELETE CASCADE,
  starting_balance NUMERIC(18, 2) NOT NULL DEFAULT 10000.00,
  balance NUMERIC(18, 2) NOT NULL DEFAULT 10000.00,
  currency VARCHAR(10) NOT NULL DEFAULT 'USD',
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  reset_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT practice_accounts_balance_nonnegative CHECK (balance >= 0),
  CONSTRAINT practice_accounts_status_check CHECK (status IN ('active', 'suspended'))
);

CREATE TABLE IF NOT EXISTS practice_orders (
  order_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID NOT NULL REFERENCES practice_accounts(account_id) ON DELETE CASCADE,
  symbol VARCHAR(30) NOT NULL,
  side VARCHAR(4) NOT NULL,
  order_type VARCHAR(10) NOT NULL,
  lot_size NUMERIC(10, 2) NOT NULL,
  requested_price NUMERIC(18, 8),
  stop_loss NUMERIC(18, 8),
  take_profit NUMERIC(18, 8),
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  fill_price NUMERIC(18, 8),
  opened_at TIMESTAMP WITH TIME ZONE,
  closed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT practice_orders_side_check CHECK (side IN ('buy', 'sell')),
  CONSTRAINT practice_orders_type_check CHECK (order_type IN ('market', 'limit')),
  CONSTRAINT practice_orders_status_check CHECK (status IN ('pending', 'open', 'closed', 'cancelled', 'rejected')),
  CONSTRAINT practice_orders_lot_size_positive CHECK (lot_size > 0)
);

CREATE INDEX IF NOT EXISTS idx_practice_orders_account_status
  ON practice_orders(account_id, status);
