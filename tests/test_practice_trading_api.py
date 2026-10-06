import inspect
import unittest

from app.api.v1 import practice_trading


class PracticeTradingApiContractTests(unittest.TestCase):
    def test_account_endpoints_require_authenticated_user(self):
        for endpoint in (
            practice_trading.get_account,
            practice_trading.create_account,
            practice_trading.list_orders,
        ):
            source = inspect.getsource(endpoint)
            self.assertIn("get_current_user", source)

    def test_virtual_trade_execution_uses_reference_adapter(self):
        source = inspect.getsource(practice_trading)
        self.assertIn('@router.post("/orders"', source)
        self.assertIn("fetch_reference_quote", source)
        self.assertIn("EXECUTABLE_USD_QUOTE_PAIRS", source)
        self.assertNotIn('@router.post("/execute"', source)


if __name__ == "__main__":
    unittest.main()
