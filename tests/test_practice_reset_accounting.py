import pathlib
import unittest

ROOT = pathlib.Path(__file__).resolve().parents[1]

class PracticeResetAccountingContractTests(unittest.TestCase):
    def setUp(self):
        self.source = (ROOT / "app" / "api" / "v1" / "practice_trading.py").read_text()

    def test_reset_locks_account_row(self):
        self.assertIn(".with_for_update()", self.source)

    def test_reset_ledger_records_actual_balance_delta(self):
        self.assertIn("reset_amount = account.starting_balance - account.balance", self.source)
        self.assertIn("amount=reset_amount", self.source)
        self.assertNotIn('entry_type="reset",\n            amount=0', self.source)

    def test_reset_still_preserves_history(self):
        self.assertNotIn("delete(PracticeLedgerEntry", self.source)
        self.assertNotIn("DELETE FROM practice_ledger_entries", self.source)

if __name__ == "__main__":
    unittest.main()
