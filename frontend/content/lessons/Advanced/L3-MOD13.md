---
module_id: L3-MOD13
tier: Advanced
title: Advanced Risk Management
estimated_minutes: 45
lesson_status: draft
learning_outcomes:
  - Why risk per idea and risk per position are different numbers, and how correlated exposure makes the first larger than the plan intended.
  - Why drawdown and recovery are not symmetrical, worked through with simple arithmetic rather than market statistics.
  - How to size a position when the stop distance changes, so that the money at risk stays fixed while the size moves.
reviewed_by: null
lesson_updated_at: 2026-10-13
---

# Advanced Risk Management

## 1. What You'll Learn

- Why risk per idea and risk per position are different numbers, and how correlated exposure makes the first larger than the plan intended.
- Why drawdown and recovery are not symmetrical, worked through with simple arithmetic rather than market statistics.
- How to size a position when the stop distance changes, so that the money at risk stays fixed while the size moves.

## 2. Plain-English Explanation

In earlier tiers you learned to fix risk as a percentage of the account, and to place the stop where the
idea would be proven wrong rather than where you could afford it. The advanced level adds that a fixed
percentage per trade is a starting point, not a complete risk policy: it counts one position at a time and
says nothing about several positions being the same idea, or the stop distance refusing to sit still.

Start with the vocabulary you will use throughout. Risk is the money you accept losing if the
idea is wrong — not the position size, not the size of the stop, but the money. Position size is
how much you are actually trading. Stop distance is how far price must travel against you before the idea
is considered dead, measured in pips or in price. Those three quantities are linked by one relationship:
size equals risk divided by stop distance. A trader who fixes size and lets the stop move is not managing
risk; they are letting the market choose it.

Stop distance varies because volatility varies. A common way to measure the normal size of recent movement
is average true range, the average distance price covers from one period to the next. When average true
range is large, stops sit further away and sizes come down. When it is small, the reverse. The arithmetic
is worth running once by hand: with a hundred dollars of risk and a fifty-pip stop, the position is larger
than the same hundred dollars of risk with a hundred-pip stop. Nothing about the market changed; only the
distance did.

Risk per idea is the next layer up. If your plan allows one percent of the account at risk on a single
idea, and you hold three positions that are all short the dollar, the group carries roughly three percent,
not one. Counting per idea means the three positions at one percent each
would be cut to a third of a percent each, or reduced to one position.

Finally, understand the asymmetry between a loss and the gain needed to undo it. This is arithmetic, not a
market statistic. If an account falls twenty percent, it now needs to rise twenty-five percent to get back
to where it started, because the gain is measured from a smaller base. Fall fifty percent and the gain
needed is one hundred percent. The point is that the arithmetic makes large risks disproportionately
expensive to recover from, while making small risks survivable.

## 3. Real Chart Walkthrough

These are hypothetical numbers, used only to illustrate the process.

Suppose you are considering USD/JPY during the Tokyo session and your written maximum risk on any single
idea is half a percent of a ten-thousand-dollar practice balance, which is fifty dollars.

Chart one: the setup sits at a structure level, and the stop belongs forty-five pips below entry at 148.20.
Fifty dollars of risk divided by a forty-five-pip stop gives a position size of roughly one dollar and
eleven cents of risk per pip — that is the size you would take. Note that this is a sizing calculation, not
a trade recommendation; the setup can still fail.

Chart two: the same idea on a wider structure, with the stop belonging ninety pips below entry at 147.75.
The risk stays fifty dollars. The size halves, because the distance doubled. Same account, same rule,
different number of units; the rule survived the change in distance.

Now add a second setup: an existing short USD/CHF position also risking fifty dollars. Both are dollar
shorts. The idea carries about a hundred dollars, or one percent, and the correct written output is to cut
the combined risk back to the fifty-dollar limit — by halving the sizes, or by dropping the weaker of the
two.

## 4. Common Mistakes

- Holding size fixed while stop distance changes, which lets volatility set your risk.
- Sizing each position to one percent and believing the total risk is one percent.
- Moving a stop further away to avoid a loss, changing the risk after the fact.
- Calculating recovery as though a twenty percent fall needed a twenty percent rise.
- Judging risk by your confidence in an idea instead of by the exposure you hold.

## 5. The SAGZFX Rule

Choose the money you are willing to lose before you look at size, then let the distance to your stop — and
nothing else — decide how big the position can be.

## 6. Practice Assignment

Open the SAGZFX Practice Account. It uses virtual money only, no real order is ever placed, and nothing you
do there can earn or lose you real funds.

Pick a practice balance and write a single maximum risk figure per idea as a percentage, then convert it
into money. Take three different setups and, for each, write down the stop distance in pips and calculate
the size using size equals risk divided by stop distance. Show the arithmetic.

Then do the drawdown exercise on paper. Starting from one hundred, apply ten consecutive losses at one
percent risk and record the balance after each. Repeat from one hundred at ten percent risk. Write one
sentence comparing the two final figures, and state which of the two you could continue running after a
losing run of that length.

*Why this matters:* running the sizing formula by hand until it is automatic is what keeps risk constant
when volatility changes the stop distance, and the drawdown exercise makes the arithmetic cost of large
risk concrete instead of theoretical.

## 7. Checkpoint Question

**Question:** Your rule allows fifty dollars of risk on an idea, and your stop distance doubles from
forty-five pips to ninety pips. What should happen to the position size?

- A. It stays the same, because the risk limit has not changed.
- B. It doubles, because the stop is twice as far away.
- C. It halves, because the same money is being divided by twice the distance.
- D. It is set by how strongly you feel about the setup.

**Correct answer:** C

**Why:** Size equals risk divided by stop distance, so holding the money risk fixed while the distance
doubles means the size must halve.
