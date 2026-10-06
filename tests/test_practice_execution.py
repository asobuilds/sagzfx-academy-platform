import pathlib
import unittest

ROOT = pathlib.Path(__file__).resolve().parents[1]

class PracticeExecutionContractTests(unittest.TestCase):
    def setUp(self):
        self.api = (ROOT / "app" / "api" / "v1" / "practice_trading.py").read_text()
        self.migration = (ROOT / "migrations" / "004_practice_trade_accounting.sql").read_text()
        self.ui = (ROOT / "frontend" / "src" / "app" / "practice" / "page.tsx").read_text()

    def test_execution_is_virtual_and_limited_to_usd_quote_pairs(self):
        self.assertIn('EXECUTABLE_USD_QUOTE_PAIRS = {"EURUSD", "GBPUSD", "AUDUSD"}', self.api)
        self.assertIn('@router.post("/orders"', self.api)
        self.assertIn('@router.post("/orders/{order_id}/close"', self.api)
        self.assertNotIn("exness", self.api.lower())

    def test_close_is_transactional_accounting_with_ledger(self):
        self.assertIn(".with_for_update()", self.api)
        self.assertIn('entry_type="realized_pnl"', self.api)
        self.assertIn("account.balance = new_balance", self.api)
        self.assertIn("reference_id=order.order_id", self.api)

    def test_trade_audit_fields_are_migrated(self):
        for field in ("close_price", "realized_pnl", "quote_date"):
            self.assertIn(field, self.migration)

    def test_workspace_discloses_reference_rate_limitations(self):
        self.assertIn("Virtual money only", self.ui)
        self.assertIn("not broker bid/ask prices", self.ui)
        self.assertIn("rate date", self.ui)

if __name__ == "__main__":
    unittest.main()
