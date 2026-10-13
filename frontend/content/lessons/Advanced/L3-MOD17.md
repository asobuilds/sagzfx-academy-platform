---
module_id: L3-MOD17
tier: Advanced
title: Prop-Firm Risk Management
estimated_minutes: 45
lesson_status: draft
learning_outcomes:
  - How evaluation-style rules differ from the personal risk limits you already set for yourself.
  - What static and trailing maximum drawdown mean, and why a trailing drawdown shrinks your position-sizing room as you profit.
  - Why the rules of an evaluation are meant to be traded inside rather than gamed, and where to confirm the exact terms.
reviewed_by: null
lesson_updated_at: 2026-10-13
---

# Prop-Firm Risk Management

## 1. What You'll Learn

- How evaluation-style rules differ from the personal risk limits you already set for yourself.
- What static and trailing maximum drawdown mean, and why a trailing drawdown shrinks your position-sizing room as you profit.
- Why the rules of an evaluation are meant to be traded inside rather than gamed, and where to confirm the exact terms.

## 2. Plain-English Explanation

In earlier tiers you set your own risk limits, and the only person enforcing them was you. Some trading arrangements work differently: a firm provides capital and an account, and you trade under rules the firm sets and measures. Such arrangements vary, so this lesson describes the rules generically. The exact figures, and how each is calculated, differ between firms and can change, so the terms document of the arrangement is the only authoritative source. Read it directly, not a summary from elsewhere.

The first rule type is a daily loss limit: the maximum you are permitted to lose within a defined day, measured on closed positions, open positions, or both — the terms say which. If it is reached, the day is over. Yours is a preference you chose; a firm's is a condition of the account.

The second is maximum drawdown, the total loss from a defined starting point that ends the arrangement. A static drawdown is fixed: set from your starting balance, it does not move as your balance changes. A trailing drawdown moves, with the floor rising as your equity makes new highs. Under a trailing drawdown, profits are not a cushion you can risk; your remaining room is the distance from current equity down to the raised floor, which can be far smaller than the headline percentage suggests.

Position sizing follows from that room, not the account size. A fixed fraction of the account can be reckless when the room to the floor is small, so size against the buffer and recalculate as the floor moves.

Firms commonly add further conditions. A consistency requirement limits how much of your total result may come from a single day or a few days. A minimum trading days rule requires a certain number of active days. News restrictions limit or prohibit holding positions through scheduled releases that can move price sharply. Each is disclosed in the terms.

Finally, the "just pass the challenge" mentality deserves a direct answer. Approaching these rules as an obstacle to game — sizing recklessly because a breach only ends an evaluation, or cramming activity in to satisfy minimum days — treats them as paperwork rather than the risk framework you will trade inside once capital is behind you. The rules exist to be traded inside, not gamed.

## 3. Real Chart Walkthrough

The figures below are hypothetical, used only to show the arithmetic. Real terms vary by firm and must be read in that firm's documents.

Suppose an arrangement states a five per cent maximum drawdown, a three per cent daily loss limit, and a drawdown that trails your equity high. On a one hundred thousand dollar account, the drawdown floor begins at ninety-five thousand.

Earlier in the week your equity reached one hundred and two thousand five hundred, and the trailing floor moved up to ninety-seven thousand five hundred. Later trades give some of that back, and this morning your equity stands at one hundred thousand — the same balance you started with. The floor, however, has not returned to ninety-five thousand. Your remaining room is two thousand five hundred, not five thousand, even though you have made nothing overall.

Now suppose you are looking at EUR/USD on the fifteen-minute chart during the London session, and your plan permits a risk of one per cent — one thousand dollars here. Against a remaining room of two thousand five hundred, that single position is forty per cent of everything you can lose before the arrangement ends. Three losses of that size would total three thousand — under the daily loss limit, but through the trailing floor.

Notice what the walkthrough does not decide: it does not say the trade is taken, or whether it would have won or lost — it could have done either. The point is only that the floor moved while the balance did not, so a size that looked correct at the start of the week is no longer correct now.

## 4. Common Mistakes

- Reading a summary of the rules instead of the firm's terms document.
- Treating a trailing floor as though it still sat at the starting balance after new highs.
- Sizing every trade as a fixed fraction of account size without recalculating the floor.
- Ignoring consistency and minimum trading days until the pattern is already fixed.
- Treating the rules as something to survive rather than the framework to trade inside.

## 5. The SAGZFX Rule

Read the terms, size against the room that actually remains, and trade inside the rules rather than around them.

## 6. Practice Assignment

Open the SAGZFX Practice Account. It uses virtual money only, no real order is ever placed, and nothing you do there can earn or lose you real funds.

Write a one-page mock rule set of your own, using the categories from this lesson: a daily loss limit, a maximum drawdown stated as a percentage, a choice between a static and a trailing floor, a consistency condition, and a minimum trading days figure. State every number explicitly at the top.

Then build a small table with three columns for three scenarios: equity at the starting balance, equity up two per cent, and equity up four per cent. For each row, calculate the floor, the remaining room from equity to that floor, and the largest position your standard risk per trade would allow without the loss exceeding one third of that room. Finish with two sentences on how the numbers differ between the static and trailing versions of the same drawdown percentage.

*Why this matters:* the arithmetic of a trailing floor is invisible until it is written down, and sizing from the room that remains rather than the account balance is what keeps a good run from being given back.

## 7. Checkpoint Question

**Question:** An account has a five per cent trailing maximum drawdown. Your equity has risen four per cent above the starting balance, and the floor has tracked it upward. Which statement about your position sizing is correct?

- A. The rising equity is a cushion, so position sizes can increase in proportion to the profit.
- B. The remaining room is measured from current equity down to the raised floor, so the correct size must be recalculated and is not larger than before.
- C. A trailing floor is irrelevant to sizing, because only the daily loss limit affects position size.
- D. The profit above the starting balance is protected, so any loss can be absorbed by it without risk to the account.

**Correct answer:** B

**Why:** A trailing floor rises with your equity, so the room to the floor stays roughly constant rather than growing, and size is calculated from that remaining distance.
