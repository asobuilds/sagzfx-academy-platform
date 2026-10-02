# SAGZFX ACADEMY – Digital Platform Backend & Frontend

A robust, enterprise-grade hybrid Web and Mobile application built to digitize the physical operations of the **SAGZFX ACADEMY** based in Abuja, Nigeria. The platform features an integrated, video-secured Learning Management System (LMS), real-time student/alumni chat channels, automated multi-tier payments, and a risk-free demo trading module mirroring live market data.

## 🚀 Project Vision & Core Features

- **Sequential Learning Framework:** Structured, lockable course modules tracking Student progress through Beginner, Market Structure, Advanced, and Masterclass thresholds.
- **Data-Optimized Streaming & Downloads:** Bandwidth-efficient media wrapper securing video playback with local device encryption to support unlisted content streaming and offline capability.
- **Hybrid Community Spaces:** Native, interactive forum modules categorized by skill level, trade setups, and alumni discussions for past and current students.
- **Exness Simulated Infrastructure:** Real-time data sync piping live charts and mock order fills into a centralized user dashboard leveraging MT5 system setups.
- **Dual Payment Framework:** Multi-currency payment processing logic running subscription tracking alongside discrete product invoices for advanced add-ons.

---

## 🛠️ System Architecture & Tech Stack

### Frontend Ecosystem
- **Mobile Application:** Flutter (Cross-platform iOS/Android) leveraging a local SQLite database for encrypted course content downloads.
- **Web Portal:** React.js / Next.js with TailwindCSS for the administration panel and web-based student dashboards.

### Backend Infrastructure
- **Server Framework:** Node.js (Express) or Python (FastAPI).
- **Database Architecture:** PostgreSQL (Relational operational data) paired with Redis for live socket-based chat delivery caching.
- **Real-Time Web Sockets:** Socket.io (Custom chat forum layer) or Supabase Realtime API wrapper.

### External Integrations
- **Payment Processing:** Paystack API & Flutterwave SDK for handling domestic and international card networks, bank transfers, and recurring tokens.
- **Data Integration:** MetaTrader 5 Terminal API gateway pulling live data feeds.

---

## 📂 Core Directory Structure

```text
├── apps/
│   ├── mobile/             # Flutter Application codebase
│   └── web-dashboard/      # React/Next.js Administration and Student Web UI
├── services/
│   ├── api-gateway/        # Main route handling & security middleware
│   ├── lms-service/        # Course unlocking, progress logs, and content assets
│   ├── chat-service/       # Websocket servers managing forum channels
│   └── trading-service/    # MT5 / Exness live feed broker abstraction layer
├── infrastructure/
│   ├── docker-compose.yml  # Local developer container configurations
│   └── nginx.conf          # Reverse proxy configuration
└── README.md
```

---

## ⚡ Quickstart & Setup Checklist

1. **Environment Variables Configuration:**
   Copy `.env.example` to `.env` inside the `/services/api-gateway/` and add your gateway tokens, database credentials, and secret strings.
   
2. **Database Migrations:**
   Run your ORM database sync script to initialize user structures, course tracking objects, and forum layouts.
   
3. **Run Services Locally:**
   Execute standard container configurations or initiate localized server startup wrappers sequentially.
