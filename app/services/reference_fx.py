"""Free educational FX reference-rate adapter.

Frankfurter publishes reference/mid-market currency rates. These quotes are
for SAGZFX educational simulation and must not be represented as broker,
bid/ask, tick, or real-time execution prices.
"""
from dataclasses import dataclass
from datetime import date
from decimal import Decimal
import json
from urllib.error import HTTPError, URLError
from urllib.request import urlopen

FRANKFURTER_BASE_URL = "https://api.frankfurter.dev/v2"
SUPPORTED_PRACTICE_PAIRS = {
    "EURUSD": ("EUR", "USD"),
    "GBPUSD": ("GBP", "USD"),
    "USDJPY": ("USD", "JPY"),
    "USDCHF": ("USD", "CHF"),
    "AUDUSD": ("AUD", "USD"),
    "USDCAD": ("USD", "CAD"),
}


@dataclass(frozen=True)
class ReferenceQuote:
    symbol: str
    rate: Decimal
    rate_date: date
    provider: str = "Frankfurter"
    price_type: str = "reference_mid"
    realtime: bool = False


def pair_currencies(symbol: str) -> tuple[str, str]:
    normalized = symbol.upper().replace("/", "")
    pair = SUPPORTED_PRACTICE_PAIRS.get(normalized)
    if pair is None:
        raise ValueError("unsupported practice symbol")
    return pair


def fetch_reference_quote(symbol: str, timeout: float = 5.0) -> ReferenceQuote:
    base, quote = pair_currencies(symbol)
    url = f"{FRANKFURTER_BASE_URL}/rate/{base.lower()}/{quote.lower()}"
    try:
        with urlopen(url, timeout=timeout) as response:
            payload = json.load(response)
    except (HTTPError, URLError, TimeoutError, json.JSONDecodeError) as exc:
        raise RuntimeError("reference FX rate is temporarily unavailable") from exc

    try:
        rate = Decimal(str(payload["rate"]))
        rate_date = date.fromisoformat(payload["date"])
    except (KeyError, ValueError, TypeError) as exc:
        raise RuntimeError("reference FX provider returned an invalid response") from exc

    if rate <= 0:
        raise RuntimeError("reference FX provider returned a non-positive rate")

    return ReferenceQuote(
        symbol=f"{base}{quote}",
        rate=rate,
        rate_date=rate_date,
    )
