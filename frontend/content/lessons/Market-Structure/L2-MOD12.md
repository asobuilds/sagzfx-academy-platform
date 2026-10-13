---
module_id: L2-MOD12
tier: Market Structure
title: Trade Management
estimated_minutes: 45
lesson_status: draft
learning_outcomes:
  - How to predefine rules for partial exits, trailing stops, moving to breakeven and invalidation.
  - Why these actions are not automatically safer, and why each one changes your results in ways you must test.
  - Why you write the plan before entry, when you are still able to think clearly.
reviewed_by: null
lesson_updated_at: 2026-10-13
---

# Trade Management

## 1. What You'll Learn

- How to predefine rules for partial exits, trailing stops, moving to breakeven and invalidation.
- Why these actions are not automatically safer, and why each one changes your results in ways you must test.
- Why you write the plan before entry, when you are still able to think clearly.

## 2. Plain-English Explanation

Trade management is everything you do after the entry: taking partial profits, trailing your stop,
moving your stop to breakeven, and deciding when the original idea is no longer valid. Entering a trade is
a single decision. Managing it is a series of decisions made while money is at stake, which is why the
rules need to exist before the trade opens rather than being invented once it is running.

Start with partial exits. This means closing part of your position at a first target and letting the
remainder run. The appeal is obvious: you lock in something and reduce the emotional weight of the
position. The trade-off is equally real: it caps the size of your winners while your full-sized losses stay
exactly as they were. Whether that helps or hurts depends on your model, and it is measurable rather than a
matter of taste.

Trailing stops move your stop in the direction of the trade as price advances, to protect gains. The
benefit is that a trade which has moved in your favour can no longer become a full loss. The cost is that
a trailing stop will sometimes be hit during a normal pullback, closing a position that would have
continued. Tighter protects more but exits more often; looser gives more room but surrenders more when the
trade turns. No setting avoids both problems.

Moving to breakeven means shifting your stop to your entry price once the trade has moved a certain
distance. It feels like removing risk, and this is where the honest framing matters most: it does not make
a trade risk-free. It converts the risk from a loss of money into a loss of opportunity, and it increases
how often normal pullbacks take you out of positions that would have worked. Many traders do it
reflexively and never measure what it costs them.

Notice the word test in every paragraph above. None of these techniques is automatically an improvement;
each changes the distribution of your outcomes, and the only way to know whether it helps is to apply it
consistently to historical or demo examples and compare the results with and without. Improvising under
pressure is the opposite of that: when a position is open and moving, your judgement is at its least
reliable.

## 3. Real Chart Walkthrough

These are hypothetical numbers, used only to show how a written plan is applied. Suppose you entered
GBP/USD long at 1.2600 during a London session under your written entry model. Your stop is at 1.2580 —
twenty pips of risk. Your target is 1.2640, a 1:2 ratio.

Your management plan, written before entry, has three lines. First, close half the position at 1.2620, one
unit of reward. Second, once price reaches 1.2620, trail the stop on the remainder twenty pips behind the
most recent fifteen-minute swing low. Third, if price closes back below 1.2600 without having reached
1.2620, exit at market rather than waiting for the stop, because a close back below your entry level
weakens the setup.

Now walk through the possibilities without asserting which occurred. Price might have risen to 1.2620,
triggering the partial exit, then pulled back and hit the trailed stop — leaving a small profit on the
first half and a smaller result on the second. Alternatively, price might have moved straight to 1.2640
without a meaningful pullback, so the trail never came into play. Or it might have dropped to 1.2580
immediately and taken the full stop before any management rule was reached. All three are ordinary.

This is why the plan is tested rather than trusted. The partial exit at 1.2620 reduced the maximum the
trade could earn while leaving the twenty-pip risk on the full position until that point. Whether that
improved the model's results over a hundred trades is a question you can answer with data and cannot answer
by reasoning about a single example.

## 4. Common Mistakes

- Moving the stop further away to avoid taking a loss that the plan said to accept.
- Moving to breakeven on every trade automatically, without measuring what it costs in exited winners.
- Closing a position early out of discomfort, then calling it trade management.
- Adding to a losing position because the original idea "still looks valid".
- Writing the management plan after entry, so it reflects the position's current mood rather than a rule.

## 5. The SAGZFX Rule

Write your exit rules before you enter, because the version of you holding an open position is not the one
who should be making decisions.

## 6. Practice Assignment

Open the SAGZFX Practice Account. It uses virtual money only, no real order is ever placed, and nothing
you do here can earn or lose you real funds.

Write a management plan for one setup with exactly three rules: a partial exit rule, a stop-movement rule,
and a rule for exiting when the idea weakens before either level is reached. State each rule with a
specific price or condition.

Then find ten historical examples of the same setup on the same pair and timeframe. For each, record what
happened under your three rules and, separately, what would have happened if you had simply held to the
original stop and target with no management. Report both sets of outcomes side by side, and include the
examples where neither the stop nor the target was reached within your review window.

*Why this matters:* comparing managed and unmanaged outcomes on the same ten examples replaces a
preference with a measurement, and it shows you directly that management choices change results rather
than simply protecting them.

## 7. Checkpoint Question

**Question:** You move your stop to breakeven as soon as a trade moves ten pips in your favour, on every
trade. What is the most accurate description of this rule?

- A. It makes the trade risk-free, so it should always be applied.
- B. It removes the possibility of a loss on the trade.
- C. It changes the distribution of outcomes — converting some full losses into small ones and some winners
  into scratches — and should be tested before being adopted.
- D. It guarantees a better risk-to-reward ratio than holding the original stop.

**Correct answer:** C

**Why:** Moving to breakeven does not eliminate risk; it trades one outcome pattern for another, and whether
that helps depends on your model, which is why it must be measured rather than assumed.
