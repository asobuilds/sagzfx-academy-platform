from datetime import datetime, timedelta, timezone
import unittest

from app.core.access_policy import module_is_accessible, plan_allows_tier
from app.api.v1.payments import PRODUCTS, _one_month_after


class LearningPlanPolicyTests(unittest.TestCase):
    def setUp(self):
        self.now = datetime(2026, 10, 6, tzinfo=timezone.utc)
        self.future = self.now + timedelta(days=30)
        self.past = self.now - timedelta(seconds=1)

    def test_registered_has_no_paid_curriculum(self):
        self.assertFalse(plan_allows_tier("registered", "Beginner"))

    def test_beginner_only_gets_beginner(self):
        self.assertTrue(plan_allows_tier("beginner", "Beginner"))
        self.assertFalse(plan_allows_tier("beginner", "Market Structure"))

    def test_advanced_gets_beginner_market_structure_and_advanced(self):
        for tier in ("Beginner", "Market Structure", "Advanced"):
            self.assertTrue(plan_allows_tier("advanced", tier))
        self.assertFalse(plan_allows_tier("advanced", "Masterclass"))

    def test_masters_gets_every_curriculum_tier(self):
        for tier in ("Beginner", "Market Structure", "Advanced", "Masterclass"):
            self.assertTrue(plan_allows_tier("masters", tier))

    def test_active_class_can_open_eligible_unopened_module(self):
        self.assertTrue(module_is_accessible(
            plan="beginner", tier_level="Beginner", now=self.now,
            class_expires_at=self.future, first_opened_at=None,
        ))

    def test_expired_class_locks_unopened_module(self):
        self.assertFalse(module_is_accessible(
            plan="advanced", tier_level="Advanced", now=self.now,
            class_expires_at=self.past, first_opened_at=None,
        ))

    def test_expired_class_keeps_module_opened_before_expiry(self):
        opened = self.past - timedelta(days=2)
        self.assertTrue(module_is_accessible(
            plan="advanced", tier_level="Advanced", now=self.now,
            class_expires_at=self.past, first_opened_at=opened,
        ))

    def test_open_after_expiry_does_not_grant_access(self):
        opened = self.now + timedelta(seconds=1)
        self.assertFalse(module_is_accessible(
            plan="masters", tier_level="Masterclass", now=self.now,
            class_expires_at=self.past, first_opened_at=opened,
        ))


class PaymentPlanTests(unittest.TestCase):
    def test_client_prices_are_exact(self):
        self.assertEqual(PRODUCTS["beginner"]["amount_kobo"], 15_000_000)
        self.assertEqual(PRODUCTS["advanced"]["amount_kobo"], 25_000_000)
        self.assertEqual(PRODUCTS["masters"]["amount_kobo"], 50_000_000)

    def test_one_month_handles_end_of_month(self):
        jan_31 = datetime(2027, 1, 31, tzinfo=timezone.utc)
        self.assertEqual(_one_month_after(jan_31), datetime(2027, 2, 28, tzinfo=timezone.utc))


if __name__ == "__main__":
    unittest.main()
