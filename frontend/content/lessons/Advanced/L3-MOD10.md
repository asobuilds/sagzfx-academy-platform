---
module_id: L3-MOD10
tier: Advanced
title: Session & Kill-Zone Analysis
estimated_minutes: 45
lesson_status: draft
learning_outcomes:
  - What the main trading sessions are in UTC, and why their local clock times shift with daylight saving.
  - How session ranges and opens form, and why a kill zone is a window of higher participation rather than a window of guaranteed movement.
  - How session timing changes which setups are available to you, and why you should fix your chart to a single timezone.
reviewed_by: null
lesson_updated_at: 2026-10-13
---

# Session & Kill-Zone Analysis

## 1. What You'll Learn

- What the main trading sessions are in UTC, and why their local clock times shift with daylight saving.
- How session ranges and opens form, and why a kill zone is a window of higher participation rather than a window of guaranteed movement.
- How session timing changes which setups are available to you, and why you should fix your chart to a single timezone.

## 2. Plain-English Explanation

A trading session is a period when one of the major financial centres is open and a large share of the
day's trading in its currency takes place. Foreign exchange runs around the clock, but it does not run
evenly. Participation — the number of transactions occurring, and hence the liquidity available — rises
and falls as Sydney, Tokyo, London and New York take turns being open. This lesson treats time as a
filter: not a signal, but a way of deciding which setups are available at a given hour.

Session times are best written in UTC, a fixed reference clock that does not shift with local customs like
daylight saving. Roughly, the Asian session runs from about 00:00 to 08:00 UTC, London from about 07:00 to
16:00 UTC, and New York from about 12:00 to 21:00 UTC, with London and New York both open from about 12:00
to 16:00. Those are approximate because the centres move their clocks: a window fixed in UTC stops lining
up with the same local working hours twice a year.

The Asia range is the high and low printed during the Asian session — simply a record. Its usefulness is
as a reference: a price level a later session moves beyond, which concentrates liquidity at particular
prices.

A kill zone is the part of a session where participation is typically heaviest — often the opening hours.
The London kill zone is commonly described as roughly 07:00 to 10:00 UTC and the New York kill zone as
roughly 12:30 to 15:00 UTC. Note what that is and is not: a window in which more transactions tend to
occur, so ranges tend to be larger and moves faster. It is not a window in which price is guaranteed to
move, and direction cannot be known in advance. A quiet London open is normal.

What session analysis actually changes is availability. During Tokyo, a setup built on a fifteen-minute
displacement may never form, because the moves are smaller. During the London and New York overlap, the
same setup may appear frequently and be reached far faster. The final discipline is consistency: fix your
chart to one timezone, write down which windows you trade, and judge your results against those fixed
windows rather than moving them.

## 3. Real Chart Walkthrough

These are hypothetical numbers, used only to illustrate the process. Suppose it is a Wednesday and you are
studying USD/CAD on the five-minute chart, with your platform set to UTC.

Between 00:00 and 07:00 UTC the Asian session prints a range with a high at 1.3612 and a low at 1.3580 —
32 pips. You mark both edges as the Asia range. During the London window, between 07:00 and 10:00 UTC,
price moves above 1.3612 and reaches 1.3624, then returns to 1.3605. The 1.3612 high has now been traded
beyond, so it is now a swept level rather than an untouched one.

It is now 12:30 UTC, the start of the New York kill zone. You have a dealing range from 1.3580 to 1.3624,
a swept high at 1.3612 sitting behind the recent move, and 1.3605 as the current price. What the calendar tells you is that more transactions are likely over the next two and a half hours than
during the Asian session. That is all: not which way price will go, and not how wide the range will be.

Write the two conditions before anything happens. If price closes a five-minute candle above 1.3624, the
sweep has been extended and the swept-high reading needs to be reassessed. If price closes below 1.3580,
the Asia range low has been taken on the other side and the dealing range no longer describes the market.
Both are ordinary possibilities, and neither is more likely because of the clock.

## 4. Common Mistakes

- Treating a kill zone as a promise of movement and taking a position just because the clock says so.
- Defining session windows in local time, so they drift an hour against the market and results stop being comparable.
- Using the Asia range as a directional forecast instead of a record of two price levels.
- Applying a fifteen-minute displacement model during the quietest hours and concluding it has stopped working.
- Assuming wide overlap-hour ranges mean an easy session, when faster movement also means faster invalidation.

## 5. The SAGZFX Rule

Fix your chart to one timezone, write down the windows you trade, and treat them as periods of higher participation rather than as periods of expected direction.

## 6. Practice Assignment

Open the SAGZFX Practice Account. It uses virtual money only, no real order is ever placed, and nothing
you do here can earn or lose you real funds.

Set your chart to UTC and confirm the setting is applied to the time axis. Choose one pair.

Over fifteen trading days, record the Asia range for each day — high, low and height in pips — using the
window 00:00 to 07:00 UTC. Then record the height of the London window (07:00 to 10:00 UTC) and the New
York window (12:30 to 15:00 UTC) on the same days, and note whether price traded beyond the Asia range
high or low during each. Build a table with one row per day and compare the three heights.

Finally, write two sentences: which of the three windows most often contained the day's largest range in
your sample, and what you would need to see before treating that as a stable pattern rather than a feature
of fifteen days.

*Why this matters:* measuring the windows yourself replaces an assumption about when the market is busy
with a record of what your own pair actually did, and writing the second sentence keeps a fifteen-day
sample in its proper place.

## 7. Checkpoint Question

**Question:** It is 08:00 UTC and the London kill zone is open. Which statement is accurate?

- A. Price is more likely to trend than to range during this window, so a directional position is justified.
- B. The window is likely to contain heavier participation, meaning larger ranges and faster moves, but nothing about direction or outcome is implied.
- C. A position should be taken at the open of every kill zone, because movement is expected.
- D. Kill zones are defined in local time, so they stay fixed against the market all year.

**Correct answer:** B

**Why:** Kill zones describe a period of higher transaction activity, which affects how much and how
quickly price moves but says nothing about which way it will go or whether a setup will work.
