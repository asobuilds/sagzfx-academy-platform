import unittest
from datetime import date
from decimal import Decimal
from unittest.mock import patch

from app.services.reference_fx import (
    ReferenceQuote,
    fetch_reference_quote,
    pair_currencies,
)


class _Response:
    def __enter__(self):
        return self
    def __exit__(self, *_args):
        return None


class ReferenceFxTests(unittest.TestCase):
    def test_supported_pair_normalization(self):
        self.assertEqual(pair_currencies("eur/usd"), ("EUR", "USD"))
        with self.assertRaises(ValueError):
            pair_currencies("XAUUSD")

    @patch("app.services.reference_fx.json.load")
    @patch("app.services.reference_fx.urlopen")
    def test_quote_is_explicitly_non_realtime_reference_mid(self, open_mock, load_mock):
        open_mock.return_value = _Response()
        load_mock.return_value = {"date": "2026-10-05", "base": "EUR", "quote": "USD", "rate": 1.1286}

        quote = fetch_reference_quote("EURUSD")

        self.assertEqual(
            quote,
            ReferenceQuote(
                symbol="EURUSD",
                rate=Decimal("1.1286"),
                rate_date=date(2026, 10, 5),
            ),
        )
        self.assertFalse(quote.realtime)
        self.assertEqual(quote.price_type, "reference_mid")


if __name__ == "__main__":
    unittest.main()
