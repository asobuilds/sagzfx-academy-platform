from decimal import Decimal
import unittest

from app.services.practice_trading import unrealized_pnl, validate_protective_prices


class PracticeTradingCalculationTests(unittest.TestCase):
    def test_buy_profit_and_loss(self):
        self.assertEqual(unrealized_pnl("buy", Decimal("100"), Decimal("1.10"), Decimal("1.12")), Decimal("2.00"))
        self.assertEqual(unrealized_pnl("buy", Decimal("100"), Decimal("1.10"), Decimal("1.08")), Decimal("-2.00"))

    def test_sell_profit_and_loss(self):
        self.assertEqual(unrealized_pnl("sell", Decimal("100"), Decimal("1.10"), Decimal("1.08")), Decimal("2.00"))

    def test_invalid_quantity_is_rejected(self):
        with self.assertRaises(ValueError):
            unrealized_pnl("buy", Decimal("0"), Decimal("1"), Decimal("2"))

    def test_buy_protection_must_straddle_entry(self):
        validate_protective_prices("buy", Decimal("1.10"), Decimal("1.09"), Decimal("1.12"))
        with self.assertRaises(ValueError):
            validate_protective_prices("buy", Decimal("1.10"), Decimal("1.11"), None)

    def test_sell_protection_must_straddle_entry(self):
        validate_protective_prices("sell", Decimal("1.10"), Decimal("1.11"), Decimal("1.08"))
        with self.assertRaises(ValueError):
            validate_protective_prices("sell", Decimal("1.10"), None, Decimal("1.12"))


if __name__ == "__main__":
    unittest.main()
