---
module_id: L4-MOD8
tier: Masterclass
title: Risk calculation
estimated_minutes: 45
lesson_status: draft
learning_outcomes:
  - How cash risk is derived from account equity and a chosen risk percentage.
  - What else determines position size: stop distance, pip or point value, contract size, currency conversion and costs.
  - Why broker specifications must be verified rather than assumed or copied from someone else.
reviewed_by: null
lesson_updated_at: 2026-10-13
---

# Risk calculation

## 1. What You'll Learn

- How cash risk is derived from account equity and a chosen risk percentage.
- What else determines position size: stop distance, pip or point value, contract size, currency conversion and costs.
- Why broker specifications must be verified rather than assumed or copied from someone else.

## 2. Plain-English Explanation

Risk calculation turns an intention into a number. "I will risk a small amount" is not a risk plan,
because small is not a quantity and it changes with your mood. A risk plan produces a figure you can
write down before the trade and check afterwards.

Start with account equity — the current balance you are trading. Then apply a risk percentage: a fixed
fraction of that equity you are willing to lose on a single trade, chosen in advance and applied to
every trade without exception. The combination gives your planned cash risk. On a $2,000 balance, a 0.5%
risk percentage gives $10 of planned risk before costs. That $10 is the budget the rest of the
calculation has to fit into.

Position size is then an output, not a choice. It depends on five inputs. **Stop distance** in pips or
points, taken from the invalidation level as measured in the previous lesson. **Pip or point value**,
which varies by pair. **Contract size**, where a standard lot is typically 100,000 units of the base
currency — a convention, not a law, so confirm it. **Currency conversion**, which matters when the quote
currency of the pair is not the currency your account is denominated in; if your platform does not
handle that conversion for you, the calculation is not finished. And **costs** — spread, commission and
swap — which are part of what the trade costs you, so a risk figure that ignores them is lower than the
real one.

With those inputs, the chain runs: cash risk, divided by stop distance, adjusted by pip value per lot,
gives the number of lots. Change any input and the size changes. That is why "what lot size should I
use?" has no answer outside a specific setup.

Two limits are worth stating plainly. Risk percentage is a per-trade limit, not a portfolio limit:
three correlated positions each risking 0.5% is not 0.5% of exposure, it is closer to 1.5% of the same
idea. And a planned risk figure is a limit on intended loss, not a cap on actual loss — gaps, slippage
and fast markets can fill a stop at a worse price than the one written.

## 3. Real Chart Walkthrough

These are hypothetical numbers, used only to show the arithmetic. Suppose a practice account holds
$2,000 and the chosen risk percentage is 0.5% per trade.

Planned cash risk: $2,000 multiplied by 0.5% equals **$10**, before costs.

Now take a EUR/USD long with an entry at 1.0910 and an invalidation level at 1.0880. The stop distance
is **30 pips**. For a USD-denominated account trading a pair quoted in USD, a standard lot is commonly
worth around $10 per pip — but this is exactly the figure you must verify against your own broker's
published contract specifications rather than take from a video or another platform.

Using that illustrative value: the size that makes 30 pips equal $10 is $10 divided by (30 pips
multiplied by $10 per pip per lot), which is approximately 0.033 lots, rounded down to 0.03 lots, which
risks about $9.

Then account for costs. A spread of 0.8 pips at that size adds roughly $0.24 to the cost of the round
trip, commission depends on the account type, and swap applies if the position is held overnight. So the
true planned loss is slightly above $10 unless those costs are budgeted into the figure.

Notice what this example does not do. It does not tell you the trade would work, and it does not promise
the stop fills at 1.0880. Every number here is illustrative and must be replaced with your own broker's
verified specifications before it means anything on your account.

## 4. Common Mistakes

- Risking a percentage of equity on several correlated positions and treating the total as a single unit of risk.
- Copying pip values from a video, a group or another broker instead of checking your own contract specifications.
- Leaving spread, commission and swap out of the calculation, so the written risk is lower than the real risk.
- Increasing the risk percentage after a losing run in order to recover the losses more quickly.
- Treating the planned risk figure as the maximum possible loss when slippage and gaps can exceed it.

## 5. The SAGZFX Rule

Risk is a number you calculate from verified inputs before entry — not a feeling you estimate afterwards.

## 6. Practice Assignment

Open the SAGZFX Practice Account. This account uses virtual money only, no real order is ever placed,
and nothing you do here can earn or lose you real funds.

Assume a practice equity of $2,000 and a risk percentage of 0.5%. Write out the planned cash risk as a
single figure before costs.

Then take two pairs with different quote currencies — for example EUR/USD and USD/JPY — and for each one
write the entry, the invalidation level, and the stop distance in pips. Show the arithmetic that converts
your cash risk and stop distance into a position size, writing down each input you used: pip value,
contract size, and any currency conversion. Note where you had to look up a figure rather than assume
it, and write down which broker document you checked.

Finish with one sentence on costs: how much spread, commission and swap add to the planned loss at the
size you calculated.

*Why this matters:* writing each input down separately shows which ones you verified and which ones you
guessed, and the guesses are where the difference between planned risk and real risk lives.

## 7. Checkpoint Question

**Question:** A $2,000 account risks 0.5% per trade. A EUR/USD long has an entry at 1.0910 and an
invalidation level at 1.0880, a 30-pip stop distance. Which statement is correct?

- A. The planned cash risk is $10 before costs, and the position size is derived from the 30-pip stop distance.
- B. The position size should be chosen first, and the stop distance adjusted to fit the $10.
- C. The planned cash risk is $100, since 0.5% of $2,000 is $100.
- D. The 30-pip stop distance is irrelevant as long as the cash risk is $10.

**Correct answer:** A

**Why:** Planned cash risk is equity multiplied by the risk percentage, giving $10 before costs, and
position size is an output calculated from that figure and the stop distance — never an input chosen
first.
