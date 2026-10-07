import unittest
from pydantic import ValidationError
from app.schemas.feedback import FeedbackCreate, ReviewCreate, ReviewModerate

class FeedbackSchemaTests(unittest.TestCase):
    def test_review_requires_valid_rating_and_meaningful_body(self):
        self.assertEqual(ReviewCreate(rating=5,body="Excellent learning experience").rating,5)
        with self.assertRaises(ValidationError): ReviewCreate(rating=6,body="Excellent learning experience")
        with self.assertRaises(ValidationError): ReviewCreate(rating=5,body="short")
    def test_feedback_has_bounds(self):
        self.assertEqual(FeedbackCreate(message="Useful").message,"Useful")
        with self.assertRaises(ValidationError): FeedbackCreate(message="bad")
    def test_moderation_only_allows_terminal_publication_states(self):
        self.assertEqual(ReviewModerate(status="approved").status,"approved")
        with self.assertRaises(ValidationError): ReviewModerate(status="pending")

if __name__=="__main__": unittest.main()
