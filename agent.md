# Developer Agent System Blueprint: SAGZFX ACADEMY

This document serves as the implementation source of truth, organizing project objectives, data definitions extracted from the official flyer assets, and engineering phases.

## 🎯 Strategic Project Aims
1. **Physical to Digital Parity:** Bridge the Abuja physical site (Shop 5 Aib Plaza, Keffi, Abuja Express Way) to a scalable mobile network environment.
2. **Zero-Overhead Infrastructure Operations:** Secure high-performing video distribution pipelines and low-latency group messaging spaces without incurring massive monthly cloud costs.
3. **Clean UX Monetization Mapping:** Support structural differentiation between base tuition profiles and secondary purchases for proprietary indicators or trade strategies.

---

## 📊 Extracted Flyer Metadata & Identity Coordinates

### Corporate Identity & Physical Footprint
- **Academy Entity:** SAGZFX ACADEMY (RC: 8064497)
- **Motto / Slogan:** Profits Forever | Learn, Trade, Grow
- **Abuja Physical Campus Address:** Shop 5 Aib Plaza, Keffi, Abuja Express Way
- **Primary Contacts:** +234 9152100856, +234 8064963367
- **Digital Handles:** @sagzfxacademy (Telegram, Instagram, Facebook)

### Operational Parameters
- **Core Instruments:** Forex (Currency Pairs), Synthetics (Indices), Cryptocurrency, Stocks, and Commodities.
- **Standard On-Campus Session Rotations:**
  - Morning Shift: 11:00 AM – 1:30 PM
  - Afternoon Shift: 1:30 PM – 3:30 PM

---

## 🎓 Master Curriculum Database Seeding Script Matrix

### LEVEL 1: BEGINNER TRACK
- `L1-MOD1`: Introduction to Forex
- `L1-MOD2`: Currency pairs & market sessions
- `L1-MOD3`: Pips, lots, spreads & leverage
- `L1-MOD4`: Buy/Sell & order types
- `L1-MOD5`: Trading platforms (MT4/MT5)
- `L1-MOD6`: Candlestick basics
- `L1-MOD7`: Support & Resistance
- `L1-MOD8`: Trendlines & market direction
- `L1-MOD9`: Stop Loss & Take Profit
- `L1-MOD10`: Basic Risk Management
- `L1-MOD11`: Trading Psychology
- `L1-MOD12`: How to read a simple chart

### LEVEL 2: MARKET STRUCTURE TRACK
- `L2-MOD1`: Higher Highs, Higher Lows, LH & LL
- `L2-MOD2`: Break of Structure (BOS)
- `L2-MOD3`: Change of Character (CHOCH)
- `L2-MOD4`: Supply & Demand
- `L2-MOD5`: Liquidity & liquidity sweeps
- `L2-MOD6`: Fair Value Gaps (FVG)
- `L2-MOD7`: Order Blocks
- `L2-MOD8`: Premium & Discount
- `L2-MOD9`: Multi-Timeframe Analysis
- `L2-MOD10`: Entry Models
- `L2-MOD11`: Risk-to-Reward
- `L2-MOD12`: Trade Management
- `L2-MOD13`: Trading Journal & Backtesting
- `L2-MOD14`: Fundamental Analysis (News & Economic Calendar)

### LEVEL 3: ADVANCED STRATEGY TRACK
- `L3-MOD1`: Advanced Market Structure
- `L3-MOD2`: Institutional Order Flow
- `L3-MOD3`: Smart Money Concepts (SMC)
- `L3-MOD4`: Liquidity Engineering
- `L3-MOD5`: Inducement
- `L3-MOD6`: Displacement
- `L3-MOD7`: Mitigation & Re-entries
- `L3-MOD8`: Advanced Order Blocks
- `L3-MOD9`: FVG + Liquidity Confluence
- `L3-MOD10`: Session & Kill-Zone Analysis
- `L3-MOD11`: Advanced Multi-Timeframe Setups
- `L3-MOD12`: Correlation Analysis
- `L3-MOD13`: Advanced Risk Management
- `L3-MOD14`: Building a Profitable Trading System
- `L3-MOD15`: Strategy Backtesting & Optimization
- `L3-MOD16`: Trading Psychology at Professional Level
- `L3-MOD17`: Prop-Firm Risk Management
- `L3-MOD18`: Advanced Trade Execution
- `L3-MOD19`: Creating a Personal Trading Plan
- `L3-MOD20`: Becoming a Consistent/Professional Trader

### LEVEL 4: FINAL MASTERCLASS (CAPSTONE)
- `L4-MOD1`: Putting Everything Together (Top-down analysis, Market bias, Liquidity identification, Entry confirmation, SL placement, TP targeting, Risk calculation, Trade management, Journaling, Reviewing and improving the strategy)

---

## 🛠️ Step-by-Step Implementation Roadmap

### Phase 1: Database Construction & User Schema Definition
- Build out PostgreSQL schemas enforcing data field separations.
- Create explicit binary flags (`has_paid_tuition: true/false`) and automated relational maps for subscription array logs (`active_premium_strategies: []`).

### Phase 2: Secure Core LMS & Embedded Free Video Pipeline
- Build dynamic client views displaying custom video controls that block source URI inspection.
- Build the server-side module to track video watch progress percentages and trigger the next chapter unlock hooks.

### Phase 3: Web-Sockets Real-time Forum Spaces
- Initialize channel partitions matching specific target levels (e.g., `#beginner-chat`, `#smc-setups`, `#alumni-lounge`).
- Include optimized payload delivery to support instantaneous chart image distribution across student networks.

### Phase 4: Simulated MT5 Demo Bridge Pipeline
- Hook live pricing streams into UI data nodes to feed real-time client tickers.
- Model standard mock executions (Market, Limit, Stop orders) locally inside the sandboxed student simulator framework.

### Phase 5: Production Rollout, Testing, and Invoicing
- Connect Paystack/Flutterwave subscription webhook endpoints to track recurring event checks.
- Build administrative UI panels to handle fast, localized overrides for students executing direct physical bank transfers inside the Abuja office.
