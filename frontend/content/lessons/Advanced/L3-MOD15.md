---
module_id: L3-MOD15
tier: Advanced
title: Strategy Backtesting & Optimization
estimated_minutes: 45
lesson_status: draft
learning_outcomes:
  - Why the number of trades in a test carries more weight than the single figure everyone quotes from it.
  - What in-sample and out-of-sample data are, and why a test that has already seen the answer proves nothing.
  - How over-optimisation turns a backtest into a description of the past that stops describing anything real.
reviewed_by: null
lesson_updated_at: 2026-10-13
---

# Strategy Backtesting & Optimization

## 1. What You'll Learn

- Why the number of trades in a test carries more weight than the single figure everyone quotes from it.
- What in-sample and out-of-sample data are, and why a test that has already seen the answer proves nothing.
- How over-optimisation turns a backtest into a description of the past that stops describing anything real.

## 2. Plain-English Explanation

In the Market Structure tier you learned to backtest by applying fixed rules to historical charts, and to write what you found into your journal. What changes at this level is the quality of the question you put to the record. A beginner asks whether a rule "works"; a professional asks how much of the result is the rule and how much is having chosen it after knowing the answer.

Start with sample size. A backtest is a test of a written rule run across historical price data. Sample size is the number of trades that test produced. Twelve trades is not evidence; it is twelve anecdotes. A small sample is usually dominated by whichever condition happened to be present. You count, and you write the count at the top of the test.

Then you separate your data. In-sample data is the period you are allowed to study while designing and adjusting the rule. Out-of-sample data is a period you set aside and touch once, at the end, to see whether the rule still describes anything when it has not been tuned to the answer. Related to this is look-ahead bias: the error of using information in a test that would not have been available at the moment of the decision. Entering at a candle's open because you know how that candle closed is the most common way a backtest lies to its author.

Over-optimisation is the central danger. It means adjusting the rule's parameters — the numbers that define entry, stop and target — until the past looks perfect. Every adjustment you make against the same data adds a little knowledge of that data into the rule. Push far enough and you have not built a description of a market behaviour; you have built a description of a specific slice of history, including its accidents. Optimisation exists to find rules that are robust — holding up across nearby settings and unseen data — not rules that score highest on the data you tuned them against.

Forward testing is the bridge: running the rule unchanged in real time on live charts and recording what happens. A backtest result is a description of the past under a set of assumptions. It is never a forecast.

## 3. Real Chart Walkthrough

The following numbers are hypothetical and used only to show the process.

Suppose your written rule is this: on EUR/USD, one-hour chart, during the London session, when price trades below the low of a marked range and then closes back inside that range, you record an entry at that close, a stop below the sweep low, and a target at the range high.

You mark a range with a low at 1.0850 and a high at 1.0920. Price trades down to 1.0835, below the low, then closes the hour back inside the range at 1.0862. Your rule records the row: entry 1.0862, stop 1.0825, target 1.0918. That row goes into the sheet with the date, the session and the timeframe.

Now split the data. You design and adjust the rule using the first nine months, and you hold back the last three months untouched. Suppose a tighter stop setting scores far better across the nine months you tuned on. That score is not evidence, because the tighter stop was chosen by looking at those nine months — the rule has already seen the answers. The three held-back months are where you find out whether it describes anything beyond them.

The walkthrough does not say the trade reached 1.0918, nor that the stop was hit. Either was possible, and the value of the exercise is identical in both cases. The test measures the rule, not your prediction, and a rule that fails the held-back data has taught you something worth more than a flattering number.

## 4. Common Mistakes

- Quoting a headline result from a test without ever stating how many trades produced it.
- Adjusting parameters repeatedly against the same data and calling the final setting a finding.
- Testing on a chart you can scroll forward through, so later bars quietly inform earlier decisions.
- Holding back out-of-sample data in principle, then peeking at it while still tuning.
- Treating a strong historical result as a reason to skip forward testing.

## 5. The SAGZFX Rule

Optimise for a rule that survives data it has never seen, never for the setting that makes the past look best.

## 6. Practice Assignment

Open the SAGZFX Practice Account. It uses virtual money only, no real order is ever placed, and nothing you do there can earn or lose you real funds.

Choose one written rule with at most two adjustable parameters and one pair on one timeframe. Define a test window of at least twelve months and draw the line yourself: the first nine months are in-sample, the final three are out-of-sample and must not be looked at until the design is frozen.

First, run the rule on the in-sample months exactly as written and record every trade in your journal with the sample size stated at the top. Second, change one parameter at a time and note how the result moves as the parameter moves — the shape of that movement matters more than the peak of it. Third, freeze the rule, then run it once on the out-of-sample months and write one paragraph comparing what you saw on each side of the line.

*Why this matters:* the discipline of holding data back and freezing the rule before the final run is the only thing separating a test that informs you from a test that flatters you.

## 7. Checkpoint Question

**Question:** You test a rule on four years of data. You adjust the stop and target dozens of times until the results on those four years look strong, then report the final result. What is the main problem?

- A. Four years is too short a period for any backtest to be useful.
- B. The adjustments have fitted the rule to that specific data, so the result describes the past you tuned against rather than a robust behaviour.
- C. Backtests are always unreliable, so no conclusion of any kind can be drawn.
- D. The problem is only that no forward test was run; the reported result itself remains a valid estimate.

**Correct answer:** B

**Why:** Every adjustment made against the same data leaks knowledge of that data into the rule, so a strong result on tuned data is expected and does not survive into data the rule has not seen.
