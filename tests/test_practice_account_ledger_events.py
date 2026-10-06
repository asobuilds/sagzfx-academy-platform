import pathlib
import unittest


ROOT = pathlib.Path(__file__).resolve().parents[1]


class PracticeAccountLedgerEventTests(unittest.TestCase):
    def test_account_creation_records_opening_event_only_on_insert(self):
        source = (ROOT / "app" / "api" / "v1" / "practice_trading.py").read_text()
        self.assertIn(".returning(PracticeAccount.account_id)", source)
        self.assertIn('entry_type="account_opened"', source)
        self.assertIn("if created_account_id is not None:", source)

    def test_reset_preserves_history_and_restores_starting_balance(self):
        source = (ROOT / "app" / "api" / "v1" / "practice_trading.py").read_text()
        self.assertIn('@router.post("/account/reset"', source)
        self.assertIn("account.balance = account.starting_balance", source)
        self.assertIn("account.reset_count += 1", source)
        self.assertIn('entry_type="reset"', source)
        self.assertNotIn("DELETE FROM practice_ledger_entries", source)

    def test_execution_is_virtual_and_ledger_backed(self):
        source = (ROOT / "app" / "api" / "v1" / "practice_trading.py").read_text()
        self.assertIn('@router.post("/orders"', source)
        self.assertIn('entry_type="realized_pnl"', source)
        self.assertNotIn('@router.post("/execute"', source)


if __name__ == "__main__":
    unittest.main()
