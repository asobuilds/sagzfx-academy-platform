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
from xml.etree import ElementTree

FRANKFURTER_BASE_URL = "https://api.frankfurter.dev/v2"
FRANKFURTER_V1_BASE_URL = "https://api.frankfurter.dev/v1"
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
    urls = [
        f"{FRANKFURTER_BASE_URL}/rate/{base.lower()}/{quote.lower()}",
        f"{FRANKFURTER_V1_BASE_URL}/latest?base={base}&symbols={quote}",
    ]
    payload = None
    last_error = None
    for url in urls:
        try:
            with urlopen(url, timeout=timeout) as response:
                payload = json.load(response)
            break
        except (HTTPError, URLError, TimeoutError, json.JSONDecodeError) as exc:
            last_error = exc
    if payload is None:
        # Independent fallback: the ECB publishes free daily euro reference
        # rates. Cross-rates let practice execution continue when Frankfurter
        # itself is unreachable from the production host.
        try:
            with urlopen("https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml", timeout=timeout) as response:
                root = ElementTree.parse(response).getroot()
            day_node = next(node for node in root.iter() if node.attrib.get("time"))
            rates = {"EUR": Decimal("1")}
            rates.update({
                node.attrib["currency"]: Decimal(node.attrib["rate"])
                for node in day_node
                if "currency" in node.attrib and "rate" in node.attrib
            })
            rate = rates[quote] / rates[base]
            rate_date = date.fromisoformat(day_node.attrib["time"])
            if rate <= 0:
                raise ValueError("non-positive ECB rate")
            return ReferenceQuote(
                symbol=f"{base}{quote}",
                rate=rate,
                rate_date=rate_date,
                provider="European Central Bank",
            )
        except (HTTPError, URLError, TimeoutError, ElementTree.ParseError, KeyError, ValueError, StopIteration) as exc:
            raise RuntimeError("reference FX rate is temporarily unavailable") from exc

    try:
        raw_rate = payload.get("rate")
        if raw_rate is None:
            raw_rate = payload["rates"][quote]
        rate = Decimal(str(raw_rate))
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
