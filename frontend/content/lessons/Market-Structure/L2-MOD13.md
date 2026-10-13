---
module_id: L2-MOD13
tier: Market Structure
title: Trading Journal & Backtesting
estimated_minutes: 45
lesson_status: draft
learning_outcomes:
  - What a trading journal records, and why rule adherence matters as much as the result.
  - How to backtest by applying fixed rules to historical charts without hindsight changes.
  - Why costs and unseen examples belong in every test, and why a good result on ten trades proves nothing.
reviewed_by: null
lesson_updated_at: 2026-10-13
---

# Trading Journal & Backtesting

## 1. What You'll Learn

- What a trading journal records, and why rule adherence matters as much as the result.
- How to backtest by applying fixed rules to historical charts without hindsight changes.
- Why costs and unseen examples belong in every test, and why a good result on ten trades proves nothing.

## 2. Plain-English Explanation

A trading journal is a record of every trade you take, written in enough detail that you can review it
later and learn something. The minimum set of fields is: the setup name, the entry price, the stop, the
target, the risk in pips and in money, the result, a screenshot of the chart at entry, and a note on
whether you followed your rules. That last field is the one most people skip, and it is the one that
matters most.

Here is why. If you record only results, you learn almost nothing, because a single trade's outcome is
mostly noise. A trade that followed your rules and lost is a good trade. A trade that broke your rules and
won is a bad trade that happened to pay. If your journal does not separate those two cases, your review
will push you towards whatever produced money last week, which is how traders abandon sound methods after
three losses and adopt broken ones after three wins. Judging process as well as outcome is the entire point
of journalling.

Backtesting is the second half of the discipline. It means taking a fixed set of rules and applying them to
historical charts to see how they would have behaved. The critical word is fixed. A backtest in which you
adjust the rules as you go, skip examples that look awkward, or use knowledge of what happened next is not
a test. It is a rehearsal of conclusions you already hold. If you find yourself saying "I would have
skipped that one", ask whether your written rules would have skipped it. If the answer is no, the example
counts.

Two further requirements make a backtest meaningful. The first is cost. Spread, commission and slippage are
real, and a strategy tested without them will look better than it is. On a twenty-pip stop, a two-pip cost
is ten percent of your risk on every trade. The second is sample size and unseen data. Ten examples prove
nothing, and examples you chose yourself tend to be the ones that fit. Test on a period you have not
studied, or on instruments you have not traded, and include every example the rules selected — not just the
memorable ones.

Expectancy is the metric that ties this together: your win rate, your average win, and your average loss
combined into one number describing what the method produces per trade on average. That number, measured
across a decent sample with costs included, is worth more than any single outcome.

## 3. Real Chart Walkthrough

These are hypothetical numbers, used only to demonstrate the process. Suppose your model is the one from
the entry models lesson: a fresh four-hour demand zone on EUR/USD with a departure of at least forty pips,
a fifteen-minute close above the zone's upper boundary as the trigger, and invalidation below the zone's
lower boundary.

You review three months of history and find fourteen occasions where the rules selected a setup. Your
journal records each one with entry, stop, target, risk in pips, result, a screenshot, and a rule-adherence
note. Of the fourteen, eleven followed the rules exactly. Three did not: in two cases you would have
entered without the fifteen-minute trigger because the zone "looked strong", and in one case you would have
skipped a valid setup because it appeared during a news release you were watching.

Now consider what the review can and cannot tell you. It can tell you whether the eleven rule-following
examples behaved differently from the three that broke the rules, and whether the results are consistent
enough to be worth continuing to test. It cannot tell you the method works. Fourteen examples is a small
sample, it covers one pair in one market condition, and the three non-compliant examples show that the
rules need tightening regardless of how the results looked. Had the three rule-breaking examples won, that
would not have justified breaking the rules, and had they lost, it would not have proven the rules right.

## 4. Common Mistakes

- Recording only profit and loss, so a rule-breaking win looks identical to a rule-following win.
- Adjusting rules mid-backtest, which turns the test into a search for the answer you prefer.
- Testing without spread and commission, then being surprised by live results.
- Drawing conclusions from ten examples, especially ones you selected because they looked good.
- Journalling only the losses, which hides how your winners were actually produced.

## 5. The SAGZFX Rule

Record whether you followed your rules on every trade, because a winning trade that broke them teaches you
nothing worth keeping.

## 6. Practice Assignment

Open the SAGZFX Practice Account. It uses virtual money only, no real order is ever placed, and nothing
you do here can earn or lose you real funds.

Build a journal template with these fields: date, pair, timeframe, setup name, entry, stop, target, risk in
pips, risk in money, result, rule adherence, and a screenshot note. Then backtest one simple rule set on
twenty historical examples, recording every field for each example and including the spread in your
calculations.

When you finish, count three things: how many examples followed the rules, how many did not, and how the
two groups performed. Then write two sentences describing what you would change about the rules — not about
the trades.

*Why this matters:* a journal that captures rule adherence is the only tool that lets you tell skill from
luck, and it is the record you will rely on when you decide whether a method deserves more testing.

## 7. Checkpoint Question

**Question:** You backtest a rule set on twenty historical examples and fourteen produce a profit. What is
the most accurate conclusion?

- A. The method is proven and can be traded with real money.
- B. The sample is small, was chosen by you, and likely excludes costs — more testing on unseen examples is
  needed before drawing conclusions.
- C. The method will produce a profit on roughly seventy percent of future trades.
- D. The method should be optimised until all twenty examples are profitable.

**Correct answer:** B

**Why:** A small, self-selected sample without costs cannot establish that a method works, and optimising
until every example wins would fit the rules to the past rather than testing them.
