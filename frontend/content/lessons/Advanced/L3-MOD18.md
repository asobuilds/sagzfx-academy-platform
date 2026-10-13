---
module_id: L3-MOD18
tier: Advanced
title: Advanced Trade Execution
estimated_minutes: 45
lesson_status: draft
learning_outcomes:
  - How market, limit and stop orders each commit you to a different kind of promise, and when each is appropriate.
  - Why the spread widens around news releases and session opens, and what that widening does to the price you actually receive.
  - How to record the gap between the trade you intended and the trade you got, and how to prepare a written response for losing your connection mid-trade.
reviewed_by: null
lesson_updated_at: 2026-10-13
---

# Advanced Trade Execution

## 1. What You'll Learn

- How market, limit and stop orders each commit you to a different kind of promise, and when each is appropriate.
- Why the spread widens around news releases and session opens, and what that widening does to the price you actually receive.
- How to record the gap between the trade you intended and the trade you got, and how to prepare a written response for losing your connection mid-trade.

## 2. Plain-English Explanation

In the Market Structure tier you built entry models: written sets of conditions for when a trade is worth
taking. The price you decided on and the price you receive are two different numbers, and the distance between
them is what this lesson is about.

Execution starts with order types. An order is your instruction to the venue that matches buyers and sellers.
A market order says: fill me now, at whatever price is available, prioritising getting filled over the price
you get. A limit order says: fill me only at this price or better, and if that price never appears, do not fill
me at all — prioritising price over certainty of being filled. A stop order sits inactive until price reaches
a level you have nominated, at which point it becomes a market order; this is how a protective exit is usually
placed.

The price on your chart is a two-sided quote, not one number. The spread is the difference between the best
price you can buy at and the best price you can sell at, a cost you pay on every trade. Spread rests on
liquidity: the depth of resting orders available to trade against. When liquidity is deep, spreads are narrow;
when it thins, spreads widen, and they widen precisely when the market is most interesting — around a
scheduled news release, and around a session open or close as one trading centre hands over to the next.

Slippage is the difference between the price you expected and the price you got, largest when you need speed
most: market and stop orders in thin conditions. A partial fill is when an order fills in pieces, leaving you
holding less than you planned and quietly changing your risk, because your stop and target were sized for the
whole position. None of this argues for a particular order type or venue; it argues for measuring: hold
intention and outcome side by side in your records, so the gap becomes a number you can look at rather than a
feeling you argue with.

Finally, execution depends on technology you do not control: connections drop, platforms restart, mobile data
fails. The professional answer is not optimism but a written contingency — what you do if you lose connection
with a position open, who you contact, and how you close it once you are back.

## 3. Real Chart Walkthrough

These numbers are hypothetical and illustrate the process only. Suppose your plan for the London session says:
on EUR/USD, buy a break of the Asian range high at 1.0860, with a stop at 1.0835 and a target at 1.0925. You
choose a limit order at 1.0858, because the entry model from the Market Structure tier lets you name your price
in advance.

You look at the five-minute chart around the 08:00 London open and write down the quote. At 07:55 the spread
reads 0.6 pips. At 08:00:30, as London liquidity arrives and the overnight book is repriced, it reads 3.2 pips.
The ask is briefly 1.0861, above your limit at 1.0858, so your order sits unfilled while the level is touched.
Your instruction was "at this price or better", and better did not appear when you wanted it.

You also note a scheduled inflation release at 13:30 local time, and write in advance that you will have no
working order in the two minutes either side of it, and that if already in a position the spread and any
slippage on your protective stop can be wider than usual.

This example establishes a measurement, not an outcome. The setup could have filled and been stopped, filled
and moved straight against you, or never filled at all. It tells you how your execution compared with your
intention, and nothing about what happened next.

## 4. Common Mistakes

- Chasing a thin market with a market order, then blaming the slippage on bad luck.
- Leaving resting orders through a scheduled news release to avoid admitting you were unsure.
- Recording only entry and exit prices, never the spread at the time, so a fill cannot be explained later.
- Managing a position after a partial fill as though it were the full size planned.
- Having no written answer to a mid-trade connection drop, and improvising it during an outage.

## 5. The SAGZFX Rule

Record what you intended and what you received as two separate numbers, and write your contingency for losing connection before you ever need it.

## 6. Practice Assignment

Open the SAGZFX Practice Account. It uses virtual money only, no real order is ever placed, and nothing you do
here can earn or lose you real funds.

Pick one major pair and one exchange session. On three separate days, write down the spread two minutes before
the session open, at the open itself, and five minutes after. You are logging the number, not trading it.

Then place ten practice orders using at least two order types, recording for each a four-line journal entry: the
order type, the price you intended, the price you received, and whether the fill was complete or partial. Where
a fill differs from your intention, add one sentence naming the likely cause.

Finally, write a one-page contingency note answering three questions: how you would know you had lost
connection, what you would do in the first sixty seconds, and how you would close or reduce any open position
once you were back online.

*Why this matters:* the gap between intent and fill is a cost you can only manage once you measure it, and a
contingency is only usable when it was written before the outage.

## 7. Checkpoint Question

**Question:** Your plan says to buy EUR/USD at 1.0858 or better, and your limit order is resting. At the London
open the level is touched, but the quote you can buy at is 1.0861 and your order does not fill. What is the most
accurate reading of this?

- A. The platform failed and the order should have filled at the exact level.
- B. The entry level in the plan must be changed.
- C. A limit order keeps its promise — it fills at your price or better — and the buy price available at that moment was above your level.
- D. A market order should always be used so that planned levels fill exactly.

**Correct answer:** C

**Why:** A limit order prioritises price over certainty of filling, so an approach where the available buy price sits above your level leaves the order unfilled by design, not by fault.
