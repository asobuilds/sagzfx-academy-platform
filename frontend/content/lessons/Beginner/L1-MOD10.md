---
module_id: L1-MOD10
tier: Beginner
title: Basic Risk Management
estimated_minutes: 45
lesson_status: draft
learning_outcomes:
  - How to decide the affordable loss on a trade before you enter it.
  - The four inputs that determine position size: account equity, risk amount, stop distance and contract specifications.
  - Why a stop distance on its own tells you nothing about the cash you are risking.
reviewed_by: null
lesson_updated_at: 2026-10-13
---

# Basic Risk Management

## 1. What You'll Learn

- How to decide the affordable loss on a trade before you enter it.
- The four inputs that determine position size: account equity, risk amount, stop distance and contract specifications.
- Why a stop distance on its own tells you nothing about the cash you are risking.

## 2. Plain-English Explanation

Risk management is not the part of trading that makes money. It is the part that decides whether you
are still trading in six months. For a beginner, it is more important than any chart pattern in this
tier.

The core habit is simple: **decide the affordable loss before you enter**. Not after. Not while the
trade is live and the number on the screen is moving. Before. Once you are in a trade, your judgement
about acceptable loss changes, and it changes in the direction that hurts you.

To do this you need four numbers.

**Account equity** is what your account is worth right now — balance plus or minus the floating result
of any open positions. It is not the same as your starting balance, nor as your balance once trades
are running.

**Risk amount** is the money you are prepared to lose on this one trade, in a currency figure. Most
beginners are taught to work in a small fixed percentage of equity. If your account equity is 1,000
dollars and you plan to risk 1 per cent, your risk amount is 10 dollars before costs. The percentage
is a planning convention, not a rule the market respects.

**Stop distance** is how far your stop-loss sits from your entry, measured in pips. This is where the
lesson's key point lives. **A stop distance alone does not tell you the cash risk.** Thirty pips means
nothing until you know your lot size: it might be 3 dollars, it might be 300.

**Contract specifications** are the last input, and they vary by pair and broker. They tell you what
one pip is worth per lot. You find them on the broker's specification page or in the platform, and you
check them rather than assuming them.

With those four numbers you can size a position. Divide your risk amount by the value of your stop
distance at one lot, and you get the lot size that keeps your planned loss at the number you chose.
If that lot size is smaller than the platform's minimum, the trade is too large for your account and
the correct action is to skip it.

Two further points. This is planned risk, not guaranteed loss: your actual loss can be larger if your
stop fills beyond its level in a fast market. And costs are real — the spread and any commission come
out of every trade. Trading carries a real risk of loss, and this lesson exists to keep any single
loss small enough that it does not end your education.

## 3. Real Chart Walkthrough

These are hypothetical numbers, used only to show the arithmetic. Suppose your practice account equity
is 1,000 dollars and you plan to risk 1 per cent of it, which is 10 dollars before costs. You are
looking at EUR/USD on the H1 chart during the London session.

Your analysis gives you an entry at 1.0900 and a stop at 1.0870, which is a stop distance of 30 pips.
The spread is 2 pips, so your effective entry is slightly worse and your true stop distance a little
wider than 30 pips.

Now you check the contract specification. Suppose one pip is worth about 1 dollar per mini lot on this
pair. Thirty pips on a mini lot would therefore be roughly 30 dollars of risk — three times your
planned 10 dollars. To keep the risk at your planned figure you would need roughly a third of a mini
lot, so about 0.03 lots, subject to your broker's minimum size.

Notice what has happened. The chart gave you one number — 30 pips — and that number was not a risk
figure until you supplied the lot size. Notice too that the position is small and may well lose. A
correctly sized trade is not a safer trade in outcome; it is one whose loss, if it comes, you already
decided you could absorb. Setups of this kind fail regularly, and sizing does not change that.

## 4. Common Mistakes

- Choosing a lot size first and only then working out what the stop would cost.
- Risking a fixed percentage on every trade without checking whether the resulting lot size even exists.
- Treating account balance as equity while positions are open and floating.
- Ignoring the spread when calculating the true distance from entry to stop.
- Increasing risk after a losing streak to win the money back faster.

## 5. The SAGZFX Rule

Decide what you can afford to lose before you decide what you want to earn, and let that number set
your position size.

## 6. Practice Assignment

Complete this exercise in the SAGZFX Practice Account, which uses virtual money only. No real order is
placed and no real funds are at risk.

Assume a practice account equity of 1,000 dollars and a planned risk of 1 per cent per trade, which is
10 dollars before costs. Then, for each of the following hypothetical setups, calculate the position
size that would keep the planned loss at that figure:

1. EUR/USD, entry 1.0900, stop 1.0870 (30 pips).
2. GBP/USD, entry 1.2650, stop 1.2600 (50 pips).
3. USD/JPY, entry 150.20, stop 150.00 (20 pips, remembering JPY pairs are quoted to two decimals).

For each one, write the account equity, the risk amount, the stop distance in pips, the value of one
pip per lot from the platform's contract specifications, and the resulting lot size. Where the
calculated size falls below the platform's minimum, write "skip" and explain why.

*Why this matters:* this calculation is the one piece of arithmetic you will repeat on every trade for
the rest of your trading life, and it takes less than a minute once it is a habit.

## 7. Checkpoint Question

**Question:** On a 1,000 dollar account with 1 per cent planned risk, why does a 30-pip stop not by itself tell you the cash at risk?

- A. Because the spread always doubles the risk.
- B. Because pips are worth different amounts depending on your lot size and the pair's contract specifications.
- C. Because the account equity changes every time you place a trade.
- D. Because stops always fill beyond their level.

**Correct answer:** B

**Why:** Cash risk is the stop distance multiplied by the pip value for your lot size, so the same 30-pip stop can mean a few dollars or several hundred depending on position size.
