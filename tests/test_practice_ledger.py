import pathlib
import unittest


ROOT = pathlib.Path(__file__).resolve().parents[1]


class PracticeLedgerContractTests(unittest.TestCase):
    def test_migration_defines_append_only_ledger_shape(self):
        sql = (ROOT / "migrations" / "003_practice_ledger.sql").read_text()
        self.assertIn("CREATE TABLE IF NOT EXISTS practice_ledger_entries", sql)
        self.assertIn("account_opened", sql)
        self.assertIn("realized_pnl", sql)
        self.assertIn("reset", sql)
        self.assertIn("adjustment", sql)
        self.assertNotIn("UPDATE practice_ledger_entries", sql)
        self.assertNotIn("DELETE FROM practice_ledger_entries", sql)

    def test_model_exposes_ledger_and_virtual_execution(self):
        model = (ROOT / "app" / "models" / "practice_trading.py").read_text()
        api = (ROOT / "app" / "api" / "v1" / "practice_trading.py").read_text()
        self.assertIn("class PracticeLedgerEntry", model)
        self.assertIn('@router.post("/orders"', api)
        self.assertIn('entry_type="realized_pnl"', api)
        self.assertNotIn('@router.post("/trade"', api)
        self.assertNotIn('@router.post("/execute"', api)


if __name__ == "__main__":
    unittest.main()
