import pathlib
import unittest

ROOT = pathlib.Path(__file__).resolve().parents[1]

class PracticeLedgerHistoryContractTests(unittest.TestCase):
    def test_ledger_is_read_only_and_scoped_to_authenticated_account(self):
        source = (ROOT / "app" / "api" / "v1" / "practice_trading.py").read_text()
        self.assertIn('@router.get("/ledger"', source)
        self.assertIn("PracticeLedgerEntry.account_id == account.account_id", source)
        self.assertIn("get_current_user", source)
        self.assertNotIn('@router.post("/ledger"', source)
        self.assertNotIn('@router.delete("/ledger"', source)

    def test_frontend_has_reset_and_ledger_helpers(self):
        source = (ROOT / "frontend" / "src" / "lib" / "api.ts").read_text()
        self.assertIn("resetPracticeAccount", source)
        self.assertIn("practiceLedger", source)
        self.assertIn("/api/v1/practice-trading/account/reset", source)
        self.assertIn("/api/v1/practice-trading/ledger", source)

if __name__ == "__main__":
    unittest.main()
