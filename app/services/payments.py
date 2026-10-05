"""
SAGZFX ACADEMY - Paystack payment integration.

Two responsibilities:
  1. init_paystack_checkout() - create a payment session with Paystack.
  2. verify_paystack_signature() - validate webhook signatures.

The webhook handler uses the secret key to verify the HMAC-SHA512 signature
sent by Paystack in the 'x-paystack-signature' header.
"""
import hashlib
import hmac
import uuid
from dataclasses import dataclass

import httpx

from app.core.config import settings

PAYSTACK_INIT_URL = "https://api.paystack.co/transaction/initialize"


@dataclass
class PaymentInit:
    provider: str
    checkout_url: str
    reference: str
    access_code: str


async def init_paystack_checkout(
    *,
    email: str,
    amount_kobo: int,
    reference: str | None = None,
    callback_url: str,
    metadata: dict | None = None,
) -> PaymentInit:
    """
    Create a Paystack checkout session.

    amount_kobo: amount in kobo (smallest NGN unit). 1 NGN = 100 kobo.
    Returns a PaymentInit with the checkout_url the frontend redirects to.
    """
    if not settings.PAYSTACK_SECRET_KEY:
        raise RuntimeError("PAYSTACK_SECRET_KEY is not configured.")

    ref = reference or f"sagzfx_{uuid.uuid4().hex[:16]}"

    payload = {
        "email": email,
        "amount": amount_kobo,
        "reference": ref,
        "callback_url": callback_url,
        "currency": settings.DEFAULT_CURRENCY,
    }
    if metadata:
        payload["metadata"] = metadata

    async with httpx.AsyncClient(timeout=20) as client:
        r = await client.post(
            PAYSTACK_INIT_URL,
            headers={
                "Authorization": f"Bearer {settings.PAYSTACK_SECRET_KEY}",
                "Content-Type": "application/json",
            },
            json=payload,
        )
        r.raise_for_status()
        body = r.json()

    if not body.get("status"):
        raise RuntimeError(f"Paystack error: {body.get('message', 'unknown')}")

    data = body["data"]
    return PaymentInit(
        provider="paystack",
        checkout_url=data["authorization_url"],
        reference=data["reference"],
        access_code=data["access_code"],
    )


def verify_paystack_signature(raw_body: bytes, signature_header: str | None) -> bool:
    """
    Verify that a webhook payload really came from Paystack.

    Paystack sends 'x-paystack-signature' = HMAC-SHA512(raw_body, secret_key).
    Constant-time compare to avoid timing attacks.
    """
    if not signature_header:
        return False
    if not settings.PAYSTACK_SECRET_KEY:
        return False

    expected = hmac.new(
        key=settings.PAYSTACK_SECRET_KEY.encode("utf-8"),
        msg=raw_body,
        digestmod=hashlib.sha512,
    ).hexdigest()

    return hmac.compare_digest(expected, signature_header)
