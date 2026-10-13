---
module_id: L4-MOD6
tier: Masterclass
title: SL placement
estimated_minutes: 45
lesson_status: draft
learning_outcomes:
  - Why the stop belongs at the price that invalidates the idea, not at a round number chosen for comfort.
  - Why position size is an output of stop distance rather than an input chosen first.
  - How to compare two defensible stop placements using the position size each one requires.
reviewed_by: null
lesson_updated_at: 2026-10-13
---

# SL placement

## 1. What You'll Learn

- Why the stop belongs at the price that invalidates the idea, not at a round number chosen for comfort.
- Why position size is an output of stop distance rather than an input chosen first.
- How to compare two defensible stop placements using the position size each one requires.

## 2. Plain-English Explanation

A stop loss is the price at which your reason for being in the trade no longer exists. That definition
is the whole lesson. If your reason was that a four-hour higher low would hold, then the stop belongs
below that higher low, because a break of it means the reason is gone. A stop placed anywhere else is
not protecting an idea; it is protecting a number you find emotionally tolerable.

There are two defensible ways to arrive at the level. The first is **setup invalidation**: you point at
the structural feature that must hold and place the stop beyond it, with a margin for the spread. The
second is **a tested rule**: for example, a fixed multiple of average range applied consistently, which
you have checked against historical data rather than chosen because it felt right. Both are legitimate.
What is not legitimate is placing the stop at a round number because it looks tidy.

The order of operations is the part most traders get backwards. Find the invalidation level. Measure the
distance from entry to that level. Then choose the position size that makes that distance cost exactly
the cash amount you decided to risk. Traders who instead decide "I will trade half a lot" and then hunt
for a stop that fits have inverted the process, and the chart has stopped having any say in where their
risk sits.

The consequence of doing it correctly is a trade-off you cannot avoid: a wider stop requires a smaller
position for the same cash risk, and a tighter stop permits a larger one. Neither is more correct than
the other — they are the same risk budget expressed two ways. What differs is the probability of being
removed by ordinary noise, and that is a question for your testing, not for your preferences.

Two practical points. Costs count: spread, commission and swap all widen the effective distance you are
paying for, so measure the distance as it actually is rather than as the raw chart shows it. And verify
contract specifications with your own broker, because pip value changes with the pair and with your
account currency. Finally, a stop is an instruction, not a guarantee — in gaps and fast markets an order
can fill at a worse price than the one you set, and losing more than planned is possible.

## 3. Real Chart Walkthrough

These are hypothetical numbers, used only to compare two placements. Suppose you are considering a long
on EUR/USD with an entry at 1.0910, on an account balance of $2,000 with a planned risk of 0.5%, which
is $10 before costs.

**Placement A — setup invalidation.** Your four-hour structure has a higher low at 1.0885. Placing the
stop at 1.0880 puts it 30 pips below the entry, beneath the feature that has to hold. The position size
is the one that makes 30 pips equal $10, once you have checked the pip value for your account currency
and contract size.

**Placement B — a tested rule.** Your rule is a stop of two times average range, which currently works
out at 18 pips, giving a stop at 1.0892. This requires a larger position to express the same $10 of
risk.

The written comparison is the useful output: "Placement A sits beyond the structural feature and gives
the idea room to be wrong before it is removed, but requires a smaller position. Placement B is closer
to current noise and requires a larger position for the same cash risk." Notice that neither is
described as correct. Which one suits you depends on what your testing showed, and both can lose. If
price trades straight through 1.0880, Placement A's larger invalidation distance did not make it safer —
it simply cost the same $10 with a smaller position.

## 4. Common Mistakes

- Choosing the lot size first and then placing the stop wherever that size happens to allow.
- Placing the stop at a round number because it looks tidy rather than because it invalidates anything.
- Widening the stop mid-trade to avoid being taken out, which turns a budgeted loss into an unbounded one.
- Measuring stop distance from the chart price while ignoring spread, commission and swap.
- Assuming the stop will fill at exactly the price that was set, including through gaps and fast markets.

## 5. The SAGZFX Rule

Place the stop where the idea dies, then size the trade so that death costs only what you already agreed
to lose.

## 6. Practice Assignment

Open the SAGZFX Practice Account. This account uses virtual money only, no real order is ever placed,
and nothing you do here can earn or lose you real funds.

Take one hypothetical setup — a pair, an entry price, and a structural level that must hold. Write two
defensible stop placements for it: one at setup invalidation, and one from a tested rule such as a fixed
multiple of average range.

For each placement, calculate the position size that expresses the same planned cash risk, and write one
sentence comparing them: how far each stop sits from entry, how much room each gives the idea, and which
requires the larger position. Finish by stating which one you would use and why, in terms of your own
testing rather than your preference.

*Why this matters:* the inversion — size first, stop second — is the most common way a planned risk
becomes an unplanned one, and writing both placements side by side makes the trade-off visible before
any money is involved.

## 7. Checkpoint Question

**Question:** You have decided to trade 0.5 lots on a setup, and your structural invalidation level sits
45 pips from entry, which would risk more than your planned amount at that size. What is the correct
response?

- A. Trade 0.5 lots and place the stop closer, at a round number that fits the risk.
- B. Keep the stop at the invalidation level and reduce the position size until 45 pips equals the planned cash risk.
- C. Trade 0.5 lots and accept the larger risk, since the setup looks strong.
- D. Skip the stop and monitor the trade manually.

**Correct answer:** B

**Why:** Position size is derived from the invalidation distance and the risk budget; moving the stop to
suit a pre-chosen size inverts the process and places risk where the chart never justified it.
