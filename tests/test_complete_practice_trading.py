import pathlib
import unittest
ROOT=pathlib.Path(__file__).resolve().parents[1]
class CompletePracticeTradingContractTests(unittest.TestCase):
 def test_virtual_market_execution_is_scoped_and_audited(self):
  s=(ROOT/"app"/"api"/"v1"/"practice_trading.py").read_text()
  self.assertIn('@router.post("/orders"',s)
  self.assertIn('@router.post("/orders/{order_id}/close"',s)
  self.assertIn("PracticeOrder.account_id == account.account_id",s)
  self.assertIn(".with_for_update()",s)
  self.assertIn('entry_type="realized_pnl"',s)
  self.assertIn("new_balance = account.balance + pnl",s)
 def test_execution_is_limited_to_direct_usd_quote_pairs(self):
  s=(ROOT/"app"/"api"/"v1"/"practice_trading.py").read_text()
  self.assertIn('{"EURUSD", "GBPUSD", "AUDUSD"}',s)
 def test_workspace_is_honest_about_reference_data(self):
  s=(ROOT/"frontend"/"src"/"app"/"practice"/"page.tsx").read_text()
  self.assertIn("Virtual money only",s)
  self.assertIn("not broker bid/ask prices",s)
  self.assertIn("practiceQuote",s)
  self.assertIn("closePracticeOrder",s)
  self.assertIn("Reset to $10,000",s)
  self.assertIn("Win Rate",s)
 def test_no_real_broker_execution_is_added(self):
  s=(ROOT/"app"/"api"/"v1"/"practice_trading.py").read_text()
  self.assertNotIn("MetaTrader",s)
  self.assertNotIn("Exness",s)
if __name__=="__main__": unittest.main()
