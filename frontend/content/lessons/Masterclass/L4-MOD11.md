---
module_id: L4-MOD11
tier: Masterclass
title: Reviewing and improving the strategy
estimated_minutes: 45
lesson_status: draft
learning_outcomes:
  - Which statistics a meaningful review produces, and why rule adherence is read before any of them.
  - Why a sample must be large enough to say anything, and why one change per review is the limit.
  - How to validate a change on unseen data instead of on the trades that suggested it.
reviewed_by: null
lesson_updated_at: 2026-10-13
---

# Reviewing and improving the strategy

## 1. What You'll Learn

- Which statistics a meaningful review produces, and why rule adherence is read before any of them.
- Why a sample must be large enough to say anything, and why one change per review is the limit.
- How to validate a change on unseen data instead of on the trades that suggested it.

## 2. Plain-English Explanation

A review is the step that turns a journal into a decision. Without it, the journal is a diary, and the
strategy never changes except by accident.

A useful review produces six figures. **Expectancy** is the average result per trade once costs are
included. **Average win and average loss** show the shape of the outcomes rather than only their sum.
**Drawdown** is the largest fall from a peak, which is the figure that tells you whether the method is
survivable in practice. **Costs** are the total paid in spread, commission and swap. **Session
performance** splits results by the hours you actually traded. And **rule adherence** is the percentage
of trades in which you followed the written plan.

Adherence is read first, and the reason is simple: the other five figures describe a strategy you may
not have been trading. If adherence is low, then the expectancy you calculated belongs to some mixture of
your plan and your impulses, and improving it means improving adherence before touching anything else.

Sample size comes next. Conclusions drawn from ten trades are mostly noise — a single unusual result can
dominate the whole figure. There is no universal threshold, and any honest review says so, but the
principle is that you need enough trades that no one outcome decides the answer.

Then the constraint that makes the process work: change one variable at a time. If you alter entry,
stop, target and position size together and the next sample improves, you have learned nothing about
which change helped, and you cannot repeat the result deliberately.

Finally, validation. The trades that suggested an improvement cannot also confirm it, because the
improvement was fitted to them. A change is validated on a later, untouched period of data that played
no part in the original decision. And even then, the honest position is that a strategy which performed
well over one month, one pair and one session is a hypothesis rather than a system — markets change, and
nothing guarantees the next sample resembles the last.

## 3. Real Chart Walkthrough

These are hypothetical figures from a single monthly review, used only to show how the statistics are
read. Suppose the month produced 42 trades on one practice account.

Rule adherence was 76%, meaning 32 of the 42 trades followed the written plan. Expectancy across all 42
trades was +0.2R. Restricted to the 32 trades that followed the plan, expectancy was +0.4R. Costs
totalled 6.8R over the month. Splitting by session: London contributed +8.2R, New York −3.1R, and the
Asian session −1.0R. The largest drawdown from a peak was 7R.

Read in the correct order, the review says this. First, adherence is 76%, which is the number to fix
before reading anything else, because one trade in four was not the strategy. Second, the gap between
+0.4R on followed trades and +0.2R overall is the cost of the unfollowed ones. Third, costs of 6.8R
against a positive expectancy is a meaningful drag and worth understanding.

The output is deliberately small: one strength, one weakness, one experiment. Strength — adherence
improved from the previous month. Weakness — Asian-session trades contributed a loss across the sample.
Experiment — remove Asian-session trades for the next 30 trades and change nothing else, then compare on
that fresh sample.

Notice what the example does not claim. These figures describe one month, one account and one strategy.
A positive expectancy over 42 trades is not a forecast, and it is not evidence that the method will
continue to work. It is a description of a sample, and it is only as useful as the adherence figure
underneath it.

## 4. Common Mistakes

- Drawing a firm conclusion from a handful of trades, where one result decides the answer.
- Changing entry, stop, target and size at once, so no improvement can be attributed to anything.
- Validating a change on the same trades that suggested it, which guarantees the improvement is fitted rather than real.
- Reading the profit and loss statistics before checking rule adherence, so a strategy you did not actually trade gets credited.
- Treating one good month as proof the method works, or one bad month as proof it does not.

## 5. The SAGZFX Rule

Change one variable, measure it on a sample you did not use to invent it, and let the evidence — not the
last losing week — decide what stays.

## 6. Practice Assignment

Open the SAGZFX Practice Account. This account uses virtual money only, no real order is ever placed,
and nothing you do here can earn or lose you real funds.

Using a set of hypothetical trades — at least 30, so that no single result dominates — prepare a monthly
review. Calculate the six figures: expectancy after costs, average win, average loss, largest drawdown,
total costs, and rule adherence. Split the results by session as well, and state the sample size
alongside every number you report.

Then write exactly three lines: one strength, one weakness, and one experiment. The experiment must
change a single variable, and it must state which fresh, unseen sample you will measure it on and how
many trades that sample will contain. Anything you cannot state as one variable is not ready to test.

*Why this matters:* a review that changes one variable and validates on unseen data produces knowledge;
a review that changes four at once produces a story about the month that just ended.

## 7. Checkpoint Question

**Question:** A monthly review shows positive expectancy overall, but rule adherence was only 60%. What is
the correct interpretation and first action?

- A. The strategy is working; increase position size and continue.
- B. The expectancy figure describes a mixture of the plan and improvised trades, so improve adherence first and re-measure.
- C. The strategy has failed; abandon it and design a new one.
- D. Adherence is a soft measure and can be ignored while expectancy is positive.

**Correct answer:** B

**Why:** Rule adherence is read before the performance statistics because low adherence means the
expectancy figure describes trades that were not the strategy, so adherence is the first thing to fix.
