---
module_id: L1-MOD5
tier: Beginner
title: Trading platforms (MT4/MT5)
estimated_minutes: 45
lesson_status: draft
learning_outcomes:
  - How the main areas of a MetaTrader platform are laid out, and what each one is for.
  - How to change a timeframe, add an indicator and read an order ticket.
  - What the account history and trade tabs tell you about the trades you have already taken.
reviewed_by: null
lesson_updated_at: 2026-10-13
---

# Trading platforms (MT4/MT5)

## 1. What You'll Learn

- How the main areas of a MetaTrader platform are laid out, and what each one is for.
- How to change a timeframe, add an indicator and read an order ticket.
- What the account history and trade tabs tell you about the trades you have already taken.

## 2. Plain-English Explanation

MetaTrader 4 and MetaTrader 5 are the two platforms most retail forex traders use. They look similar
and do the same basic job: they display price charts, let you place and manage orders, and keep a
record of what you have done. Your broker supplies the platform, and the prices in it come from that
broker.

The platform is divided into areas you will use constantly. The **Market Watch** window lists the
symbols your broker offers, with the current bid and ask for each one. This is where you check what is
available and how wide the spread is before you commit to anything. The **chart window** is the main
working area, where price is drawn as candles or bars. The **timeframe selector** along the top lets
you switch between M1, M5, M15, M30, H1, H4, D1, W1 and MN, from one minute per candle up to one
month per candle. The **Navigator** panel holds indicators and expert advisors you can attach to a
chart. The **Terminal** at the bottom holds your open positions, your pending orders, your account
balance and equity, and your trade history.

To place a trade you open the **order ticket**. It contains fields you have already met: symbol,
order type, lot size, entry price, stop-loss and take-profit. Read every field before you fill
anything in. The lot size field in particular decides what the trade is worth per pip, and it is the
field beginners most often leave at whatever value was already there.

Two habits are worth building from the first day. The first is practising on a **demo account**
before using any live account. A demo account is funded with virtual money, so a mistake costs you
nothing and teaches you the same lesson. MetaTrader demo accounts are supplied by the broker and
behave like the live platform, which is exactly why they are useful.

The second habit is reading your **account history**. Every trade you close is recorded there with
its entry, exit, size and result. This is the raw material of review. A trader who never opens the
history tab is guessing about their own behaviour. Trading involves a real risk of loss, and the
history tab is where you find out what your losses actually came from.

A note on what the platform is not. The prices shown are your broker's quoted prices for a retail
account. They are not a record of institutional order flow, and nothing in the platform reveals what
large institutions are doing.

## 3. Real Chart Walkthrough

The following is a hypothetical practice exercise rather than a trade idea, and the numbers are
invented for illustration. Suppose you open EUR/USD on the H1 chart at 1.0850 and the Market Watch
window shows a bid of 1.0849 and an ask of 1.0851, a spread of 2 pips.

You open the order ticket and set a buy of 0.10 lots — a micro-lot position — with a stop-loss 30 pips
below your entry and a take-profit 60 pips above it. Before clicking, you read each field back and
confirm the stop and target are where you intended them to be rather than where the platform
defaulted them.

You then switch the chart to M15 and to H4 and notice that the same price looks like a pullback on one
timeframe and a flat range on another. That is not a contradiction; it is what different timeframes
do. You attach a moving average indicator to the chart and observe that it lags price rather than
predicting it.

Finally you open the history tab and read the record of the demo trade, checking that the entry,
exit, lot size and result all match what you intended. The point of this exercise is to prove you can
operate the platform deliberately under no pressure. Whether the demo trade itself ended in a gain or
a loss tells you nothing useful, and a single result never does.

## 4. Common Mistakes

- Placing a first trade on a live account instead of spending real time on a demo account.
- Leaving the lot size field at its default value without deciding whether that size suits the account.
- Setting a stop-loss in price terms by eye instead of by a number decided in advance.
- Switching timeframes repeatedly until one of them supports the trade you already wanted to take.
- Never opening the history tab, and so never learning what your own results actually look like.

## 5. The SAGZFX Rule

Learn to operate the platform deliberately on a demo account first, because fumbling the order ticket
is a mistake you should only ever make with virtual money.

## 6. Practice Assignment

Complete this exercise in the SAGZFX Practice Account, which uses virtual money only. No real order is
placed and no real funds are at risk.

Open a chart for EUR/USD in the practice terminal and work through the following, writing a short note
on each step:

1. Change the timeframe from M1 through to D1 and describe in one sentence how the picture changes.
2. Add one simple indicator — a moving average is enough — and note whether it appears to lead price or follow it.
3. Open the order ticket and read every field aloud, including lot size, stop-loss and take-profit.
4. Place one demo order with a lot size of 0.01, a stop-loss and a take-profit, then locate it in the terminal.
5. Close the position and find it in the account history, checking that the recorded entry, exit and result match what you set.

*Why this matters:* platform fluency is not the same skill as trading, but a trader who cannot execute
cleanly will blame the market for their own operating errors.

## 7. Checkpoint Question

**Question:** Which panel would you open to see the entry price, exit price and result of a trade you closed yesterday?

- A. The Market Watch window.
- B. The Navigator panel.
- C. The account history tab in the Terminal.
- D. The timeframe selector.

**Correct answer:** C

**Why:** Closed trades are recorded in the account history, while Market Watch lists symbols and prices, the Navigator holds indicators, and the timeframe selector only changes chart resolution.
